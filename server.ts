
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  roomId: string;
  agentId?: string;
}

type ChatRoomStatus = 'active' | 'closed' | 'waiting' | 'inactive';

interface ChatRoom {
  id: string;
  customerId: string;
  status: ChatRoomStatus;
  createdAt: Date;
  lastActivity: Date;
  messages: Message[];
  assignedAgent?: string;
  hasCustomerMessage: boolean;
}

const chatRooms = new Map<string, ChatRoom>();
const activeAgents = new Map<string, { id: string; name: string; socketId: string; isOnline: boolean }>();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handler(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: `http://${hostname}:${port}`,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    const isAdmin = socket.handshake.auth?.isAdmin || false;
    
    if (isAdmin) {
      handleAdminConnection(socket, io);
    } else {
      handleCustomerConnection(socket, io);
    }
  });

  function handleCustomerConnection(socket: any, io: any) {
    console.log('Customer connected:', socket.id);

    const roomId = `customer-${socket.id}`;
    socket.join(roomId);

    let chatRoom = chatRooms.get(roomId);
    
    if (!chatRoom) {
      chatRoom = {
        id: roomId,
        customerId: socket.id,
        status: 'inactive' as ChatRoomStatus,
        createdAt: new Date(),
        lastActivity: new Date(),
        messages: [],
        hasCustomerMessage: false
      };
      chatRooms.set(roomId, chatRoom);

      const welcomeMessage: Message = {
        id: 'welcome',
        text: 'Hello! Welcome to our support chat. Send a message to start chatting with our team.',
        sender: 'agent',
        timestamp: new Date(),
        roomId,
      };

      chatRoom.messages.push(welcomeMessage);
    }

    socket.emit('chat_history', chatRoom.messages);
    
    const isAdminOnline = activeAgents.size > 0;
    socket.emit('admin_status', { isOnline: isAdminOnline });

    socket.on('send_message', (message: Omit<Message, 'timestamp' | 'roomId' | 'agentId'>) => {
      const fullMessage: Message = {
        ...message,
        timestamp: new Date(),
        roomId,
      };

      const room = chatRooms.get(roomId);
      if (room) {
        room.messages.push(fullMessage);
        room.lastActivity = new Date();
        room.hasCustomerMessage = true;
        
        if (room.status === 'inactive') {
          room.status = 'waiting' as ChatRoomStatus;
          
          io.emit('new_customer', {
            roomId,
            customerId: socket.id,
            createdAt: room.createdAt,
            status: 'waiting'
          });
        }
        
        if (room.messages.length > 100) {
          room.messages.shift();
        }

        // Send to customer
        socket.emit('chat_message', fullMessage);
        
        // Send to assigned agent if exists
        if (room.assignedAgent) {
          io.to(room.assignedAgent).emit('chat_message', fullMessage);
        } else {
          // Broadcast to all admins only if room is active
          if (isRoomActive(room)) {
            io.emit('customer_message', {
              roomId,
              message: fullMessage
            });
          }
        }
      }
    });

    socket.on('typing_start', () => {
      const room = chatRooms.get(roomId);
      if (room) {
        if (room.assignedAgent && isRoomActive(room)) {
          socket.to(room.assignedAgent).emit('user_typing', true);
        } else if (isRoomActive(room)) {
          io.emit('customer_typing', { roomId, typing: true });
        }
      }
    });

    socket.on('typing_stop', () => {
      const room = chatRooms.get(roomId);
      if (room) {
        if (room.assignedAgent && isRoomActive(room)) {
          socket.to(room.assignedAgent).emit('user_typing', false);
        } else if (isRoomActive(room)) {
          io.emit('customer_typing', { roomId, typing: false });
        }
      }
    });

    socket.on('disconnect', () => {
      console.log('Customer disconnected:', socket.id);
      setTimeout(() => {
        if (chatRooms.has(roomId)) {
          const room = chatRooms.get(roomId);
          if (!room?.hasCustomerMessage) {
            chatRooms.delete(roomId);
            io.emit('customer_disconnected', roomId);
          }
        }
      }, 300000);
    });
  }

  function handleAdminConnection(socket: any, io: any) {
    const agentId = socket.handshake.auth?.agentId || socket.id;
    const agentName = socket.handshake.auth?.agentName || 'Support Agent';
    
    activeAgents.set(agentId, {
      id: agentId,
      name: agentName,
      socketId: socket.id,
      isOnline: true
    });

    console.log('Admin connected:', agentName);

    io.emit('admin_status', { isOnline: true });

    const activeRooms = Array.from(chatRooms.values()).filter(room => 
      isRoomActive(room) && room.hasCustomerMessage
    );
    socket.emit('chat_rooms', activeRooms);

    socket.on('assign_to_me', (data: { roomId: string }) => {
      const room = chatRooms.get(data.roomId);
      if (room && isRoomActive(room)) {
        room.assignedAgent = socket.id;
        room.status = 'active' as ChatRoomStatus;
        
        io.to(data.roomId).emit('agent_joined', {
          agentName,
          message: `${agentName} has joined the chat`
        });

        socket.broadcast.emit('room_assigned', {
          roomId: data.roomId,
          agentId,
          agentName
        });

        socket.emit('chat_history', room.messages);
      }
    });

    socket.on('send_message', (data: { roomId: string; text: string }) => {
      const room = chatRooms.get(data.roomId);
      if (room && isRoomActive(room)) {
        const message: Message = {
          id: Date.now().toString(),
          text: data.text,
          sender: 'agent',
          timestamp: new Date(),
          roomId: data.roomId,
          agentId,
        };

        room.messages.push(message);
        room.lastActivity = new Date();

        // FIX: Send to customer and all admins (including sender) without duplication
        io.to(data.roomId).emit('chat_message', message); // Send to customer
        
        // Send to all admins in the room (including the sender) - this ensures admin sees their own message
        socket.broadcast.to(data.roomId).emit('chat_message', message);
        
        // Also send to the sending admin directly (so they see their message immediately)
        socket.emit('chat_message', message);
      }
    });

    socket.on('close_chat', (data: { roomId: string }) => {
      const room = chatRooms.get(data.roomId);
      if (room) {
        room.status = 'closed' as ChatRoomStatus;
        
        io.to(data.roomId).emit('chat_ended', {
          message: 'The support chat has ended. Thank you for contacting us!'
        });

        io.emit('chat_closed', data.roomId);

        setTimeout(() => {
          chatRooms.delete(data.roomId);
        }, 60000);
      }
    });

    socket.on('disconnect', () => {
      console.log('Admin disconnected:', agentName);
      activeAgents.delete(agentId);
      
      if (activeAgents.size === 0) {
        io.emit('admin_status', { isOnline: false });
      }
      
      chatRooms.forEach(room => {
        if (room.assignedAgent === socket.id) {
          room.assignedAgent = undefined;
          room.status = 'waiting' as ChatRoomStatus;
          io.emit('room_unassigned', room.id);
        }
      });
    });
  }

  function isRoomActive(room: ChatRoom): boolean {
    return room.status !== 'inactive' && room.status !== 'closed';
  }

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});