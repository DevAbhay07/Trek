import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Camera, Detection, OpenCVSystemHealth } from '../../types/opencv';

interface OpenCVState {
  cameras: Camera[];
  detections: Detection[];
  realTimeDetections: Record<string, Detection[]>;
  isProcessing: boolean;
  error: string | null;
  systemHealth: OpenCVSystemHealth;
}

const initialState: OpenCVState = {
  cameras: [],
  detections: [],
  realTimeDetections: {},
  isProcessing: false,
  error: null,
  systemHealth: {
    totalCameras: 0,
    onlineCameras: 0,
    averageLatency: 0,
    detectionAccuracy: 0,
    systemLoad: 0,
    lastHealthCheck: new Date().toISOString(),
  },
};

const opencvSlice = createSlice({
  name: 'opencv',
  initialState,
  reducers: {
    setCameras: (state, action: PayloadAction<Camera[]>) => {
      state.cameras = action.payload;
    },
    addDetection: (state, action: PayloadAction<Detection>) => {
      state.detections.push(action.payload);
    },
    updateRealTimeDetections: (state, action: PayloadAction<Record<string, Detection[]>>) => {
      state.realTimeDetections = { ...state.realTimeDetections, ...action.payload };
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setSystemHealth: (state, action) => {
      state.systemHealth = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCameras,
  addDetection,
  updateRealTimeDetections,
  setProcessing,
  setSystemHealth,
  clearError,
} = opencvSlice.actions;

export default opencvSlice.reducer;