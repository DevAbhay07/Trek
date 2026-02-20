import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import toast from 'react-hot-toast';
import {
  X,
  ChevronLeft,
  MapPin,
  CheckCircle2,
  Loader2,
  Clock,
  Calendar,
  Timer,
  Car,
  Tag,
} from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

import type { VenueSlot, VenueBooking } from '../../types/booking';
import { addVenueBooking } from '../../store/slices/bookingSlice';
import type { AppDispatch } from '../../store';
import { generateMockSlots } from '../../utils/mockSlotAvailability';
import {
  calculatePrice,
  formatTime,
  getEndTime,
  generateTimeSlots,
} from '../../utils/pricingUtils';
import { bookingService } from '../../services/bookingService';
import SlotGrid from './SlotGrid';

// ── Public interface used by UserHome ─────────────────────────────────────────
export interface VenueDetails {
  id: number;
  name: string;
  location: string;
  city: string;
  price: string;   // base rate per hour as string, e.g. "50"
  type: string;
  rating: number;
  slots: number;
  image: string;
}

// ── Zod schema ────────────────────────────────────────────────────────────────
const bookingSchema = z.object({
  date: z.date({ required_error: 'Please select a date' }),
  startTime: z.string().min(1, 'Please select a start time'),
  duration: z
    .number({ required_error: 'Please select a duration' })
    .min(1, 'Minimum 1 hour')
    .max(12, 'Maximum 12 hours'),
  selectedSlotId: z.string().min(1, 'Please select a parking slot'),
});

type FormValues = z.infer<typeof bookingSchema>;

// ── Static data ────────────────────────────────────────────────────────────────
const TIME_SLOTS = generateTimeSlots();
const DURATION_OPTIONS = [1, 2, 3, 4, 6, 8, 12] as const;

type ModalStep = 0 | 1 | 2 | 3;

const STEP_LABELS = ['Select Time', 'Choose Slot', 'Confirm'] as const;

