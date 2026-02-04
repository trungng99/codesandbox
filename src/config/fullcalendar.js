import { viLocale } from '@fullcalendar/core/locales/vi';

export const calendarConfig = {
  locales: [viLocale],
  locale: 'vi',
  firstDay: 1, // Monday
  businessHours: {
    daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
    startTime: '08:00',
    endTime: '18:00'
  },
  slotMinTime: '06:00',
  slotMaxTime: '22:00',
  allDaySlot: true,
  nowIndicator: true,
  scrollTime: '08:00',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  }
};