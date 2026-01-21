// lib/socket-context.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  roomId?: string;
  agentId?: string;
}

interface SocketContextType {
  socket: Socket | null;
  messages: Message[];
  isConnected: boolean;
  isTyping: boolean;
  hasChatEnded: boolean;
  agentName: string;
  isAdminOnline: boolean;
  currentRoomId: string | null;
  sendMessage: (text: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
  startNewChat: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  messages: [],
  isConnected: false,
  isTyping: false,
  hasChatEnded: false,
  agentName: 'Support Agent',
  isAdminOnline: false,
  currentRoomId: null,
  sendMessage: () => { },
  startTyping: () => { },
  stopTyping: () => { },
  startNewChat: () => { },
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasChatEnded, setHasChatEnded] = useState(false);
  const [agentName, setAgentName] = useState('Support Agent');
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000');

    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      setHasChatEnded(false);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('room_created', (data: { roomId: string }) => {
      setCurrentRoomId(data.roomId);
    });

    newSocket.on('chat_message', (message: Omit<Message, 'timestamp'> & { timestamp: string }) => {
      setMessages(prev => [...prev, {
        ...message,
        timestamp: new Date(message.timestamp)
      }]);
    });

    newSocket.on('chat_history', (data: {
      roomId: string;
      messages: (Omit<Message, 'timestamp'> & { timestamp: string })[]
    }) => {
      setCurrentRoomId(data.roomId);
      setMessages(data.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));

      // Extract agent name from system messages
      const agentJoinedMsg = data.messages.find(msg =>
        msg.text.includes('has joined the chat')
      );
      if (agentJoinedMsg) {
        const name = agentJoinedMsg.text.split(' has joined')[0];
        setAgentName(name);
      }
    });

    newSocket.on('agent_typing', (typing: boolean) => {
      setIsTyping(typing);
    });

    newSocket.on('agent_joined', (data: { agentName: string; message: string }) => {
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        text: data.message,
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, systemMessage]);
      setAgentName(data.agentName);
      setHasChatEnded(false);
    });

    newSocket.on('chat_ended', (data: { message: string }) => {
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        text: data.message,
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, systemMessage]);
      setHasChatEnded(true);
    });

    newSocket.on('admin_status', (data: { isOnline: boolean }) => {
      setIsAdminOnline(data.isOnline);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const startNewChat = useCallback(() => {
    if (socket && isConnected) {
      // Clear current state
      setMessages([]);
      setHasChatEnded(false);
      setAgentName('Support Agent');
      setIsTyping(false);
      setCurrentRoomId(null);

      // Emit event to create new room
      socket.emit('start_new_chat');
    }
  }, [socket, isConnected]);

  const sendMessage = useCallback((text: string) => {
    if (socket && isConnected && !hasChatEnded) {
      const message: Omit<Message, 'timestamp'> = {
        id: Date.now().toString(),
        text,
        sender: 'user',
      };

      socket.emit('send_message', message);
      stopTyping();
    }
  }, [socket, isConnected, hasChatEnded]);

  const startTyping = useCallback(() => {
    if (socket && isConnected && !hasChatEnded) {
      socket.emit('typing_start');
    }
  }, [socket, isConnected, hasChatEnded]);

  const stopTyping = useCallback(() => {
    if (socket && isConnected && !hasChatEnded) {
      socket.emit('typing_stop');
    }
  }, [socket, isConnected, hasChatEnded]);

  return (
    <SocketContext.Provider value={{
      socket,
      messages,
      isConnected,
      isTyping,
      hasChatEnded,
      agentName,
      isAdminOnline,
      currentRoomId,
      sendMessage,
      startTyping,
      stopTyping,
      startNewChat,
    }}>
      {children}
    </SocketContext.Provider>
  );
};