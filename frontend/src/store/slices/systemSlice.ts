import { createSlice } from '@reduxjs/toolkit';

const systemSlice = createSlice({
  name: 'system',
  initialState: {
    stats: {
      totalSlots: 0,
      availableSlots: 0,
      occupiedSlots: 0,
      reservedSlots: 0,
      occupancyRate: 0,
      totalBookings: 0,
      activeBookings: 0,
      completedBookings: 0,
      totalRevenue: 0,
      averageSessionDuration: 0,
      peakHours: [],
      lastUpdated: new Date().toISOString(),
    },
    config: {
      maintenance: {
        isEnabled: false,
      },
      features: {
        fastagEnabled: true,
        openCVEnabled: true,
        realTimeUpdates: true,
        mobileApp: true,
      },
      pricing: {
        defaultHourlyRate: 50,
        peakHourMultiplier: 1.5,
        weekendMultiplier: 1.2,
        processingFeePercentage: 2.5,
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: true,
        pushEnabled: true,
      },
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    updateConfig: (state, action) => {
      state.config = { ...state.config, ...action.payload };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  updateStats,
  updateConfig,
  setLoading,
  setError,
  clearError,
} = systemSlice.actions;

export default systemSlice.reducer;