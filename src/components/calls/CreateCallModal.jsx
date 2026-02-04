// src/components/calls/CreateCallModal.jsx
import React, { useState, useEffect } from 'react';
import { FiUsers, FiUserPlus, FiX, FiSearch, FiUser, FiVideo, FiPhone, FiClock, FiCalendar } from 'react-icons/fi';

const CreateCallModal = ({ isOpen, onClose, contacts, onStartCall }) => {
  const [callType, setCallType] = useState('voice'); // 'voice' or 'video'
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [scheduleType, setScheduleType] = useState('now'); // 'now' or 'schedule'
  const [scheduleTime, setScheduleTime] = useState('');
  const [callTitle, setCallTitle] = useState('');

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle contact selection
  const handleSelectContact = (contact) => {
    if (!selectedContacts.find(c => c.id === contact.id)) {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  // Handle contact removal
  const handleRemoveContact = (contactId) => {
    setSelectedContacts(selectedContacts.filter(c => c.id !== contactId));
  };

  // Handle start call
  const handleStartCall = () => {
    if (selectedContacts.length === 0) {
      alert('Vui lòng chọn ít nhất một người tham gia');
      return;
    }

    const callData = {
      type: callType,
      participants: selectedContacts,
      title: callTitle || `${callType === 'voice' ? 'Cuộc gọi thoại' : 'Cuộc gọi video'} với ${selectedContacts.length} người`,
      scheduled: scheduleType === 'schedule' ? scheduleTime : null,
      isScheduled: scheduleType === 'schedule'
    };

    onStartCall(callData);
    onClose();
  };

  // Set default title
  useEffect(() => {
    if (!callTitle && selectedContacts.length > 0) {
      if (selectedContacts.length === 1) {
        setCallTitle(`${callType === 'voice' ? 'Cuộc gọi thoại' : 'Cuộc gọi video'} với ${selectedContacts[0].name}`);
      } else {
        setCallTitle(`${callType === 'voice' ? 'Cuộc gọi thoại' : 'Cuộc gọi video'} nhóm (${selectedContacts.length} người)`);
      }
    }
  }, [selectedContacts, callType, callTitle]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedContacts([]);
      setSearchTerm('');
      setCallTitle('');
      setCallType('voice');
      setScheduleType('now');
      setScheduleTime('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="create-call-modal-overlay">
      <div className="create-call-modal">
        {/* Header */}
        <div className="create-call-header">
          <div className="create-call-title">
            <div className="create-call-icon">
              {callType === 'voice' ? <FiPhone /> : <FiVideo />}
            </div>
            <div>
              <h3>Tạo cuộc gọi mới</h3>
              <p className="create-call-subtitle">
                {callType === 'voice' ? 'Cuộc gọi thoại' : 'Cuộc gọi video'}
              </p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Main content */}
        <div className="create-call-content">
          {/* Call type selection */}
          <div className="call-type-section">
            <h4>Loại cuộc gọi</h4>
            <div className="call-type-buttons">
              <button
                className={`call-type-btn ${callType === 'voice' ? 'active' : ''}`}
                onClick={() => setCallType('voice')}
              >
                <div className="call-type-icon">
                  <FiPhone />
                </div>
                <div className="call-type-info">
                  <div className="call-type-name">Cuộc gọi thoại</div>
                  <div className="call-type-desc">Chỉ âm thanh</div>
                </div>
              </button>
              <button
                className={`call-type-btn ${callType === 'video' ? 'active' : ''}`}
                onClick={() => setCallType('video')}
              >
                <div className="call-type-icon">
                  <FiVideo />
                </div>
                <div className="call-type-info">
                  <div className="call-type-name">Cuộc gọi video</div>
                  <div className="call-type-desc">Âm thanh + Hình ảnh</div>
                </div>
              </button>
            </div>
          </div>

          {/* Selected participants */}
          {selectedContacts.length > 0 && (
            <div className="selected-participants-section">
              <h4>Người tham gia ({selectedContacts.length})</h4>
              <div className="selected-participants-list">
                {selectedContacts.map(contact => (
                  <div key={contact.id} className="selected-participant">
                    <div className="selected-participant-avatar">
                      {contact.avatar || <FiUser />}
                    </div>
                    <div className="selected-participant-info">
                      <div className="selected-participant-name">{contact.name}</div>
                      <div className="selected-participant-role">{contact.role}</div>
                    </div>
                    <button
                      className="remove-participant-btn"
                      onClick={() => handleRemoveContact(contact.id)}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search and add participants */}
          <div className="add-participants-section">
            <h4>Thêm người tham gia</h4>
            <div className="search-participants">
              <div className="search-input-wrapper">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email hoặc vai trò..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="participants-list">
              {filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  className={`participant-item ${selectedContacts.find(c => c.id === contact.id) ? 'selected' : ''}`}
                  onClick={() => handleSelectContact(contact)}
                >
                  <div className="participant-avatar">
                    {contact.avatar || <FiUser />}
                    <span className={`participant-status ${contact.status}`}></span>
                  </div>
                  <div className="participant-info">
                    <div className="participant-name">
                      {contact.name}
                      {selectedContacts.find(c => c.id === contact.id) && (
                        <span className="selected-badge">Đã chọn</span>
                      )}
                    </div>
                    <div className="participant-details">
                      <span className="participant-email">{contact.email}</span>
                      <span className="participant-role">{contact.role}</span>
                    </div>
                  </div>
                  <div className="participant-action">
                    {selectedContacts.find(c => c.id === contact.id) ? (
                      <button
                        className="remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveContact(contact.id);
                        }}
                      >
                        <FiX />
                      </button>
                    ) : (
                      <button
                        className="add-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectContact(contact);
                        }}
                      >
                        <FiUserPlus />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call details */}
          <div className="call-details-section">
            <h4>Chi tiết cuộc gọi</h4>
            <div className="call-details-form">
              <div className="form-group">
                <label htmlFor="callTitle">Tiêu đề cuộc gọi</label>
                <input
                  id="callTitle"
                  type="text"
                  value={callTitle}
                  onChange={(e) => setCallTitle(e.target.value)}
                  placeholder="Nhập tiêu đề cuộc gọi..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Lịch trình</label>
                <div className="schedule-options">
                  <button
                    className={`schedule-option ${scheduleType === 'now' ? 'active' : ''}`}
                    onClick={() => setScheduleType('now')}
                  >
                    <FiClock />
                    <span>Ngay lập tức</span>
                  </button>
                  <button
                    className={`schedule-option ${scheduleType === 'schedule' ? 'active' : ''}`}
                    onClick={() => setScheduleType('schedule')}
                  >
                    <FiCalendar />
                    <span>Lên lịch</span>
                  </button>
                </div>

                {scheduleType === 'schedule' && (
                  <div className="schedule-time-input">
                    <input
                      type="datetime-local"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="form-input"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="create-call-footer">
          <button className="footer-btn secondary" onClick={onClose}>
            Hủy
          </button>
          <div className="footer-info">
            <span className="participant-count">
              <FiUsers />
              {selectedContacts.length} người tham gia
            </span>
            <span className="call-type-info">
              {callType === 'voice' ? 'Cuộc gọi thoại' : 'Cuộc gọi video'}
            </span>
          </div>
          <button
            className="footer-btn primary"
            onClick={handleStartCall}
            disabled={selectedContacts.length === 0}
          >
            {scheduleType === 'now' ? (
              <>
                {callType === 'voice' ? <FiPhone /> : <FiVideo />}
                Bắt đầu cuộc gọi
              </>
            ) : (
              <>
                <FiCalendar />
                Lên lịch cuộc gọi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCallModal;