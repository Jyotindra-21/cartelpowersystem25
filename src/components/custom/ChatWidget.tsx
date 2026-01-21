
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSocket } from '@/lib/socket-context';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const { 
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
  } = useSocket();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && isConnected && !hasChatEnded) {
      sendMessage(inputMessage.trim());
      setInputMessage('');
    }
  }, [inputMessage, isConnected, hasChatEnded, sendMessage]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    
    if (e.target.value.trim() && !hasChatEnded) {
      startTyping();
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 1000);
    } else {
      stopTyping();
    }
  }, [hasChatEnded, startTyping, stopTyping]);

  const handleToggleChat = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleStartNewChat = useCallback(() => {
    startNewChat();
    setInputMessage('');
  }, [startNewChat]);

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  const hasCustomerSentMessage = messages.some(msg => msg.sender === 'user');
  
  const isSystemMessage = useCallback((message: { text: string; sender: string }) => {
    return message.sender === 'agent' && (
      message.text.includes('has joined the chat') || 
      message.text.includes('chat has ended') ||
      message.text.includes('Thank you for contacting us')
    );
  }, []);

  const getConnectionStatus = useCallback(() => {
    if (hasChatEnded) return 'Chat Ended';
    if (!isConnected) return 'Connecting...';
    if (!isAdminOnline) return 'Support Offline';
    if (!hasCustomerSentMessage) return 'Ready to Chat';
    return `Connected with ${agentName}`;
  }, [hasChatEnded, isConnected, isAdminOnline, hasCustomerSentMessage, agentName]);

  const getStatusColor = useCallback(() => {
    if (hasChatEnded) return 'bg-gray-400';
    if (!isConnected) return 'bg-red-400';
    if (!isAdminOnline) return 'bg-yellow-400';
    if (!hasCustomerSentMessage) return 'bg-blue-400';
    return 'bg-green-400';
  }, [hasChatEnded, isConnected, isAdminOnline, hasCustomerSentMessage]);

  const getPlaceholderText = useCallback(() => {
    if (!isConnected) return "Connecting...";
    if (!isAdminOnline) return "Support team is offline";
    if (!hasCustomerSentMessage) return "Type a message to start chat...";
    return "Type your message...";
  }, [isConnected, isAdminOnline, hasCustomerSentMessage]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={handleToggleChat}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-200 relative"
        aria-label="Toggle chat window"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor()}`} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Customer Support</h3>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
                <span>{getConnectionStatus()}</span>
              </div>
            </div>
            <button
              onClick={handleToggleChat}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-3">
              {hasChatEnded ? (
                <div className="text-center text-gray-500 mt-8">
                  <p className="text-sm">This chat has ended.</p>
                  <button
                    onClick={handleStartNewChat}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Start New Chat
                  </button>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm">
                    {isAdminOnline 
                      ? "Send a message to start chatting with our support team!" 
                      : "Our support team is currently offline. Leave a message and we'll get back to you soon!"}
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : isSystemMessage(message)
                            ? 'bg-green-100 text-green-800 border border-green-200 rounded-lg'
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-blue-100' : 
                            isSystemMessage(message) 
                              ? 'text-green-600' 
                              : 'text-gray-500'
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && !hasChatEnded && isAdminOnline && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{agentName} is typing...</p>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            {hasChatEnded ? (
              <div className="text-center text-gray-500 py-4">
                <p className="text-sm">This chat has ended.</p>
                <button
                  type="button"
                  onClick={handleStartNewChat}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Start New Chat
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={handleInputChange}
                  placeholder={getPlaceholderText()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={!isConnected || !isAdminOnline}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || !isConnected || !isAdminOnline}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  aria-label="Send message"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;