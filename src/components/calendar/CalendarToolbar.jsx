import React from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  isToday,
  isSameMonth,
  startOfMonth,
  endOfMonth
} from 'date-fns';
import { vi } from 'date-fns/locale';

const CalendarToolbar = ({
  currentView,
  onViewChange,
  selectedDate,
  onDateChange,
  onToday,
  onCreateEvent,
  onRefresh,
  onBackToMonth,
  selectedDay
}) => {

  const handlePrev = () => {
    const dateMap = {
      'month': () => onDateChange(subMonths(selectedDate, 1)),
      'week': () => onDateChange(subWeeks(selectedDate, 1)),
      'day': () => onDateChange(subDays(selectedDate, 1))
    };
    dateMap[currentView]?.();
  };

  const handleNext = () => {
    const dateMap = {
      'month': () => onDateChange(addMonths(selectedDate, 1)),
      'week': () => onDateChange(addWeeks(selectedDate, 1)),
      'day': () => onDateChange(addDays(selectedDate, 1))
    };
    dateMap[currentView]?.();
  };

  const getDateRangeText = () => {
    switch (currentView) {
      case 'month':
        return format(selectedDate, 'MMMM yyyy', { locale: vi });
      case 'week':
        const weekStart = startOfWeek(selectedDate, { locale: vi });
        const weekEnd = endOfWeek(selectedDate, { locale: vi });
        return `${format(weekStart, 'dd/MM')} - ${format(weekEnd, 'dd/MM/yyyy')}`;
      case 'day':
        const dayName = format(selectedDate, 'EEEE', { locale: vi });
        const dayNumber = format(selectedDate, 'dd');
        const monthYear = format(selectedDate, 'MM/yyyy');
        return (
          <div className="day-view-title">
            <span className="day-name">{dayName}</span>
            <span className="day-date">
              <span className="day-number">{dayNumber}</span>
              <span className="day-month-year">/{monthYear}</span>
            </span>
          </div>
        );
      default:
        return format(selectedDate, 'MMMM yyyy', { locale: vi });
    }
  };

  // Get month navigation info
  const getMonthInfo = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const today = new Date();
    
    return {
      isCurrentMonth: isSameMonth(selectedDate, today),
      monthProgress: calculateMonthProgress(selectedDate),
      daysInMonth: monthEnd.getDate(),
      currentDay: today.getDate()
    };
  };

  const calculateMonthProgress = (date) => {
    const today = new Date();
    if (!isSameMonth(date, today)) return null;
    
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const totalDays = monthEnd.getDate();
    const daysPassed = today.getDate();
    
    return Math.round((daysPassed / totalDays) * 100);
  };

  // Get view statistics
  const getViewStats = () => {
    switch (currentView) {
      case 'month':
        const monthInfo = getMonthInfo();
        return monthInfo.isCurrentMonth ? (
          <div className="view-stats">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${monthInfo.monthProgress}%` }}
              />
            </div>
            <span className="progress-text">{monthInfo.monthProgress}% đã qua</span>
          </div>
        ) : null;
      
      case 'week':
        const weekStart = startOfWeek(selectedDate);
        const weekEnd = endOfWeek(selectedDate);
        const today = new Date();
        const isCurrentWeek = today >= weekStart && today <= weekEnd;
        
        if (isCurrentWeek) {
          const dayOfWeek = today.getDay();
          const weekProgress = Math.round((dayOfWeek / 7) * 100);
          return (
            <div className="view-stats">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${weekProgress}%` }}
                />
              </div>
              <span className="progress-text">Tuần hiện tại</span>
            </div>
          );
        }
        return null;
      
      case 'day':
        const isCurrentDay = isToday(selectedDate);
        if (isCurrentDay) {
          const hour = new Date().getHours();
          const dayProgress = Math.round((hour / 24) * 100);
          return (
            <div className="view-stats">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${dayProgress}%` }}
                />
              </div>
              <span className="progress-text">{dayProgress}% đã qua</span>
            </div>
          );
        }
        return (
          <div className="view-stats">
            <span className="day-status">
              {selectedDate < new Date() ? 'Đã qua' : 'Sắp tới'}
            </span>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="calendar-toolbar">
      {/* Left Section - Actions */}
      <div className="toolbar-left">
        {selectedDay ? (
          <>
            <button className="btn-back" onClick={onBackToMonth}>
              <i className="icon-calendar">📅</i>
              Lịch tháng
            </button>
          </>
        ) : (
          <>
            <button className="btn-create-event" onClick={onCreateEvent}>
              <i className="icon-add">+</i> Tạo sự kiện
            </button>

            <div className="view-toggle">
              <button
                className={`btn-toggle ${currentView === 'month' ? 'active' : ''}`}
                onClick={() => onViewChange('month')}
                title="Xem tháng"
              >
                <i className="view-icon">📅</i>
                <span className="view-label">Tháng</span>
              </button>
              <button
                className={`btn-toggle ${currentView === 'week' ? 'active' : ''}`}
                onClick={() => onViewChange('week')}
                title="Xem tuần"
              >
                <i className="view-icon">📆</i>
                <span className="view-label">Tuần</span>
              </button>
              <button
                className={`btn-toggle ${currentView === 'day' ? 'active' : ''}`}
                onClick={() => onViewChange('day')}
                title="Xem ngày"
              >
                <i className="view-icon">☀️</i>
                <span className="view-label">Ngày</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Center Section - Navigation & Info */}
      <div className="toolbar-center">
        <div className="navigation-section">
          <div className="navigation-buttons">
            <button 
              className="btn-nav prev" 
              onClick={handlePrev}
              title="Xem trước"
            >
              <i className="icon-chevron-left">‹</i>
            </button>
            
            <div className="current-date-display">
              <div className="date-text">{getDateRangeText()}</div>
              {getViewStats()}
            </div>
            
            <button 
              className="btn-nav next" 
              onClick={handleNext}
              title="Xem tiếp"
            >
              <i className="icon-chevron-right">›</i>
            </button>
          </div>

          {!selectedDay && currentView === 'month' && (
            <div className="month-quick-nav">
              <button 
                className="btn-quick-nav"
                onClick={() => onDateChange(subMonths(new Date(), 1))}
              >
                Tháng trước
              </button>
              <button 
                className="btn-quick-nav current"
                onClick={() => onDateChange(new Date())}
              >
                Tháng này
              </button>
              <button 
                className="btn-quick-nav"
                onClick={() => onDateChange(addMonths(new Date(), 1))}
              >
                Tháng sau
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Utilities */}
      <div className="toolbar-right">
        <div className="utility-buttons">
          <button 
            className={`btn-today ${isToday(selectedDate) ? 'active' : ''}`}
            onClick={onToday}
            title="Chuyển đến hôm nay"
          >
            <i className="icon-today">☀️</i>
            <span className="btn-label">Hôm nay</span>
          </button>
          
          <div className="separator"></div>
          
          <button 
            className="btn-utility" 
            onClick={onRefresh}
            title="Làm mới dữ liệu"
          >
            <i className="icon-refresh">↻</i>
          </button>
          
          <button 
            className="btn-utility"
            onClick={() => window.print()}
            title="In lịch"
          >
            <i className="icon-print">🖨️</i>
          </button>
          
          <button 
            className="btn-utility"
            title="Cài đặt hiển thị"
          >
            <i className="icon-settings">⚙️</i>
          </button>
        </div>
        
        {selectedDay && (
          <div className="day-quick-actions">
            <button 
              className="btn-quick-action"
              onClick={() => onCreateEvent()}
            >
              <i className="icon-add-event">+</i>
              Thêm sự kiện
            </button>
            <button 
              className="btn-quick-action"
              onClick={() => onDateChange(subDays(selectedDay, 1))}
            >
              <i className="icon-prev-day">◀</i>
              Ngày trước
            </button>
            <button 
              className="btn-quick-action"
              onClick={() => onDateChange(addDays(selectedDay, 1))}
            >
              Ngày sau
              <i className="icon-next-day">▶</i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarToolbar;