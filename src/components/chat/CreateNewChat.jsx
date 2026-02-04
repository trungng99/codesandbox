// src/components/chat/CreateNewChat.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiPaperclip, FiSmile, FiSend, FiX, FiUser, FiUsers } from 'react-icons/fi';

const CreateNewChat = ({ isOpen, onClose, onStartChat }) => {
  const [step, setStep] = useState(1); // 1: Chọn liên hệ, 2: Soạn tin nhắn
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  // Mock data contacts
  const contacts = [
    { id: 1, name: 'Nguyễn Văn A', email: 'a@company.com', role: 'Khách hàng', avatar: 'NA', status: 'online' },
    { id: 2, name: 'Trần Thị B', email: 'b@company.com', role: 'Nhà cung cấp', avatar: 'TB', status: 'offline' },
    { id: 3, name: 'Lê Văn C', email: 'c@company.com', role: 'Nhân viên Sales', avatar: 'LC', status: 'online' },
    { id: 4, name: 'Phạm Thị D', email: 'd@company.com', role: 'Khách hàng', avatar: 'PD', status: 'away' },
    { id: 5, name: 'Công ty ABC Corp', email: 'info@abccorp.com', role: 'Doanh nghiệp', avatar: 'AB', status: 'online' },
    { id: 6, name: 'Nguyễn Thị E', email: 'e@company.com', role: 'CS', avatar: 'NE', status: 'online' },
    { id: 7, name: 'Trần Văn F', email: 'f@company.com', role: 'Quản lý', avatar: 'TF', status: 'offline' },
    { id: 8, name: 'Nhà cung cấp XYZ', email: 'contact@xyz.com', role: 'Nhà cung cấp', avatar: 'XY', status: 'online' },
  ];

  // Mock emojis
  const emojis = ['😀', '😂', '😍', '😎', '👍', '❤️', '🎉', '🔥', '✨', '💯', '👏', '🙏'];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setStep(2);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      file
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const handleRemoveAttachment = (id) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const handleAddEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleSendMessage = () => {
    if ((!message.trim() && attachments.length === 0) || !selectedContact) {
      alert('Vui lòng nhập tin nhắn hoặc chọn file');
      return;
    }

    const chatData = {
      contact: selectedContact,
      message: message.trim(),
      attachments: attachments,
      timestamp: new Date().toISOString()
    };

    if (onStartChat) {
      onStartChat(chatData);
    }

    // Reset form
    setSelectedContact(null);
    setMessage('');
    setAttachments([]);
    setStep(1);
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedContact(null);
      setMessage('');
      setAttachments([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="create-chat-modal-overlay">
      <div className="create-chat-modal">
        {/* Header */}
        <div className="create-chat-header">
          <div className="create-chat-title">
            {step === 1 ? 'Tạo chat mới' : 'Soạn tin nhắn'}
          </div>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Progress steps */}
        <div className="create-chat-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Chọn liên hệ</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Soạn tin nhắn</div>
          </div>
        </div>

        {/* Step 1: Select Contact */}
        {step === 1 && (
          <div className="create-chat-step">
            <div className="search-section">
              <div className="search-input-wrapper">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Tìm kiếm liên hệ theo tên, email hoặc vai trò..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  autoFocus
                />
              </div>
            </div>

            <div className="contacts-section">
              <div className="section-title">Liên hệ gần đây</div>
              <div className="contacts-grid">
                {filteredContacts.slice(0, 4).map(contact => (
                  <div
                    key={contact.id}
                    className="contact-card"
                    onClick={() => handleSelectContact(contact)}
                  >
                    <div className="contact-avatar">
                      {contact.avatar}
                      <span className={`contact-status ${contact.status}`}></span>
                    </div>
                    <div className="contact-info">
                      <div className="contact-name">{contact.name}</div>
                      <div className="contact-email">{contact.email}</div>
                      <div className="contact-role">{contact.role}</div>
                    </div>
                    <div className="contact-action">
                      <FiUser />
                    </div>
                  </div>
                ))}
              </div>

              <div className="section-title">Tất cả liên hệ</div>
              <div className="contacts-list">
                {filteredContacts.map(contact => (
                  <div
                    key={contact.id}
                    className="contact-item"
                    onClick={() => handleSelectContact(contact)}
                  >
                    <div className="contact-item-avatar">
                      {contact.avatar}
                    </div>
                    <div className="contact-item-info">
                      <div className="contact-item-name">
                        {contact.name}
                        <span className={`contact-item-status ${contact.status}`}></span>
                      </div>
                      <div className="contact-item-details">
                        <span className="contact-item-email">{contact.email}</span>
                        <span className="contact-item-role">{contact.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredContacts.length === 0 && (
                <div className="no-contacts">
                  <FiUsers size={48} />
                  <p>Không tìm thấy liên hệ phù hợp</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Compose Message */}
        {step === 2 && selectedContact && (
          <div className="create-chat-step">
            <div className="selected-contact-header">
              <div className="selected-contact-info">
                <div className="selected-contact-avatar">
                  {selectedContact.avatar}
                </div>
                <div>
                  <div className="selected-contact-name">{selectedContact.name}</div>
                  <div className="selected-contact-email">{selectedContact.email} • {selectedContact.role}</div>
                </div>
              </div>
              <button className="back-button" onClick={() => setStep(1)}>
                Thay đổi
              </button>
            </div>

            <div className="compose-section">
              <div className="message-input-wrapper">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn của bạn..."
                  className="message-input"
                  rows={4}
                  autoFocus
                />
                
                {/* Attachments preview */}
                {attachments.length > 0 && (
                  <div className="attachments-preview">
                    {attachments.map(attachment => (
                      <div key={attachment.id} className="attachment-item">
                        <div className="attachment-info">
                          <div className="attachment-name">{attachment.name}</div>
                          <div className="attachment-size">{formatFileSize(attachment.size)}</div>
                        </div>
                        <button
                          className="remove-attachment"
                          onClick={() => handleRemoveAttachment(attachment.id)}
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="message-actions">
                  <div className="action-buttons">
                    <button
                      className="action-button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Đính kèm file"
                    >
                      <FiPaperclip />
                    </button>
                    
                    <div className="emoji-picker-wrapper">
                      <button
                        className="action-button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        title="Chọn emoji"
                      >
                        <FiSmile />
                      </button>
                      
                      {showEmojiPicker && (
                        <div className="emoji-picker">
                          {emojis.map(emoji => (
                            <button
                              key={emoji}
                              className="emoji-button"
                              onClick={() => handleAddEmoji(emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={!message.trim() && attachments.length === 0}
                  >
                    <FiSend />
                    Gửi tin nhắn
                  </button>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                multiple
              />
            </div>

            <div className="compose-tips">
              <p><strong>Mẹo:</strong> Nhấn Enter để gửi, Shift + Enter để xuống dòng</p>
              <p>Hỗ trợ file: ảnh, PDF, Word, Excel (tối đa 10MB/file)</p>
            </div>
          </div>
        )}

        {/* Footer buttons */}
        <div className="create-chat-footer">
          {step === 2 && (
            <button className="footer-button secondary" onClick={() => setStep(1)}>
              Quay lại
            </button>
          )}
          <div className="footer-spacer"></div>
          <button className="footer-button" onClick={onClose}>
            Hủy
          </button>
          {step === 2 && (
            <button
              className="footer-button primary"
              onClick={handleSendMessage}
              disabled={!message.trim() && attachments.length === 0}
            >
              Bắt đầu chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateNewChat;