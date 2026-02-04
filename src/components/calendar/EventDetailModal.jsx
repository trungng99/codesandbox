import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const EventDetailModal = ({ event, onClose, onEdit, onDelete }) => {
  const formatDateTime = (date) => {
    if (!date) return '';
    return format(date, 'HH:mm dd/MM/yyyy', { locale: vi });
  };

  const getTypeLabel = (type) => {
    const labels = {
      meeting: 'Cuộc họp',
      call: 'Cuộc gọi',
      task: 'Công việc',
      appointment: 'Hẹn gặp'
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status) => {
    const labels = {
      scheduled: 'Đã lên lịch',
      in_progress: 'Đang diễn ra',
      completed: 'Đã hoàn thành',
      cancelled: 'Đã hủy'
    };
    return labels[status] || status;
  };

  return (
    <div className="modal-overlay">
      <div className="event-detail-modal">
        <div className="modal-header">
          <div className="event-type-badge" style={{ 
            backgroundColor: event.backgroundColor,
            borderColor: event.borderColor
          }}>
            {getTypeLabel(event.type)}
          </div>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <h2 className="event-title">{event.title}</h2>
          
          {event.description && (
            <div className="event-section">
              <h4>Mô tả</h4>
              <p>{event.description}</p>
            </div>
          )}

          <div className="event-section">
            <h4>Thời gian</h4>
            <div className="time-info">
              <div className="time-item">
                <span className="time-label">Bắt đầu:</span>
                <span className="time-value">{formatDateTime(event.start)}</span>
              </div>
              <div className="time-item">
                <span className="time-label">Kết thúc:</span>
                <span className="time-value">{formatDateTime(event.end)}</span>
              </div>
              <div className="time-item">
                <span className="time-label">Trạng thái:</span>
                <span className={`status-badge ${event.status}`}>
                  {getStatusLabel(event.status)}
                </span>
              </div>
            </div>
          </div>

          {event.location && (
            <div className="event-section">
              <h4>Địa điểm</h4>
              <p>{event.location}</p>
            </div>
          )}

          {event.participants && event.participants.length > 0 && (
            <div className="event-section">
              <h4>Người tham gia ({event.participants.length})</h4>
              <div className="participants-list">
                {event.participants.map((participant, index) => (
                  <div key={index} className="participant-item">
                    <div className="participant-avatar">
                      {participant.name?.charAt(0) || 'U'}
                    </div>
                    <div className="participant-info">
                      <div className="participant-name">{participant.name || 'Chưa có tên'}</div>
                      <div className="participant-role">{participant.role || 'Thành viên'}</div>
                    </div>
                    <div className={`participant-status ${participant.status || 'pending'}`}>
                      {participant.status === 'accepted' ? '✓' : 
                       participant.status === 'declined' ? '✗' : '?'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="event-section">
            <h4>Thông tin khác</h4>
            <div className="event-meta">
              <div className="meta-item">
                <span className="meta-label">Tạo bởi:</span>
                <span className="meta-value">{event.createdBy?.name || 'Không rõ'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Loại:</span>
                <span className="meta-value">{getTypeLabel(event.type)}</span>
              </div>
              {event.isAllDay && (
                <div className="meta-item">
                  <span className="meta-label">Cả ngày:</span>
                  <span className="meta-value">Có</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Đóng
          </button>
          <div className="action-buttons">
            <button className="btn-danger" onClick={onDelete}>
              Xóa
            </button>
            <button className="btn-primary" onClick={onEdit}>
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;