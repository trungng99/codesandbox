import { useState, useEffect } from 'react';
import socket from '../services/socket';

const useChat = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!chatId) return;

    socket.on('new_message', (message) => {
      if (message.chatId === chatId) {
        setMessages(prev => [...prev, message]);
      }
    });

    socket.on('user_typing', ({ userId, isTyping }) => {
      // Logic xử lý typing indicator
    });

    return () => {
      socket.off('new_message');
      socket.off('user_typing');
    };
  }, [chatId]);

  const sendMessage = (text, senderId) => {
    const message = {
      chatId,
      text,
      senderId,
      timestamp: new Date().toISOString(),
    };
    socket.emit('send_message', message);
  };

  return { messages, sendMessage, isTyping };
};

export default useChat;