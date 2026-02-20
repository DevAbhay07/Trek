import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { X, Calendar, Clock, Car, MapPin, Tag, Loader2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

import type { RootState, AppDispatch } from '../../store';
import type { VenueBooking, VenueBookingStatus } from '../../types/booking';
import { cancelVenueBooking } from '../../store/slices/bookingSlice';
import { bookingService } from '../../services/bookingService';
import { formatTime } from '../../utils/pricingUtils';

interface MyBookingsProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<VenueBookingStatus, string> = {
  CONFIRMED: 'bg-green-100 text-green-700 border-green-200',
  ACTIVE: 'bg-blue-100 text-blue-700 border-blue-200',
  COMPLETED: 'bg-gray-100 text-gray-500 border-gray-200',
  CANCELLED: 'bg-red-50 text-red-400 border-red-100',
};

const StatusBadge: React.FC<{ status: VenueBookingStatus }> = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wide ${STATUS_STYLES[status]}`}
  >
    {status}
  </span>
);

// ── Individual booking card ───────────────────────────────────────────────────
const BookingCard: React.FC<{ booking: VenueBooking }> = ({ booking }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isCancelling, setIsCancelling] = useState(false);

  const isCancellable = booking.status === 'CONFIRMED';

  const handleCancel = async () => {
    if (!window.confirm(`Cancel booking ${booking.confirmationCode}?`)) return;
    setIsCancelling(true);
    try {
      await bookingService.cancelBooking(booking.id);
      dispatch(cancelVenueBooking(booking.id));
      toast.success('Booking cancelled successfully.');
    } catch {
      toast.error('Failed to cancel. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0, padding: 0 }}
      transition={{ duration: 0.25 }}
      className={`bg-white border rounded-2xl p-5 space-y-3 ${
        booking.status === 'CANCELLED' ? 'opacity-50' : ''
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-black text-gray-900 text-sm leading-tight">{booking.venueName}</p>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <MapPin size={10} /> {booking.venueLocation}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar size={12} className="text-gray-400 flex-shrink-0" />
          {format(parseISO(booking.date), 'dd MMM yyyy')}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock size={12} className="text-gray-400 flex-shrink-0" />
          {formatTime(booking.startTime)} · {booking.duration}h
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Car size={12} className="text-gray-400 flex-shrink-0" />
          Slot {booking.slotNumber}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Tag size={12} className="text-gray-400 flex-shrink-0" />
          ₹{booking.totalPrice.toFixed(0)} paid
        </div>
      </div>

      {/* Reference + cancel */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <span className="font-mono text-xs font-bold text-gray-400 tracking-widest">
          {booking.confirmationCode}
        </span>
        {isCancellable && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling}
            className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            {isCancelling ? (
              <>
                <Loader2 size={11} className="animate-spin" /> Cancelling…
              </>
            ) : (
              'Cancel'
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const MyBookings: React.FC<MyBookingsProps> = ({ isOpen, onClose }) => {
  const venueBookings = useSelector((state: RootState) => state.booking.venueBookings);

  const activeBookings = venueBookings.filter(
    (b) => b.status === 'CONFIRMED' || b.status === 'ACTIVE',
  );
  const pastBookings = venueBookings.filter(
    (b) => b.status === 'COMPLETED' || b.status === 'CANCELLED',
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="my-bookings-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Slide-over panel */}
          <motion.div
            key="my-bookings-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#F8FAFC] z-50 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white flex-shrink-0">
              <div>
                <h2 className="text-lg font-black text-gray-900">My Bookings</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {venueBookings.length} booking{venueBookings.length !== 1 ? 's' : ''} total
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 min-h-0">
              {venueBookings.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
                    <BookOpen size={36} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-black text-gray-700 mb-2">No Bookings Yet</h3>
                  <p className="text-sm text-gray-400 max-w-xs">
                    Search for a venue and reserve a parking slot to see your bookings here.
                  </p>
                </div>
              ) : (
                <>
                  {/* Active / Confirmed */}
                  {activeBookings.length > 0 && (
                    <section>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                        Upcoming ({activeBookings.length})
                      </p>
                      <div className="space-y-3">
                        <AnimatePresence>
                          {activeBookings.map((b) => (
                            <BookingCard key={b.id} booking={b} />
                          ))}
                        </AnimatePresence>
                      </div>
                    </section>
                  )}

                  {/* Past */}
                  {pastBookings.length > 0 && (
                    <section>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                        Past ({pastBookings.length})
                      </p>
                      <div className="space-y-3">
                        <AnimatePresence>
                          {pastBookings.map((b) => (
                            <BookingCard key={b.id} booking={b} />
                          ))}
                        </AnimatePresence>
                      </div>
                    </section>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MyBookings;
