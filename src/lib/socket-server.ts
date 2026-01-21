// server/socket-server.ts
import { Server } from "socket.io";
import { createServer } from "http";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
  roomId: string;
  agentId?: string;
}

interface ChatRoom {
  id: string;
  customerId: string;
  status: "active" | "closed" | "waiting" | "inactive";
  createdAt: Date;
  lastActivity: Date;
  messages: Message[];
  assignedAgent?: string;
  hasCustomerMessage: boolean;
}

const chatRooms = new Map<string, ChatRoom>();
const activeAgents = new Map<
  string,
  {
    id: string;
    name: string;
    socketId: string;
    isOnline: boolean;
    currentRoom?: string;
  }
>();

export function initializeSocketServer() {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const isAdmin = socket.handshake.auth?.isAdmin || false;

    if (isAdmin) {
      handleAdminConnection(socket, io);
    } else {
      handleCustomerConnection(socket, io);
    }
  });

  function handleCustomerConnection(socket: any, io: any) {
    console.log("Customer connected:", socket.id);

    let currentRoomId: string | null = null;

    // Send admin status immediately
    const isAdminOnline = activeAgents.size > 0;
    socket.emit("admin_status", { isOnline: isAdminOnline });
    

    socket.on("start_new_chat", () => {
      // Close previous room if exists
      console.log("chatRooms", chatRooms);
       if (currentRoomId && chatRooms.has(currentRoomId)) {
        const oldRoom = chatRooms.get(currentRoomId);
        if (oldRoom && !oldRoom.hasCustomerMessage) {
          chatRooms.delete(currentRoomId);
        }
      }
      // Create new room
      const newRoomId = `customer-${socket.id}-${Date.now()}`;
      currentRoomId = newRoomId;
      socket.join(newRoomId);

      const chatRoom: ChatRoom = {
        id: newRoomId,
        customerId: socket.id,
        status: "inactive",
        createdAt: new Date(),
        lastActivity: new Date(),
        messages: [],
        hasCustomerMessage: false,
      };

      // Add welcome message
      const welcomeMessage: Message = {
        id: "welcome-" + Date.now(),
        text: "Hello! Welcome to our support chat. Send a message to start chatting with our team.",
        sender: "agent",
        timestamp: new Date(),
        roomId: newRoomId,
      };

      chatRoom.messages.push(welcomeMessage);
      chatRooms.set(newRoomId, chatRoom);

      socket.emit("room_created", { roomId: newRoomId });

      socket.emit("chat_history", {
        roomId: newRoomId,
        messages: chatRoom.messages,
      });

      io.emit("customer_started_new_chat", {
        roomId: newRoomId,
        customerId: socket.id,
        createdAt: chatRoom.createdAt,
      });

    });

    // Initialize with a room
    socket.emit("start_new_chat");

    socket.on(
      "send_message",
      (message: Omit<Message, "timestamp" | "roomId" | "agentId">) => {
        if (!currentRoomId) return;

        const fullMessage: Message = {
          ...message,
          timestamp: new Date(),
          roomId: currentRoomId,
        };

        const room = chatRooms.get(currentRoomId);
        if (room) {
          room.messages.push(fullMessage);
          room.lastActivity = new Date();
          room.hasCustomerMessage = true;

          if (room.status === "inactive") {
            room.status = "waiting";

            io.emit("new_customer", {
              roomId: currentRoomId,
              customerId: socket.id,
              createdAt: room.createdAt,
              status: "waiting",
              lastMessage: fullMessage.text,
              messageCount: room.messages.length,
            });
          }

          // Keep only last 100 messages
          if (room.messages.length > 100) {
            room.messages.shift();
          }

          // Send to customer
          socket.emit("chat_message", fullMessage);

          // Send to assigned agent if exists
          if (room.assignedAgent) {
            const agent = activeAgents.get(room.assignedAgent);
            if (agent) {
              socket.to(agent.socketId).emit("chat_message", fullMessage);
            }
          } else {
            // Broadcast to all admins for unassigned active rooms
            io.emit("customer_message", {
              roomId: currentRoomId,
              message: fullMessage,
              customerId: socket.id,
              isNewMessage: true,
            });
          }
        }
      },
    );

    socket.on("typing_start", () => {
      if (!currentRoomId) return;

      const room = chatRooms.get(currentRoomId);
      if (room && room.assignedAgent) {
        const agent = activeAgents.get(room.assignedAgent);
        if (agent) {
          socket.to(agent.socketId).emit("agent_typing", true);
        }
      } else if (room && room.status === "waiting") {
        io.emit("customer_typing", {
          roomId: currentRoomId,
          typing: true,
        });
      }
    });

    socket.on("typing_stop", () => {
      if (!currentRoomId) return;

      const room = chatRooms.get(currentRoomId);
      if (room && room.assignedAgent) {
        const agent = activeAgents.get(room.assignedAgent);
        if (agent) {
          socket.to(agent.socketId).emit("agent_typing", false);
        }
      } else if (room && room.status === "waiting") {
        io.emit("customer_typing", {
          roomId: currentRoomId,
          typing: false,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Customer disconnected:", socket.id);
      if (currentRoomId) {
        const room = chatRooms.get(currentRoomId);
        if (room && !room.hasCustomerMessage) {
          // Remove room if no messages were sent
          setTimeout(() => {
            if (chatRooms.has(currentRoomId!)) {
              const currentRoom = chatRooms.get(currentRoomId!);
              if (currentRoom && !currentRoom.hasCustomerMessage) {
                chatRooms.delete(currentRoomId!);
                io.emit("customer_disconnected", currentRoomId);
              }
            }
          }, 5000);
        }
      }
    });
  }

  function handleAdminConnection(socket: any, io: any) {
    const agentId = socket.handshake.auth?.agentId || `admin-${socket.id}`;
    const agentName = socket.handshake.auth?.agentName || "Support Agent";

    activeAgents.set(agentId, {
      id: agentId,
      name: agentName,
      socketId: socket.id,
      isOnline: true,
    });

    console.log("Admin connected:", agentName);

    // Notify everyone that admin is online
    io.emit("admin_status", { isOnline: true });

    // Send active rooms to admin
    const activeRooms = Array.from(chatRooms.values()).filter(
      (room) =>
        (room.status === "waiting" || room.status === "active") &&
        room.hasCustomerMessage,
    );
    socket.emit("chat_rooms", activeRooms);

    socket.on("get_active_rooms", () => {
      socket.emit(
        "chat_rooms",
        Array.from(chatRooms.values()).filter(
          (room) => room.status !== "closed"
        )
      );
    });

    socket.on("assign_to_me", (data: { roomId: string }) => {
      const room = chatRooms.get(data.roomId);
      if (room && (room.status === "waiting" || room.status === "inactive")) {
        room.assignedAgent = agentId;
        room.status = "active";

        // Update agent's current room
        const agent = activeAgents.get(agentId);
        if (agent) {
          agent.currentRoom = data.roomId;
        }

        // Join the room
        socket.join(data.roomId);

        // Notify customer
        io.to(data.roomId).emit("agent_joined", {
          agentName,
          message: `${agentName} has joined the chat`,
        });

        // Notify other admins
        socket.broadcast.emit("room_assigned", {
          roomId: data.roomId,
          agentId,
          agentName,
        });

        // Send chat history to admin
        socket.emit("chat_history", {
          roomId: data.roomId,
          messages: room.messages,
        });
      }
    });

    socket.on("send_message", (data: { roomId: string; text: string }) => {
      const room = chatRooms.get(data.roomId);
      if (room && room.status === "active" && room.assignedAgent === agentId) {
        const message: Message = {
          id: Date.now().toString(),
          text: data.text,
          sender: "agent",
          timestamp: new Date(),
          roomId: data.roomId,
          agentId,
        };

        room.messages.push(message);
        room.lastActivity = new Date();

        // Send to customer
        io.to(data.roomId).emit("chat_message", message);

        // Send to all admins in the room (including sender)
        io.to(data.roomId).emit("chat_message", message);
      }
    });

    socket.on("close_chat", (data: { roomId: string }) => {
      const room = chatRooms.get(data.roomId);
      if (room && room.assignedAgent === agentId) {
        room.status = "closed";

        io.to(data.roomId).emit("chat_ended", {
          message: "Thank you for contacting us! This chat has ended.",
        });

        io.emit("chat_closed", data.roomId);

        // Leave the room
        socket.leave(data.roomId);

        setTimeout(() => {
          const room = chatRooms.get(data.roomId);
          if (room) {
            room.status = "inactive";
          }
        }, 30000);
      }
    });

    socket.on("disconnect", () => {
      console.log("Admin disconnected:", agentName);
      activeAgents.delete(agentId);

      // Unassign rooms from this agent
      chatRooms.forEach((room) => {
        if (room.assignedAgent === agentId) {
          room.assignedAgent = undefined;
          room.status = "waiting";
          io.emit("room_unassigned", {
            roomId: room.id,
            agentId,
          });
        }
      });

      if (activeAgents.size === 0) {
        io.emit("admin_status", { isOnline: false });
      }
    });
  }

  const PORT = process.env.SOCKET_PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Socket server running on port ${PORT}`);
  });

  return io;
}
