import type { VenueBooking, CreateVenueBookingPayload } from '../types/booking';

// When a real backend is available, replace the simulation block in each
// method with the corresponding `apiClient` call, e.g.:
//   import { apiClient } from './apiClient';
//   return apiClient.post<VenueBooking>('/bookings', payload);

const MIN_DELAY_MS = 800;
const MAX_DELAY_MS = 1_500;

/** Simulates network latency */
const simulateDelay = (): Promise<void> =>
  new Promise((resolve) =>
    setTimeout(resolve, MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)),
  );

/** Generates a short alphanumeric confirmation reference */
const generateConfirmationCode = (): string =>
  `PP${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export const bookingService = {
  /**
   * Simulate POST /api/bookings
   * Resolves with the created VenueBooking or rejects on transient failure.
   */
  async createBooking(payload: CreateVenueBookingPayload): Promise<VenueBooking> {
    await simulateDelay();

    // Simulate a small failure rate (≈5%) to exercise error handling
    if (Math.random() < 0.05) {
      throw new Error('Payment gateway timeout. Please try again.');
    }

    const booking: VenueBooking = {
      id: `bkg_${Date.now()}`,
      venueId: payload.venueId,
      venueName: payload.venueName,
      venueLocation: payload.venueLocation,
      slotId: payload.slotId,
      slotNumber: payload.slotNumber,
      date: payload.date,
      startTime: payload.startTime,
      duration: payload.duration,
      totalPrice: payload.totalPrice,
      baseRate: payload.baseRate,
      status: 'CONFIRMED',
      confirmationCode: generateConfirmationCode(),
      createdAt: new Date().toISOString(),
    };

    return booking;
  },

  /**
   * Simulate DELETE /api/bookings/:id
   */
  async cancelBooking(bookingId: string): Promise<void> {
    await simulateDelay();
    // In production: return apiClient.delete(`/bookings/${bookingId}`);
    void bookingId;
  },
};
