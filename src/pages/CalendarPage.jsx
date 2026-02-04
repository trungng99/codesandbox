import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import socket from '../services/socket';
import Calendar from '../components/calendar/Calendar';
import CalendarToolbar from '../components/calendar/CalendarToolbar';
import CalendarSidebar from '../components/calendar/CalendarSidebar';
import MeetingModal from '../components/meetings/MeetingModal';
import EventDetailModal from '../components/calendar/EventDetailModal';
import './CalendarPage.css';

const CalendarPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentView, setCurrentView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTypes, setEventTypes] = useState(['meeting', 'call', 'task']);
  const [selectedTypes, setSelectedTypes] = useState(['meeting', 'call', 'task']);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null); // Thêm state cho ngày được chọn

  // Utility functions
  const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const addHours = (date, hours) => new Date(date.getTime() + hours * 60 * 60 * 1000);

  // Get event color based on type
  const getEventColor = (type) => {
    const colors = {
      meeting: '#e3f2fd',
      call: '#f3e5f5',
      task: '#e8f5e9',
      appointment: '#fff3e0'
    };
    return colors[type] || '#f5f5f5';
  };

  const getEventBorderColor = (type) => {
    const colors = {
      meeting: '#2196f3',
      call: '#9c27b0',
      task: '#4caf50',
      appointment: '#ff9800'
    };
    return colors[type] || '#757575';
  };

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const response = await api.get('/meetings', {
        params: { 
          userId: user.id,
          startDate: startOfMonth(selectedDate).toISOString(),
          endDate: endOfMonth(selectedDate).toISOString()
        }
      });
      
      const formattedEvents = response.data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: new Date(event.startTime),
        end: new Date(event.endTime),
        type: event.type,
        status: event.status,
        participants: event.participants || [],
        location: event.location,
        isAllDay: event.isAllDay || false,
        createdBy: event.createdBy,
        backgroundColor: getEventColor(event.type),
        borderColor: getEventBorderColor(event.type)
      }));
      
      setEvents(formattedEvents);
      filterEvents(formattedEvents, selectedTypes);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to mock data for testing
      setEvents(getMockEvents());
      filterEvents(getMockEvents(), selectedTypes);
    } finally {
      setLoading(false);
    }
  }, [user?.id, selectedDate, selectedTypes]);

  // Mock data for testing
  const getMockEvents = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return [
      {
        id: '1',
        title: 'Họp báo cáo tuần',
        description: 'Báo cáo công việc tuần và kế hoạch tuần tới',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30),
        type: 'meeting',
        status: 'scheduled',
        participants: [
          { id: 'user1', name: 'Nguyễn Văn A', role: 'Manager' },
          { id: 'user2', name: 'Trần Thị B', role: 'Developer' }
        ],
        location: 'Phòng họp 301',
        isAllDay: false,
        createdBy: { id: 'user1', name: 'Nguyễn Văn A' },
        backgroundColor: '#e3f2fd',
        borderColor: '#2196f3'
      },
      {
        id: '2',
        title: 'Gọi khách hàng ABC',
        description: 'Thảo luận hợp đồng mới',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 0),
        type: 'call',
        status: 'scheduled',
        participants: [
          { id: 'user1', name: 'Nguyễn Văn A', role: 'Sale' }
        ],
        location: 'Online - Zoom',
        isAllDay: false,
        createdBy: { id: 'user1', name: 'Nguyễn Văn A' },
        backgroundColor: '#f3e5f5',
        borderColor: '#9c27b0'
      },
      {
        id: '3',
        title: 'Hoàn thành báo cáo',
        description: 'Hoàn thành báo cáo quý cho ban giám đốc',
        start: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 0),
        end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 12, 0),
        type: 'task',
        status: 'scheduled',
        participants: [],
        location: '',
        isAllDay: false,
        createdBy: { id: 'user1', name: 'Nguyễn Văn A' },
        backgroundColor: '#e8f5e9',
        borderColor: '#4caf50'
      }
    ];
  };

  // Filter events by type
  const filterEvents = (eventsList, types) => {
    const filtered = eventsList.filter(event => types.includes(event.type));
    setFilteredEvents(filtered);
  };

  // Real-time updates via socket - FIXED VERSION
  useEffect(() => {
    if (!user) return;

    // Define callback functions
    const handleMeetingCreated = (newEvent) => {
      setEvents(prev => [...prev, {
        ...newEvent,
        start: new Date(newEvent.startTime),
        end: new Date(newEvent.endTime),
        backgroundColor: getEventColor(newEvent.type),
        borderColor: getEventBorderColor(newEvent.type)
      }]);
    };

    const handleMeetingUpdated = (updatedEvent) => {
      setEvents(prev => prev.map(event => 
        event.id === updatedEvent.id ? {
          ...event,
          ...updatedEvent,
          start: new Date(updatedEvent.startTime),
          end: new Date(updatedEvent.endTime)
        } : event
      ));
    };

    const handleMeetingDeleted = (deletedId) => {
      setEvents(prev => prev.filter(event => event.id !== deletedId));
    };

    // Subscribe to events with callbacks
    socket.on('meeting_created', handleMeetingCreated);
    socket.on('meeting_updated', handleMeetingUpdated);
    socket.on('meeting_deleted', handleMeetingDeleted);

    return () => {
      // Clean up listeners using removeAllListeners instead of .off()
      // Check if socket instance exists
      if (socket.socket) {
        socket.socket.removeAllListeners('meeting_created');
        socket.socket.removeAllListeners('meeting_updated');
        socket.socket.removeAllListeners('meeting_deleted');
      } else {
        // Fallback: disconnect socket
        socket.disconnect();
      }
    };
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Handle event selection
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setIsEventDetailModalOpen(true);
  };

  // Handle slot selection (for creating new events)
  const handleSlotSelect = (slotInfo) => {
    setSelectedEvent({
      start: slotInfo.start,
      end: slotInfo.end || addHours(slotInfo.start, 1),
      type: 'meeting',
      participants: [user?.id]
    });
    setIsMeetingModalOpen(true);
  };

  // Handle day click - NEW FUNCTION
  const handleDayClick = (day) => {
    setSelectedDay(day);
    setCurrentView('day');
    setSelectedDate(day);
  };

  // Handle back to month view
  const handleBackToMonth = () => {
    setSelectedDay(null);
    setCurrentView('month');
  };

  // Handle event drop (drag & drop)
  const handleEventDrop = async (dropInfo) => {
    try {
      await api.put(`/meetings/${dropInfo.event.id}`, {
        startTime: dropInfo.event.start.toISOString(),
        endTime: dropInfo.event.end.toISOString()
      });
      fetchEvents(); // Refresh events
    } catch (error) {
      console.error('Error updating event time:', error);
      // Show error message
      alert('Không thể cập nhật thời gian sự kiện. Vui lòng thử lại.');
    }
  };

  // Handle event resize
  const handleEventResize = async (resizeInfo) => {
    try {
      await api.put(`/meetings/${resizeInfo.event.id}`, {
        endTime: resizeInfo.event.end.toISOString()
      });
      fetchEvents();
    } catch (error) {
      console.error('Error resizing event:', error);
      alert('Không thể thay đổi thời lượng sự kiện. Vui lòng thử lại.');
    }
  };

  // Handle type filter change
  const handleTypeFilterChange = (types) => {
    setSelectedTypes(types);
    filterEvents(events, types);
  };

  // Handle quick create
  const handleQuickCreate = (action) => {
    const now = new Date();
    const endTime = new Date(now.getTime() + (action.duration * 60 * 1000));
    
    setSelectedEvent({
      title: action.label,
      start: now,
      end: endTime,
      type: action.type || 'meeting',
      participants: [user?.id]
    });
    setIsMeetingModalOpen(true);
  };

  // Tính tổng giờ làm việc trong ngày
  const calculateTotalWorkHours = useCallback(() => {
    if (!selectedDay) return '0';
    
    const dayStart = new Date(selectedDay);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(selectedDay);
    dayEnd.setHours(23, 59, 59, 999);
    
    const dayEvents = events.filter(event => {
      const eventStart = new Date(event.start);
      return eventStart >= dayStart && eventStart <= dayEnd;
    });
    
    const totalMinutes = dayEvents.reduce((total, event) => {
      const start = new Date(event.start);
      const end = new Date(event.end || start);
      return total + ((end - start) / (1000 * 60));
    }, 0);
    
    return (totalMinutes / 60).toFixed(1);
  }, [selectedDay, events]);

  // Get events for selected day
  const getDayEvents = useCallback(() => {
    if (!selectedDay) return [];
    
    const dayStart = new Date(selectedDay);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(selectedDay);
    dayEnd.setHours(23, 59, 59, 999);
    
    return filteredEvents.filter(event => {
      const eventStart = new Date(event.start);
      return eventStart >= dayStart && eventStart <= dayEnd;
    });
  }, [selectedDay, filteredEvents]);

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h1><i className="calendar-icon">📅</i> Lịch làm việc</h1>
        <div className="user-info">
          <span>{user?.name || 'Người dùng'}</span>
          <small>{user?.department || 'Chưa có phòng ban'}</small>
        </div>
      </div>

      <div className="calendar-container">
        <CalendarSidebar
          eventTypes={eventTypes}
          selectedTypes={selectedTypes}
          onTypeFilterChange={handleTypeFilterChange}
          onQuickCreate={handleQuickCreate}
          eventsCount={events.length}
          selectedDay={selectedDay}
          dayEventsCount={getDayEvents().length}
          dayWorkHours={calculateTotalWorkHours()}
        />

        <div className="calendar-main">
          <CalendarToolbar
            currentView={currentView}
            onViewChange={setCurrentView}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onToday={() => {
              const today = new Date();
              setSelectedDate(today);
              setSelectedDay(today);
              setCurrentView('day');
            }}
            onCreateEvent={() => {
              setSelectedEvent(null);
              setIsMeetingModalOpen(true);
            }}
            onRefresh={fetchEvents}
            onBackToMonth={handleBackToMonth}
            selectedDay={selectedDay}
          />

          {loading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Đang tải lịch...</p>
            </div>
          ) : (
            <Calendar
              events={filteredEvents}
              view={currentView}
              date={selectedDate}
              onEventSelect={handleEventSelect}
              onSlotSelect={handleSlotSelect}
              onEventDrop={handleEventDrop}
              onEventResize={handleEventResize}
              onDayClick={handleDayClick}
              selectedDay={selectedDay}
            />
          )}
        </div>
      </div>

      {/* Meeting Creation/Edit Modal */}
      {isMeetingModalOpen && (
        <MeetingModal
          event={selectedEvent}
          onClose={() => setIsMeetingModalOpen(false)}
          onSave={async (eventData) => {
            try {
              if (selectedEvent?.id) {
                await api.put(`/meetings/${selectedEvent.id}`, eventData);
              } else {
                await api.post('/meetings', eventData);
              }
              fetchEvents();
              setIsMeetingModalOpen(false);
            } catch (error) {
              console.error('Error saving event:', error);
              alert('Lỗi khi lưu sự kiện. Vui lòng thử lại.');
            }
          }}
          onDelete={async () => {
            if (selectedEvent?.id) {
              if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
                try {
                  await api.delete(`/meetings/${selectedEvent.id}`);
                  fetchEvents();
                  setIsMeetingModalOpen(false);
                } catch (error) {
                  console.error('Error deleting event:', error);
                  alert('Lỗi khi xóa sự kiện. Vui lòng thử lại.');
                }
              }
            }
          }}
        />
      )}

      {/* Event Detail Modal */}
      {isEventDetailModalOpen && selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setIsEventDetailModalOpen(false)}
          onEdit={() => {
            setIsEventDetailModalOpen(false);
            setIsMeetingModalOpen(true);
          }}
          onDelete={async () => {
            if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
              try {
                await api.delete(`/meetings/${selectedEvent.id}`);
                fetchEvents();
                setIsEventDetailModalOpen(false);
              } catch (error) {
                console.error('Error deleting event:', error);
                alert('Lỗi khi xóa sự kiện. Vui lòng thử lại.');
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default CalendarPage;