import type { VenueSlot } from '../types/booking';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F']
const SLOTS_PER_ROW = 8;

/**
 * Generates a realistic mock parking slot grid.
 * Occupancy rate is seeded by venueId so the same venue always shows
 * the same layout within a session, but differs between venues.
 */
export function generateMockSlots(venueId: string, slotCap: number = 48): VenueSlot[] {
  // Deterministic-ish seed per venue so layout is consistent per session
  const seed = venueId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const rng = (index: number): number => {
    const x = Math.sin(seed + index) * 10_000;
    return x - Math.floor(x);
  };

  const totalSlots = Math.min(slotCap, ROWS.length * SLOTS_PER_ROW);
  const slots: VenueSlot[] = [];

  for (let i = 0; i < totalSlots; i++) {
    const rowIndex = Math.floor(i / SLOTS_PER_ROW);
    const slotNum = (i % SLOTS_PER_ROW) + 1;
    const row = ROWS[rowIndex];
    const number = `${row}-${slotNum.toString().padStart(2, '0')}`;

    // ~68% occupancy, varies per slot
    const isOccupied = rng(i) < 0.68;
    // Premium slots: first slot in each row + every 9th slot overall
    const isPremium = slotNum === 1 || i % 9 === 0;

    slots.push({
      id: `slot-${venueId}-${number}`,
      number,
      row,
      status: (isOccupied ? 'OCCUPIED' : 'AVAILABLE') as 'OCCUPIED' | 'AVAILABLE',
      priceModifier: isPremium ? 1.2 : 1.0,
      isPremium,
    });
  }

  return slots;
}
