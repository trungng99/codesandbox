import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatWindow = ({ chatId, isGroup = false }) => {
  return (
    <div className="chat-window">
      <ChatHeader chatId={chatId} isGroup={isGroup} />
      <MessageList chatId={chatId} />
      <ChatInput chatId={chatId} />
    </div>
  );
};

export default ChatWindow;