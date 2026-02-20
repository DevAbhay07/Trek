// OpenCV and Camera Types
export interface Camera {
  id: string;
  parkingLotId: string;
  name: string;
  position: CameraPosition;
  streamUrl: string;
  status: CameraStatus;
  resolution: CameraResolution;
  capabilities: CameraCapabilities;
  detectionZones: DetectionZone[];
  calibration: CameraCalibration;
  lastMaintenance: string;
  isActive: boolean;
  createdAt: string;
}

export interface CameraPosition {
  x: number;
  y: number;
  z: number;
  rotation: {
    pitch: number;
    yaw: number;
    roll: number;
  };
  coverage: CoverageBounds;
}

export interface CoverageBounds {
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
}

export interface CameraResolution {
  width: number;
  height: number;
  fps: number;
}

export interface CameraCapabilities {
  nightVision: boolean;
  panTilt: boolean;
  zoom: boolean;
  motionDetection: boolean;
  objectTracking: boolean;
  licenseRecognition: boolean;
}

export interface CameraCalibration {
  intrinsicMatrix: number[][];
  distortionCoefficients: number[];
  extrinsicMatrix: number[][];
  calibratedAt: string;
  accuracy: number;
}

export enum CameraStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
  CALIBRATING = 'calibrating'
}

export interface DetectionZone {
  id: string;
  cameraId: string;
  name: string;
  coordinates: Point[];
  slotIds: string[];
  detectionType: DetectionType;
  confidence: number;
  isActive: boolean;
  lastDetection?: Detection;
}

export interface Point {
  x: number;
  y: number;
}

export enum DetectionType {
  VEHICLE = 'vehicle',
  PERSON = 'person',
  VIOLATION = 'violation',
  MOTION = 'motion'
}

// OpenCV Detection and Analysis
export interface Detection {
  id: string;
  cameraId: string;
  detectionZoneId: string;
  timestamp: string;
  detectionType: DetectionType;
  confidence: number;
  boundingBox: BoundingBox;
  attributes: DetectionAttributes;
  processed: boolean;
  associatedSlot?: string;
  violationType?: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectionAttributes {
  vehicleType?: string;
  color?: string;
  licensePlate?: string;
  licensePlateConfidence?: number;
  make?: string;
  model?: string;
  occupancy?: number;
  direction?: string;
  speed?: number;
  isParked?: boolean;
}

export interface OpenCVState {
  cameras: Camera[];
  detections: Detection[];
  realTimeDetections: Record<string, Detection[]>;
  isProcessing: boolean;
  error: string | null;
  systemHealth: OpenCVSystemHealth;
}

export interface OpenCVSystemHealth {
  totalCameras: number;
  onlineCameras: number;
  averageLatency: number;
  detectionAccuracy: number;
  systemLoad: number;
  lastHealthCheck: string;
}

// Camera Feed and Streaming
export interface CameraFeed {
  cameraId: string;
  streamUrl: string;
  status: CameraStatus;
  currentViewers: number;
  bandwidth: number;
  quality: StreamQuality;
  overlays: CameraOverlay[];
}

export enum StreamQuality {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  HD = 'hd',
  FHD = 'fhd'
}

export interface CameraOverlay {
  type: OverlayType;
  position: Point;
  size: { width: number; height: number };
  data: any;
  isVisible: boolean;
}

export enum OverlayType {
  SLOT_STATUS = 'slot_status',
  DETECTION_BOX = 'detection_box',
  ZONE_BOUNDARY = 'zone_boundary',
  TIMESTAMP = 'timestamp',
  CAMERA_INFO = 'camera_info',
  VIOLATION_ALERT = 'violation_alert'
}