// ── Step Progress Bar ─────────────────────────────────────────────────────────
const StepIndicator: React.FC<{ current: ModalStep }> = ({ current }) => (
  <div className="flex items-center mb-6">
    {STEP_LABELS.map((label, i) => (
      <React.Fragment key={label}>
        <div className="flex flex-col items-center gap-1">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
              i < current
                ? 'bg-green-500 text-white'
                : i === current
                ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {i < current ? '✓' : i + 1}
          </div>
          <span
            className={`text-[10px] font-semibold tracking-wide whitespace-nowrap ${
              i === current
                ? 'text-blue-600'
                : i < current
                ? 'text-green-600'
                : 'text-gray-400'
            }`}
          >
            {label}
          </span>
        </div>
        {i < STEP_LABELS.length - 1 && (
          <div
            className={`flex-1 h-0.5 mx-2 mb-4 transition-all duration-500 ${
              i < current ? 'bg-green-400' : 'bg-gray-200'
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ── Summary row helper ────────────────────────────────────────────────────────
const SummaryRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between">
    <span className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold uppercase tracking-wide">
      {icon} {label}
    </span>
    <span className="text-sm font-bold text-gray-800 max-w-[58%] text-right leading-snug">
      {value}
    </span>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue: VenueDetails;
  initialDate?: Date;
  onViewMyBookings?: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  venue,
  initialDate,
  onViewMyBookings,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [step, setStep] = useState<ModalStep>(0);
  const [slots, setSlots] = useState<VenueSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<VenueBooking | null>(null);

  const {
    control,
    watch,
    setValue,
    trigger,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: initialDate ?? new Date(),
      startTime: '',
      duration: 2,
      selectedSlotId: '',
    },
  });

  const selectedDate = watch('date');
  const selectedTime = watch('startTime');
  const selectedDuration = watch('duration');
  const selectedSlotId = watch('selectedSlotId');

  // Reset state when modal closes or venue changes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep(0);
        setSlots([]);
        setIsSubmitting(false);
        setConfirmedBooking(null);
        reset({
          date: initialDate ?? new Date(),
          startTime: '',
          duration: 2,
          selectedSlotId: '',
        });
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, initialDate, reset]);

  // Derived: selected slot object
  const selectedSlot = useMemo(
    () => slots.find((s) => s.id === selectedSlotId) ?? null,
    [slots, selectedSlotId],
  );

  // Derived: live pricing
  const pricing = useMemo(
    () =>
      calculatePrice(
        Number(venue.price),
        selectedDuration,
        selectedSlot?.priceModifier ?? 1.0,
      ),
    [venue.price, selectedDuration, selectedSlot],
  );

  // Derived: end time string
  const endTime = useMemo(
    () => (selectedTime ? getEndTime(selectedTime, selectedDuration) : null),
    [selectedTime, selectedDuration],
  );

  // ── Navigation ──────────────────────────────────────────────────────────
  const handleNextFromTime = async () => {
    const valid = await trigger(['date', 'startTime', 'duration']);
    if (!valid) return;
    const generated = generateMockSlots(String(venue.id), venue.slots);
    setSlots(generated);
    setValue('selectedSlotId', '');
    setStep(1);
  };

  const handleNextFromSlot = async () => {
    const valid = await trigger(['selectedSlotId']);
    if (!valid) return;
    setStep(2);
  };

  // ── Form Submission ─────────────────────────────────────────────────────
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const slot = slots.find((s) => s.id === data.selectedSlotId);
      const booking = await bookingService.createBooking({
        venueId: String(venue.id),
        venueName: venue.name,
        venueLocation: `${venue.location}, ${venue.city}`,
        slotId: data.selectedSlotId,
        slotNumber: slot?.number ?? data.selectedSlotId,
        date: format(data.date, 'yyyy-MM-dd'),
        startTime: data.startTime,
        duration: data.duration,
        totalPrice: pricing.total,
        baseRate: Number(venue.price),
      });

      dispatch(addVenueBooking(booking));
      setConfirmedBooking(booking);
      toast.success('Slot successfully reserved! 🎉', { duration: 5000 });
      setStep(3);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Booking failed. Please try again.';
      toast.error(message, { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Backdrop click — close unless submitting
  const handleOverlayClick = useCallback(() => {
    if (!isSubmitting) onClose();
  }, [isSubmitting, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
        >
          <motion.div
            key="modal-card"
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 36, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
              <div className="pr-4 overflow-hidden">
                <p className="text-[10px] font-black tracking-widest text-blue-500 uppercase mb-0.5">
                  Book a Slot
                </p>
                <h2 className="text-lg font-black text-gray-900 truncate">{venue.name}</h2>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin size={11} />
                  {venue.location}, {venue.city}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors flex-shrink-0 mt-0.5"
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Scrollable Body ───────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
              {/* Step progress (hidden on success screen) */}
              {step < 3 && <StepIndicator current={step} />}

              <AnimatePresence mode="wait">
                {/* ── STEP 0: Select Time ─────────────────────────────── */}
                {step === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {/* Date */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-black text-gray-600 uppercase tracking-widest mb-2">
                        <Calendar size={12} /> Date
                      </label>
                      <Controller
                        control={control}
                        name="date"
                        render={({ field }) => (
                          <DatePicker
                            selected={field.value}
                            onChange={field.onChange}
                            minDate={new Date()}
                            dateFormat="dd MMM yyyy"
                            wrapperClassName="w-full"
                            className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition-all cursor-pointer ${
                              errors.date
                                ? 'border-red-400 bg-red-50'
                                : 'border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white'
                            }`}
                          />
                        )}
                      />
                      {errors.date && (
                        <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
                      )}
                    </div>

                    {/* Start Time */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-black text-gray-600 uppercase tracking-widest mb-2">
                        <Clock size={12} /> Start Time
                      </label>
                      <Controller
                        control={control}
                        name="startTime"
                        render={({ field }) => (
                          <select
                            {...field}
                            className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none cursor-pointer transition-all ${
                              errors.startTime
                                ? 'border-red-400 bg-red-50'
                                : 'border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white'
                            }`}
                          >
                            <option value="">Select arrival time…</option>
                            {TIME_SLOTS.map((t) => (
                              <option key={t} value={t}>
                                {formatTime(t)}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                      {errors.startTime && (
                        <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>
                      )}
                    </div>

                    {/* Duration chips */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-black text-gray-600 uppercase tracking-widest mb-2">
                        <Timer size={12} /> Duration
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {DURATION_OPTIONS.map((h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setValue('duration', h, { shouldValidate: true })}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all duration-150 ${
                              selectedDuration === h
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                            }`}
                          >
                            {h}h
                          </button>
                        ))}
                      </div>
                      {errors.duration && (
                        <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>
                      )}
                    </div>

                    {/* Live price estimate */}
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
                      <div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                          Estimated Total
                        </p>
                        {selectedTime && endTime && (
                          <p className="text-xs text-blue-500 mt-0.5">
                            {formatTime(selectedTime)} → {formatTime(endTime)}
                          </p>
                        )}
                        <p className="text-[10px] text-blue-300 mt-0.5">incl. GST + platform fee</p>
                      </div>
                      <span className="text-2xl font-black text-blue-700">
                        ₹{pricing.total.toFixed(0)}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 1: Choose Slot ──────────────────────────────── */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm text-gray-500 mb-4">
                      Select an available slot below.{' '}
                      <span className="text-yellow-600 font-semibold">★ Premium</span> slots carry
                      a 20% surcharge.
                    </p>

                    <SlotGrid
                      slots={slots}
                      selectedSlotId={selectedSlotId}
                      onSelectSlot={(id) =>
                        setValue('selectedSlotId', id, { shouldValidate: true })
                      }
                    />

                    {/* Selected slot callout */}
                    <AnimatePresence>
                      {selectedSlot && (
                        <motion.div
                          key={selectedSlot.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="mt-4 flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4"
                        >
                          <Car size={18} className="text-blue-500 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-black text-gray-900">
                              Slot {selectedSlot.number}
                              {selectedSlot.isPremium && (
                                <span className="ml-1.5 text-yellow-500 font-bold">★ Premium</span>
                              )}
                            </p>
                            <p className="text-xs text-blue-500 mt-0.5">
                              Updated total: ₹{pricing.total.toFixed(0)}
                            </p>
                          </div>
                          <Tag size={14} className="text-blue-400" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {errors.selectedSlotId && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors.selectedSlotId.message}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* ── STEP 2: Confirm ──────────────────────────────────── */}
                {step === 2 && selectedSlot && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Summary */}
                    <div className="bg-gray-50 rounded-2xl p-5 space-y-3 mb-5">
                      <SummaryRow
                        icon={<Calendar size={13} />}
                        label="Date"
                        value={format(selectedDate, 'dd MMM yyyy, EEEE')}
                      />
                      <SummaryRow
                        icon={<Clock size={13} />}
                        label="Time"
                        value={`${selectedTime ? formatTime(selectedTime) : '-'} → ${endTime ? formatTime(endTime) : '-'}`}
                      />
                      <SummaryRow
                        icon={<Timer size={13} />}
                        label="Duration"
                        value={`${selectedDuration} hour${selectedDuration > 1 ? 's' : ''}`}
                      />
                      <SummaryRow
                        icon={<Car size={13} />}
                        label="Slot"
                        value={`${selectedSlot.number}${selectedSlot.isPremium ? ' ★ Premium' : ''}`}
                      />
                    </div>

                    {/* Pricing breakdown */}
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                      Price Breakdown
                    </p>
                    <div className="space-y-2 mb-4">
                      {pricing.breakdown.map((line, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span
                            className={
                              line.type === 'tax' || line.type === 'fee'
                                ? 'text-gray-400'
                                : 'text-gray-700'
                            }
                          >
                            {line.label}
                          </span>
                          <span
                            className={
                              line.type === 'modifier'
                                ? 'text-yellow-600 font-bold'
                                : line.type === 'tax' || line.type === 'fee'
                                ? 'text-gray-400'
                                : 'text-gray-800 font-semibold'
                            }
                          >
                            +₹{line.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t-2 border-dashed border-gray-200 pt-3 flex items-center justify-between">
                      <span className="text-base font-black text-gray-900">Total Payable</span>
                      <span className="text-2xl font-black text-blue-700">
                        ₹{pricing.total.toFixed(0)}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 3: Success ──────────────────────────────────── */}
                {step === 3 && confirmedBooking && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, scale: 0.93 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
                    className="flex flex-col items-center text-center py-4"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 18 }}
                    >
                      <CheckCircle2 size={64} className="text-green-500 mb-4" />
                    </motion.div>

                    <h3 className="text-2xl font-black text-gray-900 mb-1">
                      Booking Confirmed!
                    </h3>
                    <p className="text-gray-400 text-sm mb-5">
                      Your slot has been reserved successfully.
                    </p>

                    {/* Reference code */}
                    <div className="bg-gray-900 text-green-400 font-mono text-xl font-black px-8 py-4 rounded-2xl mb-6 tracking-[0.2em] shadow-inner">
                      {confirmedBooking.confirmationCode}
                    </div>

                    {/* Detail card */}
                    <div className="w-full bg-gray-50 rounded-2xl p-4 space-y-2.5 text-left">
                      <SummaryRow
                        icon={<MapPin size={13} />}
                        label="Venue"
                        value={confirmedBooking.venueName}
                      />
                      <SummaryRow
                        icon={<Car size={13} />}
                        label="Slot"
                        value={confirmedBooking.slotNumber}
                      />
                      <SummaryRow
                        icon={<Calendar size={13} />}
                        label="Date"
                        value={format(new Date(confirmedBooking.date), 'dd MMM yyyy')}
                      />
                      <SummaryRow
                        icon={<Clock size={13} />}
                        label="Time"
                        value={`${formatTime(confirmedBooking.startTime)} · ${confirmedBooking.duration}h`}
                      />
                      <SummaryRow
                        icon={<Tag size={13} />}
                        label="Paid"
                        value={`₹${confirmedBooking.totalPrice.toFixed(0)}`}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Footer ───────────────────────────────────────────────── */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-white">
              {step === 0 && (
                <button
                  type="button"
                  onClick={handleNextFromTime}
                  className="w-full bg-blue-600 text-white font-black py-3.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all text-sm"
                >
                  Find Available Slots →
                </button>
              )}

              {step === 1 && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all flex-shrink-0"
                  >
                    <ChevronLeft size={15} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextFromSlot}
                    className="flex-1 bg-blue-600 text-white font-black py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all text-sm"
                  >
                    Continue →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all flex-shrink-0 disabled:opacity-40"
                  >
                    <ChevronLeft size={15} /> Back
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Processing…
                      </>
                    ) : (
                      `🔒 Confirm & Pay ₹${pricing.total.toFixed(0)}`
                    )}
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onViewMyBookings?.();
                      onClose();
                    }}
                    className="flex-1 border-2 border-blue-200 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
                  >
                    View My Bookings
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-900 text-white font-black py-3 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all text-sm"
                  >
                    Done ✓
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
