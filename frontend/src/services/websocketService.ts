import { io, Socket } from 'socket.io-client';
import { store } from '@/store';
import {
  connectionStart,
  connectionSuccess,
  connectionFailed,
  connectionClosed,
  messageReceived,
  subscribeToChannel,
  unsubscribeFromChannel,
} from '@/store/slices/websocketSlice';
import { updateRealTimeSlot } from '@/store/slices/parkingSlice';
import { addNotification } from '@/store/slices/notificationSlice';
import { WebSocketMessage, WebSocketMessageType, SlotStatus, NotificationType, NotificationPriority } from '@/types';
import { WS_URL } from '@/config/apiConfig';

export interface WebSocketService {
  connect(): void;
  disconnect(): void;
  subscribe(channel: string): void;
  unsubscribe(channel: string): void;
  isConnected(): boolean;
  emit(event: string, data: any): void;
}

class WebSocketServiceImpl implements WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    store.dispatch(connectionStart());

    const token = store.getState().auth.token;

    this.socket = io(WS_URL, {
      auth: {
        token,
      },
      transports: ['websocket'],
      upgrade: true,
      rememberUpgrade: true,
    });

    this.setupEventHandlers();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribe(channel: string): void {
    if (this.socket?.connected) {
      this.socket.emit('subscribe', channel);
      store.dispatch(subscribeToChannel(channel));
    }
  }

  unsubscribe(channel: string): void {
    if (this.socket?.connected) {
      this.socket.emit('unsubscribe', channel);
      store.dispatch(unsubscribeFromChannel(channel));
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      store.dispatch(connectionSuccess());
      this.reconnectAttempts = 0;

      // Re-subscribe to all previously subscribed channels
      const subscribedChannels = store.getState().websocket.subscribedChannels;
      subscribedChannels.forEach(channel => {
        this.socket?.emit('subscribe', channel);
      });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      store.dispatch(connectionClosed());
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        this.handleReconnection();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      store.dispatch(connectionFailed(error.message));
      this.handleReconnection();
    });

    // Handle real-time messages
    this.socket.on('message', (message: WebSocketMessage) => {
      store.dispatch(messageReceived(message));
      this.handleMessage(message);
    });

    // Specific event handlers
    this.socket.on('slot-status-update', (data: { slotId: string; status: SlotStatus }) => {
      store.dispatch(updateRealTimeSlot(data));
    });

    this.socket.on('user-notification', (notification: any) => {
      store.dispatch(addNotification(notification));
    });

    this.socket.on('violation-alert', (alert: any) => {
      store.dispatch(addNotification({
        id: `alert-${Date.now()}`,
        userId: '', // Will be set by backend
        type: NotificationType.VIOLATION_WARNING,
        title: 'Violation Alert',
        message: alert.message,
        priority: NotificationPriority.HIGH,
        isRead: false,
        createdAt: new Date().toISOString(),
        data: alert,
      }));
    });

    this.socket.on('booking-update', (booking: any) => {
      // Handle booking updates
      const message: WebSocketMessage = {
        id: `booking-${Date.now()}`,
        type: WebSocketMessageType.BOOKING_CONFIRMED,
        channel: 'bookings',
        data: booking,
        timestamp: new Date().toISOString(),
      };
      store.dispatch(messageReceived(message));
    });

    this.socket.on('payment-status', (payment: any) => {
      // Handle payment status updates
      const message: WebSocketMessage = {
        id: `payment-${Date.now()}`,
        type: payment.status === 'completed' 
          ? WebSocketMessageType.PAYMENT_COMPLETED 
          : WebSocketMessageType.PAYMENT_FAILED,
        channel: 'payments',
        data: payment,
        timestamp: new Date().toISOString(),
      };
      store.dispatch(messageReceived(message));
    });

    this.socket.on('camera-status', (camera: any) => {
      // Handle camera status updates
      const message: WebSocketMessage = {
        id: `camera-${Date.now()}`,
        type: WebSocketMessageType.CAMERA_STATUS_CHANGE,
        channel: 'cameras',
        data: camera,
        timestamp: new Date().toISOString(),
      };
      store.dispatch(messageReceived(message));
    });

    this.socket.on('stats-update', (stats: any) => {
      // Handle system statistics updates
      const message: WebSocketMessage = {
        id: `stats-${Date.now()}`,
        type: WebSocketMessageType.STATS_UPDATE,
        channel: 'system',
        data: stats,
        timestamp: new Date().toISOString(),
      };
      store.dispatch(messageReceived(message));
    });
  }

  private handleMessage(message: WebSocketMessage): void {
    // Additional message handling logic based on message type
    switch (message.type) {
      case WebSocketMessageType.SLOT_STATUS_UPDATE:
        // Already handled by specific event handler
        break;
      
      case WebSocketMessageType.SYSTEM_ALERT:
        // Show system alert notification
        store.dispatch(addNotification({
          id: message.id,
          userId: '', // Will be set by backend
          type: NotificationType.SYSTEM_UPDATE,
          title: 'System Alert',
          message: message.data.message,
          priority: NotificationPriority.HIGH,
          isRead: false,
          createdAt: message.timestamp,
          data: message.data,
        }));
        break;
      
      case WebSocketMessageType.MAINTENANCE_NOTICE:
        // Show maintenance notification
        store.dispatch(addNotification({
          id: message.id,
          userId: '', // Will be set by backend
          type: NotificationType.MAINTENANCE_NOTICE,
          title: 'Maintenance Notice',
          message: message.data.message,
          priority: NotificationPriority.MEDIUM,
          isRead: false,
          createdAt: message.timestamp,
          data: message.data,
        }));
        break;
      
      default:
        console.log('Unhandled message type:', message.type);
    }
  }

  private handleReconnection(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect in ${delay}ms... (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect();
    }, delay);
  }
}

export const websocketService = new WebSocketServiceImpl();