import React from 'react';
import UserAvatar from '../common/UserAvatar';

const MessageItem = ({ message, isOwn }) => {
  return (
    <div className={`message-item ${isOwn ? 'own' : 'other'}`}>
      {!isOwn && <UserAvatar userId={message.senderId} />}
      <div className="message-content">
        <div className="message-sender">{message.senderName}</div>
        <div className="message-text">{message.text}</div>
        <div className="message-time">{message.timestamp}</div>
      </div>
    </div>
  );
};

export default MessageItem;