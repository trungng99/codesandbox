import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { path: '/', icon: '🏠', label: 'Dashboard' },
    { path: '/chat', icon: '💬', label: 'Chat' },
    { path: '/calendar', icon: '📅', label: 'Lịch' }, // <-- THÊM CALENDAR
    { path: '/contacts', icon: '👥', label: 'Danh bạ' },
    { path: '/calls', icon: '📞', label: 'Cuộc gọi' },
    { path: '/tasks', icon: '✅', label: 'Công việc' },
    { path: '/reports', icon: '📊', label: 'Báo cáo' },
    { path: '/admin', icon: '⚙️', label: 'Quản trị' },
  ];

  // Badge thông báo cho calendar (số meeting sắp tới)
  const calendarBadge = 3; // Số meeting sắp tới, có thể fetch từ API

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">CRM Chat System</h3>
        <div className="sidebar-subtitle">v1.0.0</div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                
                {/* Badge cho Calendar */}
                {item.path === '/calendar' && calendarBadge > 0 && (
                  <span className="nav-badge">{calendarBadge}</span>
                )}
                
                {/* Badge cho Chat (unread messages) */}
                {item.path === '/chat' && (
                  <span className="nav-badge unread">5</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;