import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import './Calendar.css';

const CalendarSidebar = ({
  eventTypes,
  selectedTypes,
  onTypeFilterChange,
  onQuickCreate,
  eventsCount,
  selectedDay,
  dayEventsCount = 0,
  dayWorkHours = '0'
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const typeConfigs = {
    meeting: { label: 'Cuộc họp', color: '#2196f3', icon: '👥' },
    call: { label: 'Cuộc gọi', color: '#9c27b0', icon: '📞' },
    task: { label: 'Công việc', color: '#4caf50', icon: '✓' },
    appointment: { label: 'Hẹn gặp', color: '#ff9800', icon: '📅' }
  };

  // Chỉ có 4 lựa chọn đơn giản
  const filterOptions = [
    { 
      id: 'all', 
      label: 'Tất cả sự kiện', 
      types: ['meeting', 'call', 'task', 'appointment'],
      description: 'Hiển thị mọi loại sự kiện'
    },
    { 
      id: 'meeting', 
      label: 'Chỉ cuộc họp', 
      types: ['meeting'],
      description: 'Chỉ hiển thị cuộc họp'
    },
    { 
      id: 'call', 
      label: 'Chỉ cuộc gọi', 
      types: ['call'],
      description: 'Chỉ hiển thị cuộc gọi'
    },
    { 
      id: 'task', 
      label: 'Chỉ công việc', 
      types: ['task'],
      description: 'Chỉ hiển thị công việc'
    }
  ];

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isFilterOpen]);

  // Tìm option đang được chọn
  const getSelectedOption = () => {
    const selectedStr = selectedTypes?.sort().join(',') || '';
    return filterOptions.find(option => {
      const optionStr = option.types.sort().join(',');
      return optionStr === selectedStr;
    }) || filterOptions[0];
  };

  const selectedOption = getSelectedOption();

  const handleFilterSelect = (option) => {
    console.log('Filter selected:', option.label);
    onTypeFilterChange(option.types);
    setIsFilterOpen(false);
  };

  const quickActions = [
    { label: 'Họp nội bộ', duration: 30, type: 'meeting', icon: '👥' },
    { label: 'Gọi khách hàng', duration: 15, type: 'call', icon: '📞' },
    { label: 'Theo dõi task', duration: 60, type: 'task', icon: '✓' },
    { label: 'Hẹn gặp đối tác', duration: 45, type: 'appointment', icon: '🤝' }
  ];

  // Lấy sự kiện sắp tới
  const getUpcomingEvents = () => {
    return [
      {
        time: '10:00',
        title: 'Họp báo cáo tuần',
        type: 'meeting',
        location: 'Phòng 301',
        duration: '1h30'
      },
      {
        time: '14:30',
        title: 'Gọi khách hàng ABC',
        type: 'call',
        location: 'Zoom',
        duration: '1h'
      },
      {
        time: '16:00',
        title: 'Review code',
        type: 'task',
        location: 'Slack',
        duration: '45m'
      }
    ];
  };

  const upcomingEvents = getUpcomingEvents();

  // Tính thống kê tuần
  const getWeekStats = () => {
    return Math.floor(eventsCount * 0.3) + 5;
  };

  const weekEventsCount = getWeekStats();

  return (
    <div className="calendar-sidebar">
      {/* Phần thông tin ngày đã chọn */}
      {selectedDay && (
        <div className="sidebar-section selected-day-info">
          <div className="day-info-header">
            <h3>📌 Đang xem</h3>
            <div className="day-badge">Hôm nay</div>
          </div>
          <div className="day-date">
            {format(selectedDay, 'EEEE, dd/MM/yyyy', { locale: vi })}
          </div>
          <div className="day-stats-grid">
            <div className="day-stat-item">
              <div className="day-stat-icon">📋</div>
              <div className="day-stat-content">
                <div className="day-stat-value">{dayEventsCount}</div>
                <div className="day-stat-label">Sự kiện</div>
              </div>
            </div>
            <div className="day-stat-item">
              <div className="day-stat-icon">⏱️</div>
              <div className="day-stat-content">
                <div className="day-stat-value">{dayWorkHours}h</div>
                <div className="day-stat-label">Giờ làm</div>
              </div>
            </div>
            <div className="day-stat-item">
              <div className="day-stat-icon">🎯</div>
              <div className="day-stat-content">
                <div className="day-stat-value">
                  {dayEventsCount > 0 ? Math.floor(dayEventsCount / 2) : 0}
                </div>
                <div className="day-stat-label">Hoàn thành</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phần Filter Dropdown - ĐÃ SỬA */}
      <div className="sidebar-section filter-section">
        <div className="section-header">
          <h3>🎯 Lọc sự kiện</h3>
        </div>

        {/* Dropdown đã fix */}
        <div className="simple-dropdown" ref={dropdownRef}>
          <button 
            className="dropdown-trigger"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Dropdown toggle clicked, current state:', isFilterOpen);
              setIsFilterOpen(!isFilterOpen);
            }}
          >
            <div className="trigger-content">
              <span className="trigger-label">{selectedOption.label}</span>
              <span className={`dropdown-icon ${isFilterOpen ? 'open' : ''}`}>
                ▼
              </span>
            </div>
          </button>
          
          {isFilterOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-list">
                {filterOptions.map((option) => {
                  const isSelected = selectedOption.id === option.id;
                  return (
                    <div
                      key={option.id}
                      className={`dropdown-item ${isSelected ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterSelect(option);
                      }}
                    >
                      <div className="item-content">
                        <span className="item-label">{option.label}</span>
                        <span className="item-description">{option.description}</span>
                      </div>
                      {isSelected && (
                        <span className="check-icon">✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Hiển thị mô tả filter đang chọn */}
        <div className="filter-description">
          <small>{selectedOption.description}</small>
        </div>
      </div>

      {/* Phần tạo nhanh */}
      <div className="sidebar-section">
        <div className="section-header">
          <h3>⚡ Tạo nhanh</h3>
          <span className="section-hint">Click để tạo</span>
        </div>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="quick-action-card"
              onClick={() => onQuickCreate(action)}
              style={{ borderLeftColor: typeConfigs[action.type]?.color || '#757575' }}
            >
              <div className="action-card-header">
                <span className="action-icon">{action.icon}</span>
                <span className="action-duration">{action.duration}'</span>
              </div>
              <div className="action-card-body">
                <div className="action-label">{action.label}</div>
                <div className="action-type" style={{ color: typeConfigs[action.type]?.color }}>
                  {typeConfigs[action.type]?.label}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Phần thống kê */}
      <div className="sidebar-section">
        <h3>📊 Thống kê</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-icon">📅</div>
            <div className="stat-card-content">
              <div className="stat-card-value">{eventsCount}</div>
              <div className="stat-card-label">Tổng sự kiện</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">☀️</div>
            <div className="stat-card-content">
              <div className="stat-card-value">{dayEventsCount}</div>
              <div className="stat-card-label">Hôm nay</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">📆</div>
            <div className="stat-card-content">
              <div className="stat-card-value">{weekEventsCount}</div>
              <div className="stat-card-label">Tuần này</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">⏳</div>
            <div className="stat-card-content">
              <div className="stat-card-value">
                {eventsCount > 0 ? Math.floor(eventsCount * 0.3) : 0}
              </div>
              <div className="stat-card-label">Đang chờ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Phần sự kiện sắp tới */}
      <div className="sidebar-section">
        <div className="section-header">
          <h3>🔔 Sắp tới</h3>
          <span className="upcoming-count">{upcomingEvents.length} sự kiện</span>
        </div>
        <div className="upcoming-events">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="upcoming-event-card">
              <div className="event-time-badge">
                <span className="event-time">{event.time}</span>
                <span className="event-duration">{event.duration}</span>
              </div>
              <div className="event-details">
                <div className="event-title">{event.title}</div>
                <div className="event-meta">
                  <span className="event-type" style={{ color: typeConfigs[event.type]?.color }}>
                    {typeConfigs[event.type]?.label}
                  </span>
                  <span className="event-location">• {event.location}</span>
                </div>
              </div>
              <div className="event-reminder">
                <div className="reminder-dot"></div>
              </div>
            </div>
          ))}
        </div>
        <button className="view-all-events-btn">
          Xem tất cả sự kiện →
        </button>
      </div>
    </div>
  );
};

export default CalendarSidebar;