import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ 
    id: '1', 
    name: 'Nguyễn Văn A', 
    email: 'test@crm.com', 
    role: 'sales',
    department: 'Sales'
  });
  
  const [token, setToken] = useState('mock-jwt-token-123');

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // Trong thực tế sẽ redirect đến login
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);