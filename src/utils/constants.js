export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SALES: 'sales',
  CS: 'customer_service',
  ACCOUNTANT: 'accountant',
  EXTERNAL: 'external'
};

export const CHAT_TYPES = {
  INTERNAL: 'internal',
  CUSTOMER: 'customer',
  SUPPLIER: 'supplier',
  GROUP: 'group'
};

export const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  SEEN: 'seen'
};

export const CALL_TYPES = {
  VOICE: 'voice',
  VIDEO: 'video',
  GROUP: 'group'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },
  CHAT: {
    MESSAGES: '/chat/messages',
    CONVERSATIONS: '/chat/conversations',
    SEND_MESSAGE: '/chat/send'
  },
  CRM: {
    CONTACTS: '/crm/contacts',
    OPPORTUNITIES: '/crm/opportunities',
    TICKETS: '/crm/tickets',
    CONTRACTS: '/crm/contracts'
  }
};

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  NEW_MESSAGE: 'new_message',
  USER_TYPING: 'user_typing',
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  CALL_REQUEST: 'call_request',
  CALL_ACCEPTED: 'call_accepted',
  CALL_REJECTED: 'call_rejected',
  CALL_ENDED: 'call_ended'
};