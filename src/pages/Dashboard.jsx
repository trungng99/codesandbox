import React from 'react';
import UpcomingTasksWidget from '../components/common/UpcomingTasksWidget';

const Dashboard = () => {
  return (
    <div className="dashboard" style={{ padding: '20px' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '20px' }}>Dashboard</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        {[
          { label: 'Tin nhắn hôm nay', value: '124', color: '#3b82f6' },
          { label: 'Khách hàng online', value: '24', color: '#10b981' },
          { label: 'Cuộc gọi hôm nay', value: '18', color: '#8b5cf6' },
          { label: 'Meeting sắp tới', value: '7', color: '#f59e0b' },
        ].map((stat, index) => (
          <div key={index} style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              background: stat.color + '20',
              color: stat.color,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px'
            }}>
              {stat.value}
            </div>
            <h3 style={{ fontSize: '24px', marginBottom: '5px' }}>{stat.value}</h3>
            <p style={{ color: '#64748b' }}>{stat.label}</p>
          </div>
        ))}
      </div>
      
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Hoạt động gần đây</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>Chat với Nguyễn Văn A - 10:30 AM</li>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>Cuộc gọi với Công ty ABC - 09:15 AM</li>
          <li style={{ padding: '10px 0' }}>Meeting Sales - 2:00 PM</li>
        </ul>
      </div>

      {/* Upcoming Tasks Widget */}
      <UpcomingTasksWidget />
    </div>
  );
};

export default Dashboard;