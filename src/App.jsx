// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import ContactsPage from './pages/ContactsPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/common/PrivateRoute';
import CalendarPage from './pages/CalendarPage';
import './index.css';
import './styles/main.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/*" element={
            <PrivateRoute>
              <MainLayout>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="chat" element={<ChatPage />} />
                  <Route path="contacts" element={<ContactsPage />} />
                  <Route path="calendar" element={<CalendarPage />} />
                  <Route path="admin" element={<AdminPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;