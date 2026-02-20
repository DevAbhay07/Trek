// Export all types from a single entry point
export * from './auth';
export * from './parking';
export * from './booking';
export type { 
  Camera, 
  CameraStatus, 
  Detection, 
  OpenCVState, 
  CameraFeed, 
  StreamQuality 
} from './opencv';
export * from './system';

// Common utility types
export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => any;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: any;
}

export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  help?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Route and Navigation Types
export interface RouteConfig {
  path: string;
  component: any;
  exact?: boolean;
  protected?: boolean;
  roles?: string[];
  title?: string;
  description?: string;
}

export interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
  roles?: string[];
  badge?: string | number;
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: any;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children: any;
}

export interface ChartProps {
  data: any[];
  type: 'line' | 'bar' | 'pie' | 'area' | 'donut';
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  colors?: string[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: any;
  actions?: any;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// Theme and Design System Types
export interface Theme {
  colors: {
    primary: ColorPalette;
    secondary: ColorPalette;
    success: ColorPalette;
    warning: ColorPalette;
    danger: ColorPalette;
    gray: ColorPalette;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  typography: {
    fontFamily: Record<string, string>;
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
    lineHeight: Record<string, string>;
  };
}

export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

// Error Handling Types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

export interface ErrorDisplayProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  showRetry?: boolean;
  onRetry?: () => void;
}

// Performance and Optimization Types
export interface LazyComponentProps {
  fallback?: any;
  error?: any;
  delay?: number;
}

export interface VirtualListProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => any;
  overscan?: number;
}