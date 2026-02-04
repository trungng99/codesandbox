import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo">
          <h2>CRM Chat System</h2>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Tìm kiếm..." />
        </div>
      </div>
      
      <div className="header-right">
        <div className="user-profile">
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Người dùng'}</span>
            <span className="user-role">{user?.role || 'Nhân viên'}</span>
          </div>
          <button onClick={() => logout()} className="logout-button">
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;