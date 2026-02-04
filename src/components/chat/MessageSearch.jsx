// src/components/chat/MessageSearch.jsx
import React, { useState, useMemo } from 'react';
import { FiSearch, FiX, FiChevronUp, FiChevronDown, FiCalendar, FiUser } from 'react-icons/fi';
import './MessageSearch.css';

const MessageSearch = ({ messages, isOpen, onClose, onMessageSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Search messages
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const lowerSearch = searchTerm.toLowerCase();
    return messages
      .map((msg, index) => ({
        ...msg,
        originalIndex: index,
        matchText: msg.text
      }))
      .filter(msg =>
        msg.text?.toLowerCase().includes(lowerSearch) ||
        msg.sender?.toLowerCase().includes(lowerSearch)
      );
  }, [messages, searchTerm]);

  // Navigate to previous result
  const handlePrevious = () => {
    if (searchResults.length === 0) return;
    const newIndex = currentIndex > 0 ? currentIndex - 1 : searchResults.length - 1;
    setCurrentIndex(newIndex);
    if (onMessageSelect) {
      onMessageSelect(searchResults[newIndex]);
    }
  };

  // Navigate to next result
  const handleNext = () => {
    if (searchResults.length === 0) return;
    const newIndex = currentIndex < searchResults.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    if (onMessageSelect) {
      onMessageSelect(searchResults[newIndex]);
    }
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentIndex(0);
  };

  // Handle clear search
  const handleClear = () => {
    setSearchTerm('');
    setCurrentIndex(0);
  };

  // Highlight search term in text
  const highlightText = (text, search) => {
    if (!search.trim()) return text;

    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="message-search-panel">
      <div className="search-panel-header">
        <h3>Tìm kiếm tin nhắn</h3>
        <button className="btn-close-search" onClick={onClose}>
          <FiX />
        </button>
      </div>

      {/* Search Input */}
      <div className="search-input-section">
        <div className="search-input-wrapper">
          <FiSearch className="search-input-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm tin nhắn..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-main-input"
            autoFocus
          />
          {searchTerm && (
            <button className="btn-clear-search" onClick={handleClear}>
              <FiX />
            </button>
          )}
        </div>

        {/* Navigation controls */}
        {searchResults.length > 0 && (
          <div className="search-navigation">
            <span className="search-count">
              {currentIndex + 1} / {searchResults.length}
            </span>
            <div className="search-nav-buttons">
              <button
                className="btn-nav-search"
                onClick={handlePrevious}
                disabled={searchResults.length === 0}
                title="Kết quả trước"
              >
                <FiChevronUp />
              </button>
              <button
                className="btn-nav-search"
                onClick={handleNext}
                disabled={searchResults.length === 0}
                title="Kết quả tiếp"
              >
                <FiChevronDown />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="search-results-section">
        {!searchTerm ? (
          <div className="search-empty-state">
            <div className="empty-state-icon">
              <FiSearch size={48} />
            </div>
            <p>Nhập từ khóa để tìm kiếm tin nhắn</p>
            <div className="search-tips">
              <div className="tip-item">
                <span className="tip-icon">💡</span>
                <span>Tìm kiếm theo nội dung tin nhắn</span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">👤</span>
                <span>Tìm kiếm theo tên người gửi</span>
              </div>
            </div>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="search-no-results">
            <div className="no-results-icon">🔍</div>
            <p>Không tìm thấy kết quả nào</p>
            <span className="no-results-hint">
              Thử tìm kiếm với từ khóa khác
            </span>
          </div>
        ) : (
          <div className="search-results-list">
            {searchResults.map((result, index) => (
              <div
                key={result.id}
                className={`search-result-item ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  setCurrentIndex(index);
                  if (onMessageSelect) {
                    onMessageSelect(result);
                  }
                }}
              >
                <div className="result-header">
                  <div className="result-sender">
                    <FiUser size={14} />
                    {result.sender}
                  </div>
                  <div className="result-time">
                    <FiCalendar size={12} />
                    {result.time}
                  </div>
                </div>
                <div className="result-text">
                  {highlightText(result.text, searchTerm)}
                </div>
                {result.attachments && result.attachments.length > 0 && (
                  <div className="result-attachments">
                    📎 {result.attachments.length} file đính kèm
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageSearch;
