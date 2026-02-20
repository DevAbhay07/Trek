// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  fastagId?: string;
  fastagBalance?: number;
  profilePicture?: string;
  isVerified: boolean;
  preferences: UserPreferences;
  vehicles: Vehicle[];
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  PUBLIC = 'public',
  USER = 'user',
  ADMIN = 'admin',
  SECURITY = 'security'
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacy: {
    showProfile: boolean;
    shareLocation: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  licensePlate: string;
  make: string;
  model: string;
  color: string;
  vehicleType: VehicleType;
  fastagEnabled: boolean;
  isActive: boolean;
  createdAt: string;
}

export enum VehicleType {
  CAR = 'car',
  MOTORCYCLE = 'motorcycle',
  TRUCK = 'truck',
  VAN = 'van'
}

// Authentication Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
  fastagId?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  fastagId?: string;
}

// ─── Role-based Registration Payloads ────────────────────────────────────────

export type RegistrationRole = 'USER' | 'ADMIN';

export interface UserRegistration {
  role: 'USER';
  name: string;
  vehicleNumber: string;
  email: string;
  phone: string;
  password: string;
}

export type FacilityType =
  | 'Mall'
  | 'Hospital'
  | 'Business Park'
  | 'Public Parking'
  | 'Airport'
  | 'Stadium';

export interface AdminRegistration {
  role: 'ADMIN';
  name: string;
  email: string;
  phone: string;
  organizationName: string;
  facilityType: FacilityType;
  totalSlots: number;
  address: string;
  password: string;
}

export type RegistrationPayload = UserRegistration | AdminRegistration;

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface FastagVerification {
  fastagId: string;
  balance: number;
  isActive: boolean;
  lastTransaction: string;
}