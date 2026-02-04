import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatDate = (dateString, formatStr = 'dd/MM/yyyy HH:mm') => {
  try {
    const date = new Date(dateString);
    return format(date, formatStr, { locale: vi });
  } catch (error) {
    return dateString;
  }
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const generateChatId = (user1, user2) => {
  const sortedIds = [user1, user2].sort();
  return `chat_${sortedIds[0]}_${sortedIds[1]}`;
};

export const isExternalUser = (userType) => {
  return ['customer', 'supplier'].includes(userType);
};

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};