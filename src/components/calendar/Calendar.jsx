// src/components/calendar/Calendar.jsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';
import { format, startOfDay, endOfDay, isToday, isPast, isFuture, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import './Calendar.css';

const Calendar = ({
  events = [],
  view = 'month',
  date = new Date(),
  onEventSelect,
  onSlotSelect,
  onEventDrop,
  onEventResize,
  onDayClick,
  selectedDay
}) => {
  const calendarRef = useRef(null);
  const timelineRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [scrollPosition, setScrollPosition] = useState(0);

  // Handle FullCalendar event drop
  const handleEventDrop = (dropInfo) => {
    if (onEventDrop) {
      onEventDrop({
        event: {
          id: dropInfo.event.id,
          start: dropInfo.event.start,
          end: dropInfo.event.end
        }
      });
    }
  };

  // Handle FullCalendar event resize
  const handleEventResize = (resizeInfo) => {
    if (onEventResize) {
      onEventResize({
        event: {
          id: resizeInfo.event.id,
          end: resizeInfo.event.end
        }
      });
    }
  };

  // Handle timeline scroll
  const handleTimelineScroll = (e) => {
    setScrollPosition(e.target.scrollTop);
  };

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Auto-scroll to current time or 8 AM
  useEffect(() => {
    if (timelineRef.current && selectedDay) {
      const now = new Date();
      const isSelectedToday = isToday(selectedDay);

      if (isSelectedToday) {
        // Scroll to current time for today (160px per hour)
        const currentHour = now.getHours();
        const scrollTop = (currentHour * 160) + (now.getMinutes() * 2.67);
        timelineRef.current.scrollTop = scrollTop - 200; // Offset to see upcoming hours
      } else {
        // Scroll to 8 AM for other days
        timelineRef.current.scrollTop = 8 * 160; // 8 AM * 160px per hour
      }
    }
  }, [selectedDay]);

  // Update calendar view when props change
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      
      // Change view based on prop
      const viewMap = {
        'month': 'dayGridMonth',
        'week': 'timeGridWeek',
        'day': 'timeGridDay'
      };
      
      calendarApi.changeView(viewMap[view] || 'dayGridMonth');
      calendarApi.gotoDate(date);
    }
  }, [view, date]);

  // Generate all time slots (00:00 - 23:30, every 30 minutes)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date(selectedDay);
        time.setHours(hour, minute, 0, 0);
        slots.push({
          time,
          hour,
          minute,
          label: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          isCurrent: isSelectedToday && hour === currentTime.getHours() && 
                    Math.abs(minute - currentTime.getMinutes()) <= 15,
          isPast: isPast(time),
          isFuture: isFuture(time)
        });
      }
    }
    return slots;
  };

  const isSelectedToday = selectedDay ? isToday(selectedDay) : false;
  const timeSlots = selectedDay ? generateTimeSlots() : [];

  // Filter events for selected day
  const getDayEvents = useCallback(() => {
    if (!selectedDay) return [];
    
    const dayStart = startOfDay(selectedDay);
    const dayEnd = endOfDay(selectedDay);
    
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end || event.start);
      return eventStart <= dayEnd && eventEnd >= dayStart;
    });
  }, [selectedDay, events]);

  const dayEvents = getDayEvents();

  // Calculate total hours worked
  const calculateWorkHours = () => {
    const totalMinutes = dayEvents.reduce((total, event) => {
      const start = new Date(event.start);
      const end = new Date(event.end || start);
      return total + ((end - start) / (1000 * 60));
    }, 0);
    return (totalMinutes / 60).toFixed(1);
  };

  // Handle FullCalendar event click
  const handleFullCalendarEventClick = (clickInfo) => {
    if (onEventSelect) {
      onEventSelect({
        ...clickInfo.event.extendedProps,
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        start: clickInfo.event.start,
        end: clickInfo.event.end,
        allDay: clickInfo.event.allDay
      });
    }
  };

  // Handle FullCalendar date click
  const handleFullCalendarDateClick = (clickInfo) => {
    if (onDayClick) {
      onDayClick(clickInfo.date);
    } else if (onSlotSelect) {
      onSlotSelect({
        start: clickInfo.date,
        end: new Date(clickInfo.date.getTime() + 60 * 60 * 1000),
        allDay: clickInfo.allDay
      });
    }
  };

  // Handle FullCalendar day cell click
  const handleFullCalendarDayClick = (dayInfo) => {
    if (onDayClick) {
      onDayClick(dayInfo.date);
    }
  };

  // Handle back to calendar view
  const handleBackToCalendar = () => {
    if (onDayClick) {
      onDayClick(null);
    }
  };

  // Render day view with 24-hour timeline
  const renderDayView = () => {
    if (!selectedDay) return null;

    const dayStart = startOfDay(selectedDay);
    const dayEnd = endOfDay(selectedDay);
    
    // Group events by time
    const eventsByTime = {};
    dayEvents.forEach(event => {
      const eventStart = new Date(event.start);
      const hour = eventStart.getHours();
      const minute = eventStart.getMinutes();
      const timeKey = `${hour}:${minute}`;
      
      if (!eventsByTime[timeKey]) {
        eventsByTime[timeKey] = [];
      }
      eventsByTime[timeKey].push(event);
    });

    return (
      <div className="day-view-container">
        <div className="day-view-header">
          <button className="back-button" onClick={handleBackToCalendar}>
            ← Quay lại lịch
          </button>
          <h2 className="selected-day-title">
            <span className="day-of-week">{format(selectedDay, 'EEEE', { locale: vi })}</span>
            <span className="day-date">{format(selectedDay, 'dd/MM/yyyy')}</span>
            {isSelectedToday && <span className="today-badge">Hôm nay</span>}
          </h2>
          <div className="day-summary">
            <div className="summary-item">
              <span className="summary-label">Sự kiện:</span>
              <span className="summary-value">{dayEvents.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Tổng giờ:</span>
              <span className="summary-value">{calculateWorkHours()}h</span>
            </div>
            <button 
              className="add-event-btn"
              onClick={() => onSlotSelect && onSlotSelect({
                start: new Date(selectedDay.setHours(9, 0, 0, 0)),
                end: new Date(selectedDay.setHours(10, 0, 0, 0))
              })}
            >
              + Thêm sự kiện
            </button>
          </div>
        </div>

        {/* Current time indicator for today */}
        {isSelectedToday && (
          <div className="current-time-bar">
            <div className="current-time-marker">
              <div className="time-circle"></div>
              <div className="time-label">{format(currentTime, 'HH:mm')}</div>
            </div>
            <div className="time-line"></div>
          </div>
        )}

        <div className="day-timeline-container" ref={timelineRef} onScroll={handleTimelineScroll}>
          {/* Fixed time column */}
          <div className="time-column">
            {Array.from({ length: 24 }, (_, hour) => (
              <div key={hour} className="hour-label-wrapper">
                <div className="hour-label">
                  <div className="hour-text">{hour.toString().padStart(2, '0')}:00</div>
                </div>
                <div className="half-hour-label">
                  <div className="half-hour-text">{hour.toString().padStart(2, '0')}:30</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main timeline area with scroll */}
          <div className="timeline-area">
            {/* Hour grid lines */}
            <div className="hour-grid">
              {Array.from({ length: 24 }, (_, hour) => (
                <div key={hour} className="hour-row">
                  {/* Top half (00 minutes) */}
                  <div
                    className="time-slot top-slot"
                    onClick={() => {
                      if (onSlotSelect) {
                        const slotTime = new Date(selectedDay);
                        slotTime.setHours(hour, 0, 0, 0);
                        onSlotSelect({
                          start: slotTime,
                          end: new Date(slotTime.getTime() + 30 * 60 * 1000)
                        });
                      }
                    }}
                  >
                    <span className="slot-hint">+ Thêm sự kiện lúc {hour.toString().padStart(2, '0')}:00</span>
                  </div>

                  {/* Bottom half (30 minutes) */}
                  <div
                    className="time-slot bottom-slot"
                    onClick={() => {
                      if (onSlotSelect) {
                        const slotTime = new Date(selectedDay);
                        slotTime.setHours(hour, 30, 0, 0);
                        onSlotSelect({
                          start: slotTime,
                          end: new Date(slotTime.getTime() + 30 * 60 * 1000)
                        });
                      }
                    }}
                  >
                    <span className="slot-hint">+ Thêm sự kiện lúc {hour.toString().padStart(2, '0')}:30</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Events positioned on timeline */}
            <div className="events-layer">
              {dayEvents.map((event, index) => {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end || eventStart);
                const startHour = eventStart.getHours();
                const startMinute = eventStart.getMinutes();
                const durationHours = (eventEnd - eventStart) / (1000 * 60 * 60);
                
                // Calculate position and height (160px per hour = 2.67px per minute)
                const top = (startHour * 160) + (startMinute * 2.67);
                const height = Math.max(durationHours * 160, 50); // 160px per hour, min 50px
                
                // Check if event is ongoing
                const isOngoing = isSelectedToday && 
                                 eventStart <= currentTime && 
                                 eventEnd >= currentTime;
                
                // Check if event is past/future
                const isPastEvent = isPast(eventEnd);
                const isFutureEvent = isFuture(eventStart);
                
                return (
                  <div
                    key={event.id || index}
                    className={`timeline-event ${isPastEvent ? 'past' : ''} ${isFutureEvent ? 'future' : ''} ${isOngoing ? 'ongoing' : ''}`}
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      backgroundColor: event.backgroundColor,
                      borderLeft: `4px solid ${event.borderColor}`
                    }}
                    onClick={() => onEventSelect && onEventSelect(event)}
                  >
                    <div className="event-content">
                      <div className="event-time-range">
                        {format(eventStart, 'HH:mm')} - {format(eventEnd, 'HH:mm')}
                        {isOngoing && <span className="ongoing-indicator">• Đang diễn ra</span>}
                      </div>
                      <div className="event-title">{event.title}</div>
                      <div className="event-details">
                        <span className="event-type">{event.type}</span>
                        {event.location && (
                          <span className="event-location">• {event.location}</span>
                        )}
                      </div>
                      {event.participants && event.participants.length > 0 && (
                        <div className="event-participants">
                          <span className="participants-count">
                            👥 {event.participants.length} người
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Resize handle for drag & drop */}
                    <div 
                      className="resize-handle"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        // Handle resize logic here
                      }}
                    >
                      ⋮
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current time line for today */}
            {isSelectedToday && (
              <div
                className="current-time-line"
                style={{
                  top: (currentTime.getHours() * 160) + (currentTime.getMinutes() * 2.67)
                }}
              >
                <div className="time-line-dot"></div>
                <div className="time-line-track"></div>
              </div>
            )}
          </div>
        </div>

        {/* Scroll position indicator */}
        <div className="scroll-indicator">
          <div className="scroll-track">
            <div
              className="scroll-thumb"
              style={{
                top: `${(scrollPosition / (24 * 160)) * 100}%`,
                height: '50px'
              }}
            />
          </div>
          <div className="scroll-time">
            {Math.floor(scrollPosition / 160)}:00
          </div>
        </div>

        {/* Day summary footer */}
        <div className="day-view-footer">
          <div className="footer-stats">
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <div className="stat-value">
                  {dayEvents.filter(e => e.status === 'completed').length}
                </div>
                <div className="stat-label">Đã hoàn thành</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <div className="stat-value">
                  {dayEvents.filter(e => e.status === 'scheduled').length}
                </div>
                <div className="stat-label">Sắp diễn ra</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <div className="stat-value">
                  {dayEvents.filter(e => e.type === 'meeting').length}
                </div>
                <div className="stat-label">Cuộc họp</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📞</div>
              <div className="stat-info">
                <div className="stat-value">
                  {dayEvents.filter(e => e.type === 'call').length}
                </div>
                <div className="stat-label">Cuộc gọi</div>
              </div>
            </div>
          </div>
          
          <div className="time-legend">
            <div className="legend-item">
              <div className="legend-color past"></div>
              <span>Đã qua</span>
            </div>
            <div className="legend-item">
              <div className="legend-color ongoing"></div>
              <span>Đang diễn ra</span>
            </div>
            <div className="legend-item">
              <div className="legend-color future"></div>
              <span>Sắp tới</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If day is selected, show day view
  if (selectedDay) {
    return renderDayView();
  }

  // Otherwise show normal calendar
  return (
    <div className="fullcalendar-wrapper">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={date}
        locale={viLocale}
        events={events}
        headerToolbar={{
          left: '',
          center: '',
          right: ''
        }}
        height="auto"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={3}
        weekends={true}
        firstDay={1}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: '08:00',
          endTime: '18:00'
        }}
        slotMinTime="06:00"
        slotMaxTime="22:00"
        allDaySlot={true}
        nowIndicator={true}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false
        }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false
        }}
        eventClick={handleFullCalendarEventClick}
        dateClick={handleFullCalendarDateClick}
        dayCellDidMount={(arg) => {
          // Add click handler to day cells
          arg.el.addEventListener('click', () => handleFullCalendarDayClick(arg));
        }}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        eventContent={(eventInfo) => {
          const borderColor = eventInfo.event.extendedProps.borderColor || '#2196f3';
          const backgroundColor = eventInfo.event.extendedProps.backgroundColor || '#e3f2fd';
          
          return (
            <div 
              className="fc-event-content"
              style={{
                backgroundColor: backgroundColor,
                borderLeft: `3px solid ${borderColor}`
              }}
            >
              <div className="event-title">{eventInfo.event.title}</div>
              {!eventInfo.event.allDay && (
                <div className="event-time">{eventInfo.timeText}</div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default Calendar;