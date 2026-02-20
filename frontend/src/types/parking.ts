import { VehicleType } from './auth';

// Parking Slot and Location Types
export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  hourlyRate: number;
  amenities: string[];
  operatingHours: OperatingHours;
  cameras: ParkingCamera[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ParkingCamera {
  id: string;
  name: string;
  streamUrl: string;
  status: string;
}

export interface ParkingSlot {
  id: string;
  parkingLotId: string;
  slotNumber: string;
  position: SlotPosition;
  status: SlotStatus;
  vehicleType: VehicleType;
  dimensions: SlotDimensions;
  currentBooking?: any;
  lastOccupied?: string;
  detectionZone: DetectionZone;
  isAccessible: boolean;
  floorLevel: number;
  section: string;
}

export enum SlotStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  OUT_OF_ORDER = 'out_of_order',
  CLEANING = 'cleaning'
}

export interface SlotPosition {
  x: number;
  y: number;
  zone: string;
  row: string;
  column: string;
}

export interface SlotDimensions {
  length: number;
  width: number;
  height?: number;
}

export interface DetectionZone {
  id: string;
  coordinates: Coordinates[];
  confidence: number;
  lastDetection?: string;
  cameraId: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface OperatingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

// Parking State Management
export interface ParkingState {
  parkingLots: ParkingLot[];
  selectedLot: ParkingLot | null;
  slots: ParkingSlot[];
  realTimeSlots: Record<string, SlotStatus>;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string;
}

export interface SlotFilter {
  vehicleType?: VehicleType;
  section?: string;
  floorLevel?: number;
  isAccessible?: boolean;
  maxDistance?: number;
  minHourlyRate?: number;
  maxHourlyRate?: number;
}