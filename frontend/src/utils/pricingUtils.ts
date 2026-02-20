export interface PricingBreakdownLine {
  label: string;
  amount: number;
  type: 'charge' | 'modifier' | 'tax' | 'fee';
}

export interface PricingResult {
  baseRate: number;
  duration: number;
  priceModifier: number;
  subtotal: number;
  modifierAmount: number;
  tax: number;
  platformFee: number;
  total: number;
  breakdown: PricingBreakdownLine[];
}

const GST_RATE = 0.18;
const PLATFORM_FEE = 10;

export function calculatePrice(
  baseRate: number,
  duration: number,
  priceModifier: number = 1.0,
): PricingResult {
  const subtotal = baseRate * duration;
  const modifierAmount = Number(((priceModifier - 1) * subtotal).toFixed(2));
  const adjustedSubtotal = subtotal + modifierAmount;
  const tax = Number((adjustedSubtotal * GST_RATE).toFixed(2));
  const total = Number((adjustedSubtotal + tax + PLATFORM_FEE).toFixed(2));

  const breakdown: PricingBreakdownLine[] = [
    {
      label: `₹${baseRate}/hr × ${duration}h`,
      amount: subtotal,
      type: 'charge',
    },
  ];

  if (priceModifier > 1.0) {
    breakdown.push({
      label: `Premium slot (+${Math.round((priceModifier - 1) * 100)}%)`,
      amount: modifierAmount,
      type: 'modifier',
    });
  }

  breakdown.push(
    { label: 'GST (18%)', amount: tax, type: 'tax' },
    { label: 'Platform fee', amount: PLATFORM_FEE, type: 'fee' },
  );

  return {
    baseRate,
    duration,
    priceModifier,
    subtotal,
    modifierAmount,
    tax,
    platformFee: PLATFORM_FEE,
    total,
    breakdown,
  };
}

/** Format a 24-hr time string like "14:00" → "02:00 PM" */
export function formatTime(time24: string): string {
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12.toString().padStart(2, '0')}:${mStr} ${ampm}`;
}

/** Return end time string given start and duration in hours */
export function getEndTime(startTime: string, durationHours: number): string {
  const [hStr, mStr] = startTime.split(':');
  const totalMinutes = parseInt(hStr, 10) * 60 + parseInt(mStr, 10) + durationHours * 60;
  const endH = Math.floor(totalMinutes / 60) % 24;
  const endM = totalMinutes % 60;
  return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
}

/** Generate half-hourly time slot labels from 06:00 to 22:00 */
export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 6; h <= 21; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
    slots.push(`${h.toString().padStart(2, '0')}:30`);
  }
  slots.push('22:00');
  return slots;
}
