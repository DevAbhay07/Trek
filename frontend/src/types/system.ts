// WebSocket and Real-time Types
export interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastMessage: WebSocketMessage | null;
  subscribedChannels: string[];
  connectionAttempts: number;
  lastReconnectAt?: string;
}

export interface WebSocketMessage {
  type: WebSocketMessageType;
  channel: string;
  data: any;
  timestamp: string;
  id: string;
}

export enum WebSocketMessageType {
  // Slot status updates
  SLOT_STATUS_UPDATE = 'slot-status-update',
  SLOT_AVAILABLE = 'slot-available',
  SLOT_OCCUPIED = 'slot-occupied',
  SLOT_RESERVED = 'slot-reserved',
  
  // Booking updates
  BOOKING_CONFIRMED = 'booking-confirmed',
  BOOKING_STARTED = 'booking-started',
  BOOKING_COMPLETED = 'booking-completed',
  BOOKING_CANCELLED = 'booking-cancelled',
  BOOKING_EXTENDED = 'booking-extended',
  
  // Payment updates
  PAYMENT_PROCESSING = 'payment-processing',
  PAYMENT_COMPLETED = 'payment-completed',
  PAYMENT_FAILED = 'payment-failed',
  PAYMENT_REFUNDED = 'payment-refunded',
  
  // User notifications
  USER_NOTIFICATION = 'user-notification',
  VIOLATION_ALERT = 'violation-alert',
  SYSTEM_ALERT = 'system-alert',
  
  // OpenCV and camera updates
  CAMERA_STATUS_CHANGE = 'camera-status-change',
  DETECTION_UPDATE = 'detection-update',
  VIOLATION_DETECTED = 'violation-detected',
  
  // System updates
  STATS_UPDATE = 'stats-update',
  OCCUPANCY_CHANGE = 'occupancy-change',
  SYSTEM_MAINTENANCE = 'system-maintenance',
  MAINTENANCE_NOTICE = 'maintenance-notice',
  
  // Admin updates
  ADMIN_ALERT = 'admin-alert',
  REVENUE_UPDATE = 'revenue-update',
  ANALYTICS_UPDATE = 'analytics-update'
}

export interface WebSocketChannel {
  name: string;
  pattern: string;
  requiresAuth: boolean;
  roles?: string[];
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  priority: NotificationPriority;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  actions?: NotificationAction[];
}

export enum NotificationType {
  BOOKING_CONFIRMATION = 'booking_confirmation',
  BOOKING_REMINDER = 'booking_reminder',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  VIOLATION_WARNING = 'violation_warning',
  SLOT_AVAILABLE = 'slot_available',
  MAINTENANCE_NOTICE = 'maintenance_notice',
  SYSTEM_UPDATE = 'system_update',
  PROMOTIONAL = 'promotional'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface NotificationAction {
  label: string;
  action: string;
  url?: string;
  style: 'primary' | 'secondary' | 'danger';
}

// Analytics and Statistics Types
export interface SystemStats {
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  reservedSlots: number;
  occupancyRate: number;
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalRevenue: number;
  averageSessionDuration: number;
  peakHours: PeakHour[];
  lastUpdated: string;
}

export interface PeakHour {
  hour: number;
  occupancyRate: number;
  averageBookings: number;
}

export interface AnalyticsData {
  revenueChart: ChartData[];
  occupancyChart: ChartData[];
  bookingTrends: ChartData[];
  violationStats: ViolationStats;
  userActivityStats: UserActivityStats;
  cameraPerformance: CameraPerformanceStats[];
}

export interface ChartData {
  label: string;
  value: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ViolationStats {
  totalViolations: number;
  violationsByType: Record<string, number>;
  resolvedViolations: number;
  pendingViolations: number;
  averageResolutionTime: number;
}

export interface UserActivityStats {
  totalUsers: number;
  activeUsers: number;
  newSignups: number;
  retentionRate: number;
  averageBookingsPerUser: number;
}

export interface CameraPerformanceStats {
  cameraId: string;
  cameraName: string;
  uptime: number;
  detectionAccuracy: number;
  averageLatency: number;
  totalDetections: number;
  falsePositives: number;
  lastMaintenance: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
  timestamp: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string[];
  type?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// System Configuration Types
export interface SystemConfig {
  maintenance: {
    isEnabled: boolean;
    startTime?: string;
    endTime?: string;
    message?: string;
  };
  features: {
    fastagEnabled: boolean;
    openCVEnabled: boolean;
    realTimeUpdates: boolean;
    mobileApp: boolean;
  };
  pricing: {
    defaultHourlyRate: number;
    peakHourMultiplier: number;
    weekendMultiplier: number;
    processingFeePercentage: number;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
  };
}