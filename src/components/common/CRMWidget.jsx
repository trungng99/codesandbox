import React from 'react';
import { FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

const CRMWidget = ({ type = 'opportunities' }) => {
  const widgets = {
    opportunities: {
      title: 'Cơ hội kinh doanh',
      icon: <FiTrendingUp />,
      data: [
        { name: 'Mới', value: 12, color: 'blue' },
        { name: 'Đang thương lượng', value: 8, color: 'yellow' },
        { name: 'Thành công', value: 5, color: 'green' },
      ]
    },
    tickets: {
      title: 'Ticket hỗ trợ',
      icon: <FiAlertCircle />,
      data: [
        { name: 'Mở', value: 7, color: 'red' },
        { name: 'Đang xử lý', value: 4, color: 'orange' },
        { name: 'Đã đóng', value: 15, color: 'green' },
      ]
    }
  };

  const widget = widgets[type];

  return (
    <div className="crm-widget">
      <div className="widget-header">
        <div className="widget-icon">{widget.icon}</div>
        <h3>{widget.title}</h3>
      </div>
      <div className="widget-content">
        {widget.data.map((item, index) => (
          <div key={index} className="widget-item">
            <div className="widget-item-header">
              <span className="item-name">{item.name}</span>
              <span className="item-value">{item.value}</span>
            </div>
            <div className="progress-bar">
              <div 
                className={`progress-fill ${item.color}`}
                style={{ width: `${(item.value / 30) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="widget-footer">
        <button className="view-all-btn">Xem tất cả</button>
      </div>
    </div>
  );
};

export default CRMWidget;