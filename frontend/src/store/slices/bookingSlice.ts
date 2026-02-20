import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Booking, VenueBooking } from '../../types/booking';

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  /** User-facing venue bookings created through the booking modal */
  venueBookings: VenueBooking[];
  activeVenueBooking: VenueBooking | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  venueBookings: [],
  activeVenueBooking: null,
  isLoading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
    },
    updateBooking: (state, action: PayloadAction<Booking>) => {
      const index = state.bookings.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    },
    setCurrentBooking: (state, action: PayloadAction<Booking | null>) => {
      state.currentBooking = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // ─── Venue Booking Actions ─────────────────────────────────────────────
    addVenueBooking: (state, action: PayloadAction<VenueBooking>) => {
      state.venueBookings.unshift(action.payload);
    },
    cancelVenueBooking: (state, action: PayloadAction<string>) => {
      const booking = state.venueBookings.find((b) => b.id === action.payload);
      if (booking) {
        booking.status = 'CANCELLED';
      }
      if (state.activeVenueBooking?.id === action.payload) {
        state.activeVenueBooking = null;
      }
    },
    setActiveVenueBooking: (state, action: PayloadAction<VenueBooking | null>) => {
      state.activeVenueBooking = action.payload;
    },
  },
});

export const {
  setBookings,
  addBooking,
  updateBooking,
  setCurrentBooking,
  setLoading,
  setError,
  clearError,
  addVenueBooking,
  cancelVenueBooking,
  setActiveVenueBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;