// src/components/common/UpcomingTasksWidget.jsx
import React, { useState, useEffect } from 'react';
import {
  FiChevronUp, FiChevronDown, FiCalendar, FiClock,
  FiMapPin, FiPhone, FiVideo, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import './UpcomingTasksWidget.css';

const UpcomingTasksWidget = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Mock upcoming tasks/events data
  const upcomingTasks = [
    {
      id: 1,
      title: 'Họp báo cáo tuần',
      type: 'meeting',
      time: new Date(new Date().setHours(10, 0, 0, 0)),
      duration: 60,
      location: 'Phòng họp 301',
      priority: 'high',
      attendees: ['Nguyễn Văn A', 'Trần Thị B']
    },
    {
      id: 2,
      title: 'Gọi khách hàng ABC',
      type: 'call',
      time: new Date(new Date().setHours(14, 30, 0, 0)),
      duration: 30,
      location: 'Online - Zoom',
      priority: 'medium',
      contact: 'Công ty ABC'
    },
    {
      id: 3,
      title: 'Hoàn thành báo cáo Q1',
      type: 'task',
      time: new Date(new Date().setHours(16, 0, 0, 0)),
      duration: 120,
      priority: 'high',
      deadline: true
    },
    {
      id: 4,
      title: 'Demo sản phẩm cho khách',
      type: 'demo',
      time: new Date(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).setHours(9, 0, 0, 0)),
      duration: 45,
      location: 'Online - Google Meet',
      priority: 'high',
      contact: 'Nhà cung cấp XYZ'
    }
  ];

  // Filter tasks that are upcoming (not past)
  const filteredTasks = upcomingTasks.filter(task => task.time > currentTime);

  // Sort by time
  const sortedTasks = filteredTasks.sort((a, b) => a.time - b.time);

  // Get icon based on task type
  const getTaskIcon = (type) => {
    const icons = {
      meeting: <FiCalendar />,
      call: <FiPhone />,
      task: <FiCheckCircle />,
      demo: <FiVideo />
    };
    return icons[type] || <FiCalendar />;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    };
    return colors[priority] || '#64748b';
  };

  // Format time
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Format date
  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Ngày mai';
    } else {
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    }
  };

  // Get time until task
  const getTimeUntil = (taskTime) => {
    const diff = taskTime - currentTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} ngày nữa`;
    } else if (hours > 0) {
      return `${hours} giờ ${minutes} phút nữa`;
    } else if (minutes > 0) {
      return `${minutes} phút nữa`;
    } else {
      return 'Sắp diễn ra';
    }
  };

  return (
    <div className={`upcoming-tasks-widget ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Widget Header */}
      <div className="widget-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="widget-title">
          <div className="title-icon">
            <FiClock />
          </div>
          <div className="title-text">
            <h3>Công việc sắp tới</h3>
            <span className="task-count">{sortedTasks.length} việc</span>
          </div>
        </div>
        <button className="btn-toggle">
          {isExpanded ? <FiChevronDown /> : <FiChevronUp />}
        </button>
      </div>

      {/* Widget Body */}
      {isExpanded && (
        <div className="widget-body">
          {sortedTasks.length === 0 ? (
            <div className="no-tasks">
              <div className="no-tasks-icon">
                <FiCheckCircle />
              </div>
              <p>Không có công việc sắp tới</p>
              <span>Bạn đã hoàn thành hết công việc hôm nay!</span>
            </div>
          ) : (
            <div className="tasks-list">
              {sortedTasks.slice(0, 5).map((task, index) => (
                <div
                  key={task.id}
                  className={`task-item ${task.priority}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="task-indicator" style={{ backgroundColor: getPriorityColor(task.priority) }}></div>

                  <div className="task-content">
                    <div className="task-header">
                      <div className="task-icon">{getTaskIcon(task.type)}</div>
                      <div className="task-info">
                        <h4 className="task-title">{task.title}</h4>
                        <div className="task-meta">
                          <span className="task-date">
                            <FiCalendar size={12} />
                            {formatDate(task.time)}
                          </span>
                          <span className="task-time">
                            <FiClock size={12} />
                            {formatTime(task.time)}
                          </span>
                          {task.location && (
                            <span className="task-location">
                              <FiMapPin size={12} />
                              {task.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="task-footer">
                      <div className="time-until">
                        {task.deadline && (
                          <FiAlertCircle className="deadline-icon" />
                        )}
                        {getTimeUntil(task.time)}
                      </div>
                      {task.contact && (
                        <div className="task-contact">{task.contact}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {sortedTasks.length > 5 && (
            <div className="widget-footer">
              <button className="btn-view-all">
                Xem tất cả {sortedTasks.length} công việc
              </button>
            </div>
          )}
        </div>
      )}

      {/* Collapsed Preview */}
      {!isExpanded && sortedTasks.length > 0 && (
        <div className="collapsed-preview">
          <div className="preview-badge">{sortedTasks.length}</div>
          <div className="preview-next">
            <span className="preview-title">{sortedTasks[0].title}</span>
            <span className="preview-time">{formatTime(sortedTasks[0].time)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingTasksWidget;
