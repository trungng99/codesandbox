import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mock login
    const mockUser = {
      id: '1',
      name: 'Nguyễn Văn A',
      email: email,
      role: 'sales',
      department: 'Sales'
    };
    
    const mockToken = 'mock-jwt-token-123';
    
    login(mockUser, mockToken);
    navigate('/');
  };

  return (
    <div className="login-page" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      <div className="login-container" style={{
        background: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '400px'
      }}>
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#2563eb', marginBottom: '10px' }}>CRM Chat System</h1>
          <p style={{ color: '#64748b' }}>Đăng nhập để tiếp tục</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#374151' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#374151' }}>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '12px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Đăng nhập
          </button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
          <p>Email test: test@crm.com | Mật khẩu: bất kỳ</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;