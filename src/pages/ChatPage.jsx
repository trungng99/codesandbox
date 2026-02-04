/// src/pages/ChatPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FiPlus, FiSearch, FiPhone, FiMoreVertical, FiUser, FiVideo, FiPaperclip, FiUsers } from 'react-icons/fi';
import CreateNewChat from '../components/chat/CreateNewChat';
import QuickMessageInput from '../components/chat/QuickMessageInput';
import CreateCallModal from '../components/calls/CreateCallModal';
import ActiveCall from '../components/calls/ActiveCall';
import ChatAttachmentsPanel from '../components/chat/ChatAttachmentsPanel';
import MessageSearch from '../components/chat/MessageSearch';
import CreateGroupChatModal from '../components/groups/CreateGroupChatModal';
import GroupSettingsModal from '../components/groups/GroupSettingsModal';
import './ChatPage.css';

const ChatPage = () => {
  // State cho modal tạo chat mới
  const [showCreateChat, setShowCreateChat] = useState(false);
  // State cho modal tạo cuộc gọi
  const [showCreateCall, setShowCreateCall] = useState(false);
  // State cho ActiveCall
  const [activeCall, setActiveCall] = useState(null);
  // State cho panels
  const [showAttachmentsPanel, setShowAttachmentsPanel] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  // State cho group modals
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  
  // State cho danh sách chat
  const [chats, setChats] = useState([
    { 
      id: 1, 
      name: 'Nguyễn Văn A', 
      lastMessage: 'Xin chào, tôi cần hỗ trợ về sản phẩm mới', 
      time: '10:30 AM', 
      unread: 2, 
      active: true,
      avatar: 'NA',
      status: 'online',
      type: 'customer'
    },
    { 
      id: 2, 
      name: 'Công ty ABC', 
      lastMessage: 'Hợp đồng đã được ký và gửi qua email', 
      time: '09:15 AM', 
      unread: 0, 
      active: false,
      avatar: 'AB',
      status: 'offline',
      type: 'company'
    },
    { 
      id: 3, 
      name: 'Nhóm Sales Team', 
      lastMessage: 'Cuộc họp định kỳ lúc 2h chiều nay', 
      time: 'Yesterday', 
      unread: 5, 
      active: false,
      avatar: 'ST',
      status: 'online',
      type: 'group'
    },
    { 
      id: 4, 
      name: 'Nhà cung cấp XYZ', 
      lastMessage: 'Đơn hàng sẽ được giao vào thứ 3', 
      time: 'Oct 12', 
      unread: 0, 
      active: false,
      avatar: 'XY',
      status: 'online',
      type: 'supplier'
    },
    { 
      id: 5, 
      name: 'Trần Thị B', 
      lastMessage: 'Cảm ơn sự hỗ trợ của bạn!', 
      time: 'Oct 10', 
      unread: 0, 
      active: false,
      avatar: 'TB',
      status: 'away',
      type: 'customer'
    },
  ]);

  // State cho chat hiện tại
  const [activeChat, setActiveChat] = useState(chats[0]);
  
  // State cho tin nhắn
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Nguyễn Văn A', text: 'Xin chào, tôi cần hỗ trợ về sản phẩm mới', time: '10:28 AM', type: 'received', avatar: 'NA' },
    { id: 2, sender: 'Bạn', text: 'Chào anh, tôi có thể giúp gì cho anh?', time: '10:29 AM', type: 'sent' },
    { id: 3, sender: 'Nguyễn Văn A', text: 'Tôi muốn biết thêm thông tin về gói dịch vụ Premium, có thể tư vấn giúp tôi không?', time: '10:30 AM', type: 'received', avatar: 'NA' },
    {
      id: 4,
      sender: 'Bạn',
      text: 'Chắc chắn rồi ạ. Gói Premium bao gồm tất cả tính năng nâng cao và hỗ trợ 24/7. Tôi sẽ gửi tài liệu chi tiết qua email cho anh.',
      time: '10:31 AM',
      type: 'sent',
      attachments: [
        {
          id: 'file1',
          name: 'Bảng giá Premium 2024.pdf',
          type: 'application/pdf',
          size: 245000,
          url: '#'
        }
      ]
    },
    {
      id: 5,
      sender: 'Nguyễn Văn A',
      text: 'Cảm ơn bạn! Tôi có thể xem demo sản phẩm tại đây: https://demo.product.com/premium',
      time: '10:33 AM',
      type: 'received',
      avatar: 'NA'
    },
    {
      id: 6,
      sender: 'Bạn',
      text: 'Tôi gửi thêm một số hình ảnh minh họa cho anh',
      time: '10:35 AM',
      type: 'sent',
      attachments: [
        {
          id: 'img1',
          name: 'product-screenshot-1.png',
          type: 'image/png',
          size: 512000,
          url: '#'
        },
        {
          id: 'img2',
          name: 'product-screenshot-2.png',
          type: 'image/png',
          size: 498000,
          url: '#'
        }
      ]
    },
    {
      id: 7,
      sender: 'Nguyễn Văn A',
      text: 'Tuyệt vời! Tôi có thể đăng ký online tại https://signup.product.com không?',
      time: '10:37 AM',
      type: 'received',
      avatar: 'NA'
    },
    {
      id: 8,
      sender: 'Bạn',
      text: 'Có ạ, anh có thể đăng ký trực tuyến. Tôi gửi hướng dẫn chi tiết và video demo.',
      time: '10:39 AM',
      type: 'sent',
      attachments: [
        {
          id: 'doc1',
          name: 'Hướng dẫn đăng ký.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: 125000,
          url: '#'
        }
      ]
    }
  ]);

  // State cho search
  const [searchTerm, setSearchTerm] = useState('');
  
  const messagesEndRef = useRef(null);

  // Mock contacts data cho cuộc gọi
  const mockContacts = [
    { id: 1, name: 'Nguyễn Văn A', email: 'a@company.com', role: 'Khách hàng', avatar: 'NA', status: 'online' },
    { id: 2, name: 'Trần Thị B', email: 'b@company.com', role: 'Nhà cung cấp', avatar: 'TB', status: 'offline' },
    { id: 3, name: 'Lê Văn C', email: 'c@company.com', role: 'Nhân viên Sales', avatar: 'LC', status: 'online' },
    { id: 4, name: 'Phạm Thị D', email: 'd@company.com', role: 'Khách hàng', avatar: 'PD', status: 'away' },
    { id: 5, name: 'Công ty ABC Corp', email: 'info@abccorp.com', role: 'Doanh nghiệp', avatar: 'AB', status: 'online' },
    { id: 6, name: 'Nguyễn Thị E', email: 'e@company.com', role: 'CS', avatar: 'NE', status: 'online' },
    { id: 7, name: 'Trần Văn F', email: 'f@company.com', role: 'Quản lý', avatar: 'TF', status: 'offline' },
    { id: 8, name: 'Nhà cung cấp XYZ', email: 'contact@xyz.com', role: 'Nhà cung cấp', avatar: 'XY', status: 'online' },
  ];

  // Filter chats based on search
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle starting new chat
  const handleStartChat = (chatData) => {
    console.log('Starting new chat:', chatData);
    
    // Create new chat
    const newChat = {
      id: chats.length + 1,
      name: chatData.contact.name,
      lastMessage: chatData.message || 'Đã gửi file đính kèm',
      time: 'Vừa xong',
      unread: 0,
      active: true,
      avatar: chatData.contact.avatar,
      status: 'online',
      type: 'customer'
    };

    // Add to chats list
    setChats(prev => [newChat, ...prev]);
    
    // Set as active chat
    setActiveChat(newChat);
    
    // Add initial message if exists
    if (chatData.message || chatData.attachments.length > 0) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'Bạn',
        text: chatData.message || '',
        time: 'Vừa xong',
        type: 'sent',
        attachments: chatData.attachments
      };
      setMessages(prev => [...prev, newMsg]);
    }

    alert(`Đã bắt đầu chat với ${chatData.contact.name}`);
  };

  // Handle sending message từ QuickMessageInput
  const handleSendMessage = (messageData) => {
    console.log('Sending message:', messageData);
    
    // Add new message
    const newMsg = {
      id: messages.length + 1,
      sender: 'Bạn',
      text: messageData.text,
      time: 'Vừa xong',
      type: 'sent',
      attachments: messageData.attachments.map(att => ({
        id: Date.now() + Math.random(),
        name: att.name,
        type: att.type,
        size: att.size,
        url: att.url
      }))
    };

    setMessages(prev => [...prev, newMsg]);
    
    // Update last message in chat
    if (activeChat) {
      setChats(prev => prev.map(chat => 
        chat.id === activeChat.id 
          ? { 
              ...chat, 
              lastMessage: messageData.text || 'Đã gửi file đính kèm',
              time: 'Vừa xong',
              unread: 0
            }
          : chat
      ));
    }
  };

  // Thêm hàm xử lý khi bắt đầu cuộc gọi từ CreateCallModal
  const handleStartCall = (callData) => {
    console.log('Starting call:', callData);
    setActiveCall(callData);
    setShowCreateCall(false);
  };

  // Thêm hàm kết thúc cuộc gọi
  const handleEndCall = () => {
    setActiveCall(null);
  };

  // Thêm hàm thu nhỏ cuộc gọi
  const handleMinimizeCall = () => {
    // In real app, you might want to minimize instead of close
    setActiveCall(null);
  };

  // Handle create group
  const handleCreateGroup = (groupData) => {
    console.log('Creating group:', groupData);

    const newGroup = {
      id: chats.length + 1,
      name: groupData.name,
      description: groupData.description,
      lastMessage: 'Nhóm đã được tạo',
      time: 'Vừa xong',
      unread: 0,
      active: false,
      avatar: groupData.avatar,
      status: 'online',
      type: 'group',
      members: groupData.members
    };

    setChats([newGroup, ...chats]);
    setShowCreateGroup(false);
    alert(`Đã tạo nhóm "${groupData.name}" với ${groupData.members.length + 1} thành viên`);
  };

  // Handle update group
  const handleUpdateGroup = (updatedGroup) => {
    console.log('Updating group:', updatedGroup);

    setChats(chats.map(chat =>
      chat.id === updatedGroup.id ? {
        ...chat,
        name: updatedGroup.name,
        description: updatedGroup.description,
        avatar: updatedGroup.avatar,
        members: updatedGroup.members
      } : chat
    ));

    // Update active chat if it's the same group
    if (activeChat && activeChat.id === updatedGroup.id) {
      setActiveChat({
        ...activeChat,
        name: updatedGroup.name,
        description: updatedGroup.description,
        avatar: updatedGroup.avatar,
        members: updatedGroup.members
      });
    }
  };

  // Handle leave group
  const handleLeaveGroup = (groupId) => {
    console.log('Leaving group:', groupId);

    setChats(chats.filter(chat => chat.id !== groupId));

    if (activeChat && activeChat.id === groupId) {
      setActiveChat(null);
    }

    alert('Bạn đã rời khỏi nhóm');
  };

  // Handle selecting chat
  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    // Mark as read
    setChats(prev => prev.map(c => 
      c.id === chat.id ? { ...c, unread: 0, active: true } : { ...c, active: false }
    ));
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    const icons = {
      'image': '🖼️',
      'video': '🎥',
      'audio': '🎵',
      'pdf': '📄',
      'word': '📝',
      'excel': '📊',
      'powerpoint': '📑',
      'default': '📎'
    };

    if (type.startsWith('image/')) return icons.image;
    if (type.startsWith('video/')) return icons.video;
    if (type.startsWith('audio/')) return icons.audio;
    if (type.includes('pdf')) return icons.pdf;
    if (type.includes('word') || type.includes('document')) return icons.word;
    if (type.includes('excel') || type.includes('spreadsheet')) return icons.excel;
    if (type.includes('powerpoint') || type.includes('presentation')) return icons.powerpoint;
    return icons.default;
  };

  // Get file type name
  const getFileTypeName = (type) => {
    if (type.startsWith('image/')) return 'Hình ảnh';
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('audio/')) return 'Âm thanh';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('word') || type.includes('document')) return 'Word';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'Excel';
    if (type.includes('powerpoint') || type.includes('presentation')) return 'PowerPoint';
    return 'File';
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Hiển thị trạng thái không có chat được chọn
  const renderNoChatSelected = () => (
    <div className="no-chat-selected">
      <div className="no-chat-content">
        <div className="no-chat-icon">
          <FiUser size={64} />
        </div>
        <h2>Chọn một cuộc trò chuyện</h2>
        <p>Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu chat</p>
        <p>hoặc tạo một cuộc trò chuyện mới</p>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => setShowCreateChat(true)}
        >
          <FiPlus />
          Tạo chat mới
        </button>
      </div>
    </div>
  );

  // Hiển thị chat window
  const renderChatWindow = () => (
    <>
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-header-avatar">
            {activeChat.avatar}
            <span className={`chat-header-status ${activeChat.status}`}></span>
          </div>
          <div>
            <h3>{activeChat.name}</h3>
            <div className="chat-header-subtitle">
              <span className={`status-text ${activeChat.status}`}>
                {activeChat.status === 'online' ? 'Đang trực tuyến' : 
                 activeChat.status === 'away' ? 'Tạm vắng' : 'Ngoại tuyến'}
              </span>
              {activeChat.type === 'customer' && <span className="type-badge">Khách hàng</span>}
              {activeChat.type === 'supplier' && <span className="type-badge">Nhà cung cấp</span>}
              {activeChat.type === 'group' && <span className="type-badge">Nhóm</span>}
            </div>
          </div>
        </div>
        <div className="chat-header-actions">
          <button
            className={`btn-icon ${showSearchPanel ? 'active' : ''}`}
            title="Tìm kiếm tin nhắn"
            onClick={() => {
              setShowSearchPanel(!showSearchPanel);
              if (showAttachmentsPanel) setShowAttachmentsPanel(false);
            }}
          >
            <FiSearch />
          </button>
          <button
            className={`btn-icon ${showAttachmentsPanel ? 'active' : ''}`}
            title="Xem file & link đính kèm"
            onClick={() => {
              setShowAttachmentsPanel(!showAttachmentsPanel);
              if (showSearchPanel) setShowSearchPanel(false);
            }}
          >
            <FiPaperclip />
          </button>
          <button className="btn-icon" title="Gọi điện">
            <FiPhone />
          </button>
          {activeChat.type === 'group' && (
            <button
              className="btn-icon"
              title="Cài đặt nhóm"
              onClick={() => setShowGroupSettings(true)}
            >
              <FiUsers />
            </button>
          )}
          <button className="btn-icon" title="Tùy chọn">
            <FiMoreVertical />
          </button>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            id={`message-${msg.id}`}
            className={`message ${msg.type === 'sent' ? 'sent' : 'received'}`}
          >
            {msg.type === 'received' && (
              <div className="message-avatar">
                {msg.avatar || <FiUser />}
              </div>
            )}
            <div className="message-content">
              {msg.type === 'received' && (
                <div className="message-sender">{msg.sender}</div>
              )}
              <div className="message-bubble">
                {msg.text}
                
                {/* Display attachments */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="message-attachments">
                    {msg.attachments.map(att => (
                      <div key={att.id} className="message-attachment">
                        <div className="attachment-icon">
                          {getFileIcon(att.type)}
                        </div>
                        <div className="attachment-info">
                          <div className="attachment-name">{att.name}</div>
                          <div className="attachment-meta">
                            <span className="attachment-type">
                              {getFileTypeName(att.type)}
                            </span>
                            <span className="attachment-size">
                              {formatFileSize(att.size)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="message-time">{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* QuickMessageInput */}
      <div className="chat-input-container">
        <QuickMessageInput
          onSendMessage={handleSendMessage}
          placeholder="Nhập tin nhắn..."
          disabled={!activeChat}
          currentChat={activeChat}
        />
      </div>
    </>
  );

  return (
    <div className="chat-page">
      {/* Header với button tạo chat mới và cuộc gọi */}
      <div className="chat-page-header">
        <h1>Chat</h1>
        <div className="chat-page-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowCreateCall(true)}
          >
            <FiVideo />
            Tạo cuộc gọi
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowCreateGroup(true)}
          >
            <FiUsers />
            Tạo nhóm
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateChat(true)}
          >
            <FiPlus />
            Tạo chat mới
          </button>
        </div>
      </div>
      
      <div className="chat-container">
        {/* Sidebar danh sách chat */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h3>Danh sách chat</h3>
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Tìm kiếm chat..." 
                className="chat-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="chat-list">
            {filteredChats.map((chat) => (
              <div 
                key={chat.id} 
                className={`chat-item ${chat.active ? 'active' : ''}`}
                onClick={() => handleSelectChat(chat)}
              >
                <div className="chat-item-avatar">
                  {chat.avatar}
                  <span className={`chat-item-status ${chat.status}`}></span>
                </div>
                <div className="chat-item-content">
                  <div className="chat-item-header">
                    <div className="chat-item-name">{chat.name}</div>
                    <div className="chat-item-time">{chat.time}</div>
                  </div>
                  <div className="chat-item-message">{chat.lastMessage}</div>
                  <div className="chat-item-footer">
                    {chat.type === 'customer' && <span className="chat-type-badge customer">KH</span>}
                    {chat.type === 'supplier' && <span className="chat-type-badge supplier">NCC</span>}
                    {chat.type === 'group' && <span className="chat-type-badge group">Nhóm</span>}
                    {chat.unread > 0 && (
                      <span className="chat-item-unread">{chat.unread}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat window chính */}
        <div className="chat-main">
          {activeChat ? renderChatWindow() : renderNoChatSelected()}
        </div>

        {/* Attachments Panel */}
        {activeChat && showAttachmentsPanel && (
          <ChatAttachmentsPanel
            messages={messages}
            isOpen={showAttachmentsPanel}
            onClose={() => setShowAttachmentsPanel(false)}
          />
        )}

        {/* Message Search Panel */}
        {activeChat && showSearchPanel && (
          <MessageSearch
            messages={messages}
            isOpen={showSearchPanel}
            onClose={() => setShowSearchPanel(false)}
            onMessageSelect={(message) => {
              // Scroll to selected message
              const messageElement = document.getElementById(`message-${message.id}`);
              if (messageElement) {
                messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Add highlight effect
                messageElement.classList.add('highlight-message');
                setTimeout(() => {
                  messageElement.classList.remove('highlight-message');
                }, 2000);
              }
            }}
          />
        )}
      </div>

      {/* Create New Chat Modal */}
      <CreateNewChat
        isOpen={showCreateChat}
        onClose={() => setShowCreateChat(false)}
        onStartChat={handleStartChat}
      />

      {/* Create Call Modal */}
      <CreateCallModal
        isOpen={showCreateCall}
        onClose={() => setShowCreateCall(false)}
        contacts={mockContacts}
        onStartCall={handleStartCall}
      />

      {/* Active Call Component */}
      {activeCall && (
        <ActiveCall
          callData={activeCall}
          onEndCall={handleEndCall}
          onMinimize={handleMinimizeCall}
        />
      )}

      {/* Create Group Modal */}
      <CreateGroupChatModal
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreateGroup={handleCreateGroup}
        availableContacts={mockContacts}
      />

      {/* Group Settings Modal */}
      {activeChat && activeChat.type === 'group' && (
        <GroupSettingsModal
          isOpen={showGroupSettings}
          onClose={() => setShowGroupSettings(false)}
          group={activeChat}
          onUpdateGroup={handleUpdateGroup}
          onLeaveGroup={handleLeaveGroup}
          availableContacts={mockContacts}
        />
      )}
    </div>
  );
};

export default ChatPage;