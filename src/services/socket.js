// src/services/socket.js
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map(); // Store event listeners for cleanup
  }

  connect(token) {
    if (this.socket?.connected) return;
    
    this.socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      // Remove all stored listeners
      this.listeners.forEach((callback, event) => {
        this.socket.off(event, callback);
      });
      this.listeners.clear();
      
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      // Store listener for cleanup
      this.listeners.set(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
        this.listeners.delete(event);
      } else {
        // Remove all listeners for this event
        const storedCallback = this.listeners.get(event);
        if (storedCallback) {
          this.socket.off(event, storedCallback);
          this.listeners.delete(event);
        }
      }
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit:', event);
    }
  }

  // Check connection status
  isConnected() {
    return this.socket?.connected || false;
  }

  // Get socket ID
  getId() {
    return this.socket?.id || null;
  }

  // Reconnect manually
  reconnect() {
    if (this.socket) {
      this.socket.connect();
    }
  }
}

export default new SocketService();