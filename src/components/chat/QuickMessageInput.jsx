// src/components/chat/QuickMessageInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FiPaperclip, FiSmile, FiSend, FiImage, FiFile, FiVideo, FiMusic, FiX } from 'react-icons/fi';

const QuickMessageInput = ({ 
  onSendMessage, 
  placeholder = "Nhập tin nhắn...", 
  disabled = false,
  currentChat = null 
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Emojis categorized
  const emojiCategories = {
    'Cảm xúc': ['😀', '😂', '😊', '😍', '🥰', '😎', '😢', '😡', '😴', '😷'],
    'Biểu tượng': ['👍', '👎', '👏', '🙏', '💪', '👀', '👂', '👃', '👄', '💋'],
    'Đồ vật': ['💻', '📱', '📷', '🎥', '🎮', '📚', '✏️', '📎', '📌', '✂️'],
    'Thiên nhiên': ['🌞', '🌙', '⭐', '🌈', '☁️', '☔', '⚡', '❄️', '🔥', '💧'],
    'Thực phẩm': ['🍎', '🍕', '🍔', '🍟', '🍦', '🍰', '☕', '🍷', '🍺', '🍫'],
    'Hoạt động': ['⚽', '🏀', '🎯', '🎮', '🎸', '🎤', '🎭', '🎨', '🎪', '🎬'],
  };

  const handleSend = () => {
    if ((!message.trim() && attachments.length === 0) || disabled) return;
    
    const messageData = {
      text: message.trim(),
      attachments: attachments.map(att => ({
        name: att.name,
        type: att.type,
        size: att.size,
        url: URL.createObjectURL(att.file) // In real app, upload to server
      })),
      timestamp: new Date().toISOString(),
      chatId: currentChat?.id
    };
    
    onSendMessage(messageData);
    
    // Reset form
    setMessage('');
    setAttachments([]);
    setShowEmojiPicker(false);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    
    // Typing indicator
    if (message.trim() && !isTyping) {
      setIsTyping(true);
      // In real app, emit typing event to server
    }
  };

  const handleKeyUp = () => {
    if (!message.trim() && isTyping) {
      setIsTyping(false);
      // In real app, emit stop typing event
    }
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
    
    // Check file size (max 10MB per file)
    const oversizedFiles = newAttachments.filter(att => att.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`Một số file vượt quá 10MB: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }
    
    setAttachments([...attachments, ...newAttachments]);
    e.target.value = ''; // Reset input
  };

  const handleRemoveAttachment = (id) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const handleAddEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <FiImage className="file-icon" />;
    if (type.startsWith('video/')) return <FiVideo className="file-icon" />;
    if (type.startsWith('audio/')) return <FiMusic className="file-icon" />;
    return <FiFile className="file-icon" />;
  };

  const getFileTypeName = (type) => {
    if (type.startsWith('image/')) return 'Hình ảnh';
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('audio/')) return 'Âm thanh';
    if (type.startsWith('application/pdf')) return 'PDF';
    if (type.includes('word') || type.includes('document')) return 'Word';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'Excel';
    if (type.includes('powerpoint') || type.includes('presentation')) return 'PowerPoint';
    return 'File';
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [message]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const files = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      e.preventDefault();
      const newAttachments = files.map(file => ({
        id: Date.now() + Math.random(),
        name: `pasted-image-${Date.now()}.png`,
        type: file.type,
        size: file.size,
        file
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const newAttachments = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        file
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  return (
    <div className="quick-message-input">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="attachments-preview">
          <div className="attachments-header">
            <span className="attachments-count">
              {attachments.length} file đính kèm
            </span>
            <button
              type="button"
              className="clear-all-btn"
              onClick={() => setAttachments([])}
            >
              Xóa tất cả
            </button>
          </div>
          
          <div className="attachments-grid">
            {attachments.map(attachment => (
              <div key={attachment.id} className="attachment-preview">
                <div className="attachment-preview-content">
                  <div className="attachment-icon">
                    {getFileIcon(attachment.type)}
                  </div>
                  <div className="attachment-details">
                    <div className="attachment-name" title={attachment.name}>
                      {attachment.name.length > 25 
                        ? attachment.name.substring(0, 25) + '...' 
                        : attachment.name}
                    </div>
                    <div className="attachment-info">
                      <span className="attachment-type">
                        {getFileTypeName(attachment.type)}
                      </span>
                      <span className="attachment-size">
                        {formatFileSize(attachment.size)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="remove-attachment-btn"
                  onClick={() => handleRemoveAttachment(attachment.id)}
                  aria-label="Xóa file"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div 
        className="input-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="input-toolbar">
          <div className="toolbar-left">
            {/* File upload button */}
            <div className="toolbar-button-group">
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Đính kèm file"
                disabled={disabled}
              >
                <FiPaperclip />
                <span className="tooltip">Đính kèm</span>
              </button>
              
              <div className="toolbar-dropdown">
                <button
                  type="button"
                  className="toolbar-btn"
                  title="Chọn loại file"
                  disabled={disabled}
                >
                  <span className="dropdown-arrow">▾</span>
                </button>
                <div className="dropdown-menu">
                  <label className="dropdown-item">
                    <FiImage /> Hình ảnh
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <label className="dropdown-item">
                    <FiVideo /> Video
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <label className="dropdown-item">
                    <FiFile /> Tài liệu
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                      multiple
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Emoji picker */}
            <div className="emoji-picker-container">
              <button
                type="button"
                className={`toolbar-btn ${showEmojiPicker ? 'active' : ''}`}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                title="Chọn emoji"
                disabled={disabled}
              >
                <FiSmile />
                <span className="tooltip">Emoji</span>
              </button>

              {showEmojiPicker && (
                <div className="emoji-picker-modal">
                  <div className="emoji-picker-header">
                    <div className="emoji-picker-title">Chọn emoji</div>
                    <button
                      type="button"
                      className="emoji-picker-close"
                      onClick={() => setShowEmojiPicker(false)}
                    >
                      <FiX />
                    </button>
                  </div>
                  
                  <div className="emoji-picker-content">
                    {Object.entries(emojiCategories).map(([category, emojis]) => (
                      <div key={category} className="emoji-category">
                        <div className="emoji-category-title">{category}</div>
                        <div className="emoji-grid">
                          {emojis.map(emoji => (
                            <button
                              key={emoji}
                              type="button"
                              className="emoji-item"
                              onClick={() => handleAddEmoji(emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="emoji-picker-footer">
                    <div className="emoji-search">
                      <input
                        type="text"
                        placeholder="Tìm emoji..."
                        className="emoji-search-input"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Typing indicator */}
          {isTyping && (
            <div className="typing-indicator">
              <div className="typing-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
              <span className="typing-text">Đang nhập...</span>
            </div>
          )}

          <div className="toolbar-right">
            <span className="char-count">
              {message.length}/1000
            </span>
          </div>
        </div>

        {/* Textarea */}
        <div className="textarea-container">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onKeyUp={handleKeyUp}
            onPaste={handlePaste}
            placeholder={placeholder}
            className="message-textarea"
            rows={1}
            disabled={disabled}
            maxLength={1000}
          />
          
          <div className="textarea-actions">
            <button
              type="button"
              className="send-button"
              onClick={handleSend}
              disabled={(!message.trim() && attachments.length === 0) || disabled}
              title="Gửi tin nhắn (Enter)"
            >
              <FiSend />
              <span className="send-text">Gửi</span>
            </button>
          </div>
        </div>

        {/* File input (hidden) */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
          multiple
        />

        {/* Helper text */}
        <div className="input-helper">
          <span className="helper-text">
            Nhấn <kbd>Enter</kbd> để gửi, <kbd>Shift + Enter</kbd> để xuống dòng
          </span>
          <span className="helper-text">
            Kéo thả file vào đây để đính kèm
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuickMessageInput;