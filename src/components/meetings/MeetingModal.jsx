// src/components/meeting/MeetingModal.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './MeetingModal.css';

const MeetingModal = ({ event, onClose, onSave, onDelete }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: 'meeting',
    location: '',
    isAllDay: false,
    participants: [],
    status: 'scheduled',
    isOnline: false,
    meetingLink: '',
    platform: 'zoom'
  });
  const [availableParticipants, setAvailableParticipants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [callType, setCallType] = useState('video'); // 'video' or 'voice'

  // Initialize form with event data if editing
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        startTime: event.start ? formatDateTimeLocal(event.start) : '',
        endTime: event.end ? formatDateTimeLocal(event.end) : '',
        type: event.type || 'meeting',
        location: event.location || '',
        isAllDay: event.isAllDay || false,
        participants: event.participants || [],
        status: event.status || 'scheduled',
        isOnline: event.isOnline || false,
        meetingLink: event.meetingLink || '',
        platform: event.platform || 'zoom'
      });
    } else {
      // Default to current time + 1 hour
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      setFormData(prev => ({
        ...prev,
        startTime: formatDateTimeLocal(now),
        endTime: formatDateTimeLocal(oneHourLater)
      }));
    }
  }, [event]);

  // Fetch available participants
  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await api.get('/users');
      setAvailableParticipants(response.data);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const formatDateTimeLocal = (date) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddParticipant = (participant) => {
    if (!formData.participants.find(p => p.id === participant.id)) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, {
          id: participant.id,
          name: participant.name,
          email: participant.email,
          role: participant.role,
          status: 'pending'
        }]
      }));
    }
    setSearchQuery('');
  };

  const handleRemoveParticipant = (participantId) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== participantId)
    }));
  };

  // Generate meeting link based on platform
  const generateMeetingLink = (platform) => {
    const meetingId = Math.random().toString(36).substring(2, 15);
    const links = {
      zoom: `https://zoom.us/j/${meetingId}`,
      meet: `https://meet.google.com/${meetingId}`,
      teams: `https://teams.microsoft.com/l/meetup-join/${meetingId}`,
      system: `${window.location.origin}/meeting/${meetingId}`,
      custom: ''
    };
    return links[platform] || '';
  };

  // Handle online/offline toggle
  const handleOnlineToggle = (isOnline) => {
    setFormData(prev => ({
      ...prev,
      isOnline,
      meetingLink: isOnline ? generateMeetingLink(prev.platform) : '',
      location: isOnline ? '' : prev.location
    }));
  };

  // Handle platform change
  const handlePlatformChange = (platform) => {
    setFormData(prev => ({
      ...prev,
      platform,
      meetingLink: generateMeetingLink(platform)
    }));
  };

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(formData.meetingLink);
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  // Share meeting link via different methods
  const handleShareLink = (method) => {
    const shareText = `Tham gia cuộc họp: ${formData.title}\nThời gian: ${formData.startTime}\nLink: ${formData.meetingLink}`;

    if (method === 'email') {
      window.location.href = `mailto:?subject=${encodeURIComponent(formData.title)}&body=${encodeURIComponent(shareText)}`;
    } else if (method === 'copy') {
      handleCopyLink();
    }
  };

  // Add test participants
  const addTestParticipants = () => {
    const testUsers = [
      { id: 'test1', name: 'Nguyễn Văn A', email: 'vana@test.com', role: 'Manager', status: 'pending' },
      { id: 'test2', name: 'Trần Thị B', email: 'thib@test.com', role: 'Developer', status: 'pending' },
      { id: 'test3', name: 'Lê Văn C', email: 'vanc@test.com', role: 'Designer', status: 'pending' }
    ];

    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, ...testUsers.filter(user =>
        !prev.participants.find(p => p.id === user.id)
      )]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const meetingData = {
        ...formData,
        createdBy: user.id,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        participants: formData.participants.map(p => ({
          userId: p.id,
          status: p.status
        }))
      };

      await onSave(meetingData);
    } catch (error) {
      console.error('Error saving meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredParticipants = availableParticipants.filter(participant =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type) => {
    const colors = {
      meeting: '#2196f3',
      call: '#9c27b0',
      task: '#4caf50',
      appointment: '#ff9800'
    };
    return colors[type] || '#757575';
  };

  return (
    <div className="modal-overlay">
      <div className="meeting-modal">
        <div className="modal-header">
          <h2>{event ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới'}</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-section">
              <label className="form-label">
                Tiêu đề *
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nhập tiêu đề sự kiện"
                  required
                />
              </label>
            </div>

            <div className="form-section">
              <label className="form-label">
                Loại sự kiện
                <div className="type-selector">
                  {['meeting', 'call', 'task', 'appointment'].map(type => (
                    <button
                      key={type}
                      type="button"
                      className={`type-option ${formData.type === type ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, type }))}
                      style={{
                        borderColor: getTypeColor(type),
                        backgroundColor: formData.type === type ? getTypeColor(type) + '20' : 'transparent'
                      }}
                    >
                      {type === 'meeting' && '👥 Cuộc họp'}
                      {type === 'call' && '📞 Cuộc gọi'}
                      {type === 'task' && '✅ Công việc'}
                      {type === 'appointment' && '📅 Hẹn gặp'}
                    </button>
                  ))}
                </div>
              </label>
            </div>

            <div className="form-row">
              <div className="form-section">
                <label className="form-label">
                  Thời gian bắt đầu *
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </label>
              </div>

              <div className="form-section">
                <label className="form-label">
                  Thời gian kết thúc *
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="form-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isAllDay"
                  checked={formData.isAllDay}
                  onChange={handleInputChange}
                />
                <span>Sự kiện cả ngày</span>
              </label>
            </div>

            {/* Online/Offline Selection */}
            <div className="form-section">
              <label className="form-label">
                Hình thức tổ chức
                <div className="online-offline-toggle">
                  <button
                    type="button"
                    className={`toggle-option ${!formData.isOnline ? 'active' : ''}`}
                    onClick={() => handleOnlineToggle(false)}
                  >
                    <span className="option-icon">📍</span>
                    <span className="option-text">Trực tiếp</span>
                  </button>
                  <button
                    type="button"
                    className={`toggle-option ${formData.isOnline ? 'active' : ''}`}
                    onClick={() => handleOnlineToggle(true)}
                  >
                    <span className="option-icon">💻</span>
                    <span className="option-text">Trực tuyến</span>
                  </button>
                </div>
              </label>
            </div>

            {/* Location for offline events */}
            {!formData.isOnline && (
              <div className="form-section">
                <label className="form-label">
                  Địa điểm *
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Nhập địa điểm tổ chức"
                    required={!formData.isOnline}
                  />
                </label>
              </div>
            )}

            {/* Online meeting platform and link */}
            {formData.isOnline && (
              <div className="form-section online-meeting-section">
                <label className="form-label">
                  Nền tảng họp trực tuyến
                  <div className="platform-selector platform-selector-grid">
                    <button
                      type="button"
                      className={`platform-option ${formData.platform === 'system' ? 'active featured' : ''}`}
                      onClick={() => handlePlatformChange('system')}
                    >
                      <span className="platform-icon">🏢</span>
                      <span>Hệ thống nội bộ</span>
                      <span className="platform-badge">Khuyến nghị</span>
                    </button>
                    <button
                      type="button"
                      className={`platform-option ${formData.platform === 'zoom' ? 'active' : ''}`}
                      onClick={() => handlePlatformChange('zoom')}
                    >
                      <span className="platform-icon">🔷</span>
                      <span>Zoom</span>
                    </button>
                    <button
                      type="button"
                      className={`platform-option ${formData.platform === 'meet' ? 'active' : ''}`}
                      onClick={() => handlePlatformChange('meet')}
                    >
                      <span className="platform-icon">🎥</span>
                      <span>Google Meet</span>
                    </button>
                    <button
                      type="button"
                      className={`platform-option ${formData.platform === 'teams' ? 'active' : ''}`}
                      onClick={() => handlePlatformChange('teams')}
                    >
                      <span className="platform-icon">👔</span>
                      <span>MS Teams</span>
                    </button>
                    <button
                      type="button"
                      className={`platform-option ${formData.platform === 'custom' ? 'active' : ''}`}
                      onClick={() => handlePlatformChange('custom')}
                    >
                      <span className="platform-icon">🔗</span>
                      <span>Tùy chỉnh</span>
                    </button>
                  </div>
                </label>

                {/* System Meeting - Special UI */}
                {formData.platform === 'system' && (
                  <div className="system-meeting-container">
                    <div className="system-meeting-banner">
                      <div className="banner-icon">🎯</div>
                      <div className="banner-content">
                        <h4>Meeting trên hệ thống nội bộ</h4>
                        <p>Cuộc gọi sẽ được tạo tự động với thông tin sự kiện</p>
                      </div>
                    </div>

                    {/* Call Type Selection */}
                    <div className="call-type-selection">
                      <label className="form-label">Loại cuộc gọi</label>
                      <div className="call-type-buttons">
                        <button
                          type="button"
                          className={`call-type-btn ${callType === 'video' ? 'active' : ''}`}
                          onClick={() => setCallType('video')}
                        >
                          <span className="call-type-icon">📹</span>
                          <span>Video</span>
                        </button>
                        <button
                          type="button"
                          className={`call-type-btn ${callType === 'voice' ? 'active' : ''}`}
                          onClick={() => setCallType('voice')}
                        >
                          <span className="call-type-icon">🔊</span>
                          <span>Thoại</span>
                        </button>
                      </div>
                    </div>

                    {/* Meeting Link Display */}
                    {formData.meetingLink && (
                      <div className="system-link-display">
                        <label className="form-label">Link cuộc gọi</label>
                        <div className="meeting-link-container">
                          <input
                            type="text"
                            value={formData.meetingLink}
                            readOnly
                            className="form-input meeting-link-input"
                          />
                          <button
                            type="button"
                            className="btn-copy-link"
                            onClick={handleCopyLink}
                            title="Sao chép link"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Quick Info */}
                    <div className="system-call-info">
                      <div className="call-info-item">
                        <span className="call-info-label">Loại cuộc gọi:</span>
                        <span className="call-info-value">
                          {callType === 'voice' ? '🔊 Cuộc gọi thoại' : '📹 Cuộc gọi video'}
                        </span>
                      </div>
                      <div className="call-info-item">
                        <span className="call-info-label">Thời gian:</span>
                        <span className="call-info-value">
                          ⏰ {formData.startTime ? new Date(formData.startTime).toLocaleString('vi-VN') : 'Chưa chọn'}
                        </span>
                      </div>
                      <div className="call-info-item">
                        <span className="call-info-label">Người tham gia:</span>
                        <span className="call-info-value">
                          👥 {formData.participants.length} người
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other platforms - Regular link */}
                {formData.platform !== 'system' && (
                  <label className="form-label">
                    Link cuộc họp
                    <div className="meeting-link-container">
                      <input
                        type="text"
                        name="meetingLink"
                        value={formData.meetingLink}
                        onChange={handleInputChange}
                        className="form-input meeting-link-input"
                        placeholder="Link sẽ được tạo tự động"
                        readOnly={formData.platform !== 'custom'}
                      />
                      <button
                        type="button"
                        className="btn-copy-link"
                        onClick={handleCopyLink}
                        disabled={!formData.meetingLink}
                        title="Sao chép link"
                      >
                        📋
                      </button>
                    </div>
                  </label>
                )}

                {showCopyNotification && (
                  <div className="copy-notification">
                    ✅ Đã sao chép link vào clipboard!
                  </div>
                )}

                {formData.meetingLink && formData.platform !== 'system' && (
                  <div className="share-options">
                    <span className="share-label">Chia sẻ link:</span>
                    <button
                      type="button"
                      className="btn-share"
                      onClick={() => handleShareLink('email')}
                      title="Chia sẻ qua Email"
                    >
                      📧 Email
                    </button>
                    <button
                      type="button"
                      className="btn-share"
                      onClick={() => handleShareLink('copy')}
                      title="Sao chép link"
                    >
                      📋 Sao chép
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="form-section">
              <label className="form-label">
                Mô tả
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Nhập mô tả chi tiết..."
                  rows="3"
                />
              </label>
            </div>

            <div className="form-section">
              <div className="form-label-with-button">
                <label className="form-label">Người tham gia</label>
                <button
                  type="button"
                  className="btn-add-test"
                  onClick={addTestParticipants}
                  title="Thêm người dùng test"
                >
                  + Thêm người test
                </button>
              </div>
              <div className="participants-container">
                <div className="search-box">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm người tham gia..."
                    className="search-input"
                  />
                  {searchQuery && (
                    <div className="search-results">
                      {filteredParticipants.map(participant => (
                        <div
                          key={participant.id}
                          className="search-result-item"
                          onClick={() => handleAddParticipant(participant)}
                        >
                          <div className="participant-avatar-small">
                            {participant.name.charAt(0)}
                          </div>
                          <div className="participant-info">
                            <div className="participant-name">{participant.name}</div>
                            <div className="participant-email">{participant.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="selected-participants">
                  {formData.participants.map(participant => (
                    <div key={participant.id} className="selected-participant">
                      <div className="participant-avatar-small">
                        {participant.name.charAt(0)}
                      </div>
                      <div className="participant-info">
                        <div className="participant-name">{participant.name}</div>
                        <div className="participant-role">{participant.role}</div>
                      </div>
                      <button
                        type="button"
                        className="remove-participant"
                        onClick={() => handleRemoveParticipant(participant.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-section">
              <label className="form-label">
                Trạng thái
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="scheduled">Đã lên lịch</option>
                  <option value="in_progress">Đang diễn ra</option>
                  <option value="completed">Đã hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            {event && (
              <button
                type="button"
                className="btn-danger"
                onClick={onDelete}
                disabled={loading}
              >
                Xóa
              </button>
            )}
            
            <div className="action-buttons">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : (event ? 'Cập nhật' : 'Tạo sự kiện')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingModal;