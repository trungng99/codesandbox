// src/components/chat/ChatAttachmentsPanel.jsx
import React, { useState, useMemo } from 'react';
import { FiFile, FiLink, FiImage, FiDownload, FiExternalLink, FiX, FiSearch } from 'react-icons/fi';
import './ChatAttachmentsPanel.css';

const ChatAttachmentsPanel = ({ messages, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'files', 'links', 'images'
  const [searchTerm, setSearchTerm] = useState('');

  // Extract all attachments and links from messages
  const { attachments, links, images } = useMemo(() => {
    const allAttachments = [];
    const allLinks = [];
    const allImages = [];

    messages.forEach(msg => {
      // Get file attachments
      if (msg.attachments && msg.attachments.length > 0) {
        msg.attachments.forEach(att => {
          const item = {
            ...att,
            messageId: msg.id,
            sender: msg.sender,
            time: msg.time,
            messageText: msg.text
          };

          if (att.type?.startsWith('image/')) {
            allImages.push(item);
          }
          allAttachments.push(item);
        });
      }

      // Extract URLs from message text
      if (msg.text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = msg.text.match(urlRegex);
        if (urls) {
          urls.forEach(url => {
            allLinks.push({
              id: `${msg.id}-${url}`,
              url,
              messageId: msg.id,
              sender: msg.sender,
              time: msg.time,
              messageText: msg.text
            });
          });
        }
      }
    });

    return {
      attachments: allAttachments,
      links: allLinks,
      images: allImages
    };
  }, [messages]);

  // Filter items based on search and tab
  const filteredItems = useMemo(() => {
    let items = [];

    switch (activeTab) {
      case 'files':
        items = attachments.filter(att => !att.type?.startsWith('image/'));
        break;
      case 'links':
        items = links;
        break;
      case 'images':
        items = images;
        break;
      default:
        items = [...attachments, ...links];
    }

    if (searchTerm) {
      items = items.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.name?.toLowerCase().includes(searchLower) ||
          item.url?.toLowerCase().includes(searchLower) ||
          item.messageText?.toLowerCase().includes(searchLower) ||
          item.sender?.toLowerCase().includes(searchLower)
        );
      });
    }

    return items;
  }, [activeTab, searchTerm, attachments, links, images]);

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon
  const getFileIcon = (type) => {
    if (!type) return <FiFile />;
    if (type.startsWith('image/')) return <FiImage />;
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation')) return '📑';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    return <FiFile />;
  };

  // Get domain from URL
  const getDomain = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-attachments-panel">
      <div className="attachments-panel-header">
        <h3>File & Đường link</h3>
        <button className="btn-close-panel" onClick={onClose}>
          <FiX />
        </button>
      </div>

      {/* Search bar */}
      <div className="attachments-search">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Tìm kiếm file, link..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="attachments-search-input"
        />
      </div>

      {/* Tabs */}
      <div className="attachments-tabs">
        <button
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Tất cả ({attachments.length + links.length})
        </button>
        <button
          className={`tab ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => setActiveTab('files')}
        >
          File ({attachments.filter(att => !att.type?.startsWith('image/')).length})
        </button>
        <button
          className={`tab ${activeTab === 'images' ? 'active' : ''}`}
          onClick={() => setActiveTab('images')}
        >
          Ảnh ({images.length})
        </button>
        <button
          className={`tab ${activeTab === 'links' ? 'active' : ''}`}
          onClick={() => setActiveTab('links')}
        >
          Link ({links.length})
        </button>
      </div>

      {/* Items list */}
      <div className="attachments-list">
        {filteredItems.length === 0 ? (
          <div className="no-items">
            <div className="no-items-icon">
              {activeTab === 'links' ? <FiLink size={48} /> : <FiFile size={48} />}
            </div>
            <p>Không có {activeTab === 'links' ? 'đường link' : 'file'} nào</p>
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <div key={item.id || index} className="attachment-item">
              {item.url ? (
                // Link item
                <div className="link-item">
                  <div className="link-icon">
                    <FiLink />
                  </div>
                  <div className="link-info">
                    <div className="link-url">{getDomain(item.url)}</div>
                    <div className="link-full-url">{item.url}</div>
                    <div className="link-meta">
                      <span className="link-sender">{item.sender}</span>
                      <span className="link-time">{item.time}</span>
                    </div>
                  </div>
                  <div className="link-actions">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-link-action"
                      title="Mở link"
                    >
                      <FiExternalLink />
                    </a>
                  </div>
                </div>
              ) : (
                // File item
                <div className="file-item">
                  <div className="file-icon">
                    {getFileIcon(item.type)}
                  </div>
                  <div className="file-info">
                    <div className="file-name">{item.name}</div>
                    <div className="file-meta">
                      <span className="file-size">{formatFileSize(item.size)}</span>
                      <span className="file-sender">{item.sender}</span>
                      <span className="file-time">{item.time}</span>
                    </div>
                  </div>
                  <div className="file-actions">
                    <button
                      className="btn-file-action"
                      title="Tải xuống"
                      onClick={() => {
                        // In real app, trigger download
                        window.open(item.url, '_blank');
                      }}
                    >
                      <FiDownload />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Stats footer */}
      <div className="attachments-footer">
        <div className="attachments-stats">
          <div className="stat">
            <span className="stat-value">{attachments.length}</span>
            <span className="stat-label">File</span>
          </div>
          <div className="stat">
            <span className="stat-value">{images.length}</span>
            <span className="stat-label">Ảnh</span>
          </div>
          <div className="stat">
            <span className="stat-value">{links.length}</span>
            <span className="stat-label">Link</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAttachmentsPanel;
