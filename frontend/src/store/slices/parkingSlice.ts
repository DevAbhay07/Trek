import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ParkingState, ParkingLot, ParkingSlot, SlotStatus, SlotFilter } from '@/types';
import { parkingService } from '@/services/parkingService';

const initialState: ParkingState = {
  parkingLots: [],
  selectedLot: null,
  slots: [],
  realTimeSlots: {},
  isLoading: false,
  error: null,
  lastUpdated: new Date().toISOString(),
};

// Async thunks
export const fetchParkingLots = createAsyncThunk(
  'parking/fetchParkingLots',
  async (_, { rejectWithValue }) => {
    try {
      const lots = await parkingService.getParkingLots();
      return lots;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch parking lots');
    }
  }
);

export const fetchSlots = createAsyncThunk(
  'parking/fetchSlots',
  async (params: { lotId?: string; filters?: SlotFilter }, { rejectWithValue }) => {
    try {
      const slots = await parkingService.getSlots(params.lotId, params.filters);
      return slots;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch slots');
    }
  }
);

export const fetchSlotStatus = createAsyncThunk(
  'parking/fetchSlotStatus',
  async (slotId: string, { rejectWithValue }) => {
    try {
      const status = await parkingService.getSlotStatus(slotId);
      return { slotId, status };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch slot status');
    }
  }
);

export const updateSlotStatus = createAsyncThunk(
  'parking/updateSlotStatus',
  async (params: { slotId: string; status: SlotStatus }, { rejectWithValue }) => {
    try {
      const updatedSlot = await parkingService.updateSlotStatus(params.slotId, params.status);
      return updatedSlot;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update slot status');
    }
  }
);

const parkingSlice = createSlice({
  name: 'parking',
  initialState,
  reducers: {
    selectParkingLot: (state, action: PayloadAction<ParkingLot | null>) => {
      state.selectedLot = action.payload;
    },
    updateRealTimeSlot: (state, action: PayloadAction<{ slotId: string; status: SlotStatus }>) => {
      state.realTimeSlots[action.payload.slotId] = action.payload.status;
      state.lastUpdated = new Date().toISOString();
      
      // Update slot in slots array if it exists
      const slotIndex = state.slots.findIndex(slot => slot.id === action.payload.slotId);
      if (slotIndex !== -1) {
        state.slots[slotIndex].status = action.payload.status;
      }
      
      // Update parking lot available/occupied counts
      if (state.selectedLot) {
        const lot = state.parkingLots.find(lot => lot.id === state.selectedLot?.id);
        if (lot) {
          // Recalculate counts based on current slot statuses
          const availableCount = state.slots.filter(slot => 
            slot.parkingLotId === lot.id && slot.status === SlotStatus.AVAILABLE
          ).length;
          const occupiedCount = state.slots.filter(slot => 
            slot.parkingLotId === lot.id && slot.status === SlotStatus.OCCUPIED
          ).length;
          
          lot.availableSlots = availableCount;
          lot.occupiedSlots = occupiedCount;
        }
      }
    },
    bulkUpdateSlots: (state, action: PayloadAction<Record<string, SlotStatus>>) => {
      state.realTimeSlots = { ...state.realTimeSlots, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    clearParkingError: (state) => {
      state.error = null;
    },
    resetParkingState: (state) => {
      state.selectedLot = null;
      state.slots = [];
      state.realTimeSlots = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Parking Lots
      .addCase(fetchParkingLots.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchParkingLots.fulfilled, (state, action: PayloadAction<ParkingLot[]>) => {
        state.isLoading = false;
        state.parkingLots = action.payload;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchParkingLots.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Slots
      .addCase(fetchSlots.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSlots.fulfilled, (state, action: PayloadAction<ParkingSlot[]>) => {
        state.isLoading = false;
        state.slots = action.payload;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchSlots.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Slot Status
      .addCase(fetchSlotStatus.fulfilled, (state, action: PayloadAction<{ slotId: string; status: SlotStatus }>) => {
        state.realTimeSlots[action.payload.slotId] = action.payload.status;
        state.lastUpdated = new Date().toISOString();
      })
      
      // Update Slot Status
      .addCase(updateSlotStatus.fulfilled, (state, action: PayloadAction<ParkingSlot>) => {
        const slotIndex = state.slots.findIndex(slot => slot.id === action.payload.id);
        if (slotIndex !== -1) {
          state.slots[slotIndex] = action.payload;
        }
        state.realTimeSlots[action.payload.id] = action.payload.status;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateSlotStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  selectParkingLot,
  updateRealTimeSlot,
  bulkUpdateSlots,
  clearParkingError,
  resetParkingState,
} = parkingSlice.actions;

export default parkingSlice.reducer;