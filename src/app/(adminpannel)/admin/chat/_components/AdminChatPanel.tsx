
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
    roomId: string;
    agentId?: string;
}

interface ChatRoom {
    id: string;
    customerId: string;
    status: 'active' | 'closed' | 'waiting' | 'inactive';
    createdAt: Date;
    lastActivity: Date;
    messages: Message[];
    assignedAgent?: string;
    hasCustomerMessage: boolean;
}

const AdminChatPanel: React.FC = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [agentName, setAgentName] = useState('Support Agent');
    const [currentAgentId, setCurrentAgentId] = useState<string>('');
    
    // Use refs to track state without causing re-renders
    const chatRoomsRef = useRef<ChatRoom[]>([]);
    const selectedRoomRef = useRef<string | null>(null);

    // Keep refs in sync with state
    useEffect(() => {
        chatRoomsRef.current = chatRooms;
    }, [chatRooms]);

    useEffect(() => {
        selectedRoomRef.current = selectedRoom;
    }, [selectedRoom]);

    useEffect(() => {
        const agentId = `admin-${Date.now()}`;
        setCurrentAgentId(agentId);

        const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
            auth: {
                isAdmin: true,
                agentId: agentId,
                agentName: agentName
            }
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            setIsConnected(true);
            newSocket.emit("get_active_rooms");
            console.log('Admin connected');
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
            console.log('Admin disconnected');
        });

        newSocket.on('chat_rooms', (rooms: ChatRoom[]) => {
            console.log('Received chat rooms:', rooms);
            setChatRooms(rooms);
        });

        newSocket.on('new_customer', (data: any) => {
            console.log('New customer event received:', data);
            setChatRooms(prev => {
                const exists = prev.find(room => room.id === data.roomId);
                if (exists) {
                    console.log('Room already exists, updating:', data.roomId);
                    return prev.map(room => 
                        room.id === data.roomId 
                            ? { ...room, status: 'waiting', lastActivity: new Date() }
                            : room
                    );
                }
                
                console.log('Adding new room:', data.roomId);
                return [...prev, {
                    id: data.roomId,
                    customerId: data.customerId,
                    status: 'waiting',
                    createdAt: new Date(data.createdAt),
                    lastActivity: new Date(),
                    messages: [],
                    hasCustomerMessage: false
                }];
            });
        });

        newSocket.on('customer_message', (data: { roomId: string; message: Message; isNewMessage: boolean }) => {
            console.log('Customer message received:', data);
            setChatRooms(prev => {
                const roomExists = prev.find(room => room.id === data.roomId);
                if (!roomExists) {
                    console.log('Room does not exist, creating new room:', data.roomId);
                    // If room doesn't exist, create it
                    return [...prev, {
                        id: data.roomId,
                        customerId: data.message.sender === 'user' ? 'customer-' + Date.now() : 'unknown',
                        status: 'waiting',
                        createdAt: new Date(),
                        lastActivity: new Date(),
                        messages: [data.message],
                        hasCustomerMessage: true
                    }];
                }

                return prev.map(room =>
                    room.id === data.roomId
                        ? { 
                            ...room, 
                            messages: [...room.messages, data.message],
                            lastActivity: new Date(),
                            hasCustomerMessage: true,
                            status: room.status === 'inactive' ? 'waiting' : room.status
                        }
                        : room
                );
            });

            // Use refs instead of state to avoid dependencies
            if (data.isNewMessage && selectedRoomRef.current !== data.roomId) {
                const room = chatRoomsRef.current.find(r => r.id === data.roomId);
                if (room && !room.assignedAgent) {
                    console.log('New message from unassigned customer:', data.roomId);
                }
            }
        });

        newSocket.on('chat_message', (message: Message) => {
            console.log('Chat message received:', message);
            setChatRooms(prev => {
                const roomExists = prev.find(room => room.id === message.roomId);
                if (!roomExists) {
                    console.log('Room does not exist for message, creating:', message.roomId);
                    return [...prev, {
                        id: message.roomId,
                        customerId: 'customer-' + Date.now(),
                        status: 'waiting',
                        createdAt: new Date(),
                        lastActivity: new Date(),
                        messages: [message],
                        hasCustomerMessage: message.sender === 'user'
                    }];
                }

                return prev.map(room =>
                    room.id === message.roomId
                        ? { ...room, messages: [...room.messages, message] }
                        : room
                );
            });
        });

        newSocket.on('room_assigned', (data: { roomId: string; agentId: string; agentName: string }) => {
            console.log('Room assigned:', data);
            setChatRooms(prev => prev.map(room =>
                room.id === data.roomId
                    ? { 
                        ...room, 
                        assignedAgent: data.agentId, 
                        status: 'active' 
                    }
                    : room
            ));
        });

        newSocket.on('chat_ended', (data: { roomId: string; message: string }) => {
            console.log('Chat ended:', data);
            // Mark as closed but don't remove from list immediately
            setChatRooms(prev => prev.map(room =>
                room.id === data.roomId
                    ? { ...room, status: 'closed' }
                    : room
            ));
            
            if (selectedRoomRef.current === data.roomId) {
                setSelectedRoom(null);
            }
        });

        newSocket.on('chat_closed', (roomId: string) => {
            console.log('Chat closed event:', roomId);
            // Mark as closed but don't remove immediately
            setChatRooms(prev => prev.map(room =>
                room.id === roomId
                    ? { ...room, status: 'closed' }
                    : room
            ));
            
            if (selectedRoomRef.current === roomId) {
                setSelectedRoom(null);
            }
        });

        newSocket.on('room_unassigned', (data: { roomId: string; agentId: string }) => {
            console.log('Room unassigned:', data);
            setChatRooms(prev => prev.map(room =>
                room.id === data.roomId
                    ? { ...room, assignedAgent: undefined, status: 'waiting' }
                    : room
            ));
        });

        newSocket.on('customer_started_new_chat', (data: { roomId: string; customerId: string }) => {
            console.log('Customer started new chat:', data);
            setChatRooms(prev => {
                // Remove any old closed chats for this customer
                const filtered = prev.filter(room => 
                    room.status !== 'closed' || room.customerId !== data.customerId
                );
                
                // Add new room
                const exists = filtered.find(room => room.id === data.roomId);
                if (exists) return filtered;
                
                return [...filtered, {
                    id: data.roomId,
                    customerId: data.customerId,
                    status: 'waiting',
                    createdAt: new Date(),
                    lastActivity: new Date(),
                    messages: [{
                        id: 'welcome-' + Date.now(),
                        text: 'Hello! Welcome to our support chat. Send a message to start chatting with our team.',
                        sender: 'agent',
                        timestamp: new Date(),
                        roomId: data.roomId,
                    }],
                    hasCustomerMessage: false
                }];
            });
        });

        return () => {
            newSocket.disconnect();
        };
    }, [agentName]);

    const assignToMe = useCallback((roomId: string) => {
        if (socket) {
            console.log('Assigning room to me:', roomId);
            // Optimistically update the UI immediately
            setChatRooms(prev => prev.map(room =>
                room.id === roomId
                    ? { 
                        ...room, 
                        assignedAgent: currentAgentId, 
                        status: 'active' 
                    }
                    : room
            ));
            setSelectedRoom(roomId);
            
            // Then emit the event to the server
            socket.emit('assign_to_me', { roomId });
        }
    }, [socket, currentAgentId]);

    const sendMessage = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (messageInput.trim() && selectedRoom && socket) {
            socket.emit('send_message', {
                roomId: selectedRoom,
                text: messageInput.trim()
            });
            setMessageInput('');
        }
    }, [messageInput, selectedRoom, socket]);

    const closeChat = useCallback((roomId: string) => {
        if (socket) {
            console.log('Closing chat:', roomId);
            socket.emit('close_chat', { roomId });
            // Don't remove from state immediately, wait for server confirmation
            setSelectedRoom(null);
        }
    }, [socket]);

    const selectedRoomData = chatRooms.find(room => room.id === selectedRoom);

    // Check if the current agent is assigned to the selected room
    const isAssignedToCurrentAgent = useCallback((room: ChatRoom) => {
        return room.assignedAgent === currentAgentId;
    }, [currentAgentId]);

    const getUnreadMessageCount = useCallback((room: ChatRoom) => {
        if (!selectedRoomData || room.id !== selectedRoom) {
            const lastUserMessageIndex = [...room.messages].reverse().findIndex(msg => msg.sender === 'user');
            return lastUserMessageIndex >= 0 ? 1 : 0;
        }
        return 0;
    }, [selectedRoomData, selectedRoom]);

    const formatTime = useCallback((date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, []);

    const getLastMessagePreview = useCallback((room: ChatRoom) => {
        const lastMessage = room.messages[room.messages.length - 1];
        if (!lastMessage) return 'No messages yet';
        
        const preview = lastMessage.text.length > 30 
            ? lastMessage.text.substring(0, 30) + '...' 
            : lastMessage.text;
        
        return `${lastMessage.sender === 'user' ? 'Customer' : 'You'}: ${preview}`;
    }, []);

    // Helper function to get waiting chats count
    const getWaitingChatsCount = useCallback(() => {
        return chatRooms.filter(r => r.status === 'waiting').length;
    }, [chatRooms]);

    // Get active chats count (waiting + active)
    const getActiveChatsCount = useCallback(() => {
        return chatRooms.filter(r => r.status !== 'closed').length;
    }, [chatRooms]);

    // Check if room can show input form
    const canShowInputForm = selectedRoomData && 
        selectedRoomData.status === 'active' && 
        isAssignedToCurrentAgent(selectedRoomData);

    // Check if room can show end chat button
    const canShowEndChatButton = selectedRoomData && 
        selectedRoomData.status === 'active' && 
        isAssignedToCurrentAgent(selectedRoomData);

    // Check if room should show take chat button
    const shouldShowTakeChatButton = (room: ChatRoom) => {
        return room.status === 'waiting' || 
               (room.status === 'active' && !isAssignedToCurrentAgent(room));
    };

    // Filter out closed chats after 5 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            setChatRooms(prev => {
                const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                return prev.filter(room => 
                    room.status !== 'closed' || 
                    new Date(room.lastActivity) > fiveMinutesAgo
                );
            });
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                    <div className="flex items-center mt-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                        <span className="ml-2">{isConnected ? 'Connected' : 'Disconnected'}</span>
                    </div>
                    <div className="mt-2 space-y-2">
                        <input
                            type="text"
                            value={agentName}
                            onChange={(e) => setAgentName(e.target.value)}
                            placeholder="Agent Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <p className="text-xs text-gray-500">Agent ID: {currentAgentId.slice(0, 8)}...</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-semibold">
                            Active Chats ({getActiveChatsCount()})
                        </h2>
                        <button
                            onClick={() => {
                                console.log('Current chat rooms:', chatRooms);
                                console.log('Socket connected:', isConnected);
                            }}
                            className="text-xs bg-gray-200 px-2 py-1 rounded"
                        >
                            Debug
                        </button>
                    </div>
                    
                    {/* Status Summary */}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                        <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-center">
                            <div className="font-bold">{chatRooms.filter(r => r.status === 'waiting').length}</div>
                            <div>Waiting</div>
                        </div>
                        <div className="bg-green-100 text-green-800 p-2 rounded text-center">
                            <div className="font-bold">{chatRooms.filter(r => r.status === 'active').length}</div>
                            <div>Active</div>
                        </div>
                        <div className="bg-gray-100 text-gray-800 p-2 rounded text-center">
                            <div className="font-bold">{chatRooms.filter(r => r.status === 'closed').length}</div>
                            <div>Closed</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {chatRooms
                            .filter(room => room.status !== 'closed')
                            .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
                            .map(room => {
                                const unreadCount = getUnreadMessageCount(room);
                                const isAssignedToMe = isAssignedToCurrentAgent(room);
                                
                                return (
                                    <div
                                        key={room.id}
                                        className={`p-3 rounded-lg cursor-pointer border relative ${
                                            selectedRoom === room.id 
                                                ? 'bg-blue-50 border-blue-200' 
                                                : 'bg-white border-gray-200 hover:bg-gray-50'
                                        } ${isAssignedToMe ? 'ring-1 ring-green-400' : ''}`}
                                        onClick={() => setSelectedRoom(room.id)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">
                                                    Customer {room.customerId.slice(-6)}
                                                    {isAssignedToMe && (
                                                        <span className="ml-1 text-green-600 text-xs">(Your Chat)</span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {getLastMessagePreview(room)}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {formatTime(new Date(room.lastActivity))}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    room.status === 'waiting' 
                                                        ? 'bg-yellow-100 text-yellow-800' 
                                                        : room.status === 'active' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {room.status}
                                                </span>
                                                {unreadCount > 0 && (
                                                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {shouldShowTakeChatButton(room) && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    assignToMe(room.id);
                                                }}
                                                className="mt-2 w-full bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                                            >
                                                {room.status === 'waiting' ? 'Take Chat' : 'Reassign to Me'}
                                            </button>
                                        )}
                                        
                                        {room.assignedAgent && (
                                            <p className="text-xs text-gray-600 mt-1">
                                                {isAssignedToMe 
                                                    ? 'Assigned to you' 
                                                    : `Assigned to ${room.assignedAgent.includes('admin') ? 'another agent' : room.assignedAgent}`
                                                }
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        
                        {chatRooms.filter(room => room.status !== 'closed').length === 0 && (
                            <div className="text-center text-gray-500 py-4">
                                <p className="text-sm">No active chats</p>
                                <p className="text-xs mt-1">Waiting for new customers...</p>
                            </div>
                        )}
                    </div>

                    {/* Closed Chats Section */}
                    {chatRooms.filter(room => room.status === 'closed').length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-semibold text-sm mb-2 text-gray-600">
                                Recently Closed ({chatRooms.filter(r => r.status === 'closed').length})
                            </h3>
                            <div className="space-y-2">
                                {chatRooms
                                    .filter(room => room.status === 'closed')
                                    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
                                    .slice(0, 3) // Show only last 3 closed chats
                                    .map(room => (
                                        <div
                                            key={room.id}
                                            className="p-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-500"
                                        >
                                            <p className="text-xs truncate">
                                                Customer {room.customerId.slice(-6)} • Closed
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedRoomData ? (
                    <>
                        <div className="bg-white border-b border-gray-200 p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="font-semibold">
                                        Chat with Customer {selectedRoomData.customerId.slice(-6)}
                                        {isAssignedToCurrentAgent(selectedRoomData) && (
                                            <span className="ml-2 text-green-600 text-sm">• Your Chat</span>
                                        )}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Started {new Date(selectedRoomData.createdAt).toLocaleString()} • 
                                        {selectedRoomData.messages.length} messages • 
                                        Status: <span className={`font-medium ${
                                            selectedRoomData.status === 'active' ? 'text-green-600' : 
                                            selectedRoomData.status === 'waiting' ? 'text-yellow-600' : 
                                            'text-gray-600'
                                        }`}>{selectedRoomData.status}</span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {canShowEndChatButton && (
                                        <button
                                            onClick={() => closeChat(selectedRoomData.id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                                        >
                                            End Chat
                                        </button>
                                    )}
                                    {shouldShowTakeChatButton(selectedRoomData) && (
                                        <button
                                            onClick={() => assignToMe(selectedRoomData.id)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            Take Chat
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                            <div className="space-y-3">
                                {selectedRoomData.messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                                message.sender === 'user'
                                                    ? 'bg-gray-200 text-gray-800 rounded-bl-none'
                                                    : 'bg-blue-600 text-white rounded-br-none'
                                            }`}
                                        >
                                            <p className="text-sm">{message.text}</p>
                                            <p
                                                className={`text-xs mt-1 ${
                                                    message.sender === 'user' ? 'text-gray-500' : 'text-blue-100'
                                                }`}
                                            >
                                                {formatTime(new Date(message.timestamp))}
                                                {message.sender === 'agent' && message.agentId && 
                                                    ` • ${message.agentId === currentAgentId ? 'You' : 'Other Agent'}`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {selectedRoomData.messages.length === 0 && (
                                    <div className="text-center text-gray-500 py-8">
                                        <p>No messages yet. Start the conversation!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {canShowInputForm && (
                            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Type your response..."
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={!isConnected}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!messageInput.trim() || !isConnected}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Send
                                    </button>
                                </div>
                            </form>
                        )}

                        {!canShowInputForm && selectedRoomData.status === 'active' && (
                            <div className="p-4 border-t border-gray-200 bg-yellow-50 text-yellow-800 text-sm">
                                <p>This chat is assigned to another agent. You can reassign it to yourself using the "Take Chat" button.</p>
                            </div>
                        )}

                        {selectedRoomData.status === 'closed' && (
                            <div className="p-4 border-t border-gray-200 bg-gray-100 text-gray-600 text-sm">
                                <p>This chat has been closed. The customer can start a new chat if they need further assistance.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p className="text-lg font-medium">Select a chat to start messaging</p>
                            <p className="text-sm mt-2">
                                {getWaitingChatsCount()} waiting chats available
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChatPanel;