import React from 'react';
import type { VenueSlot } from '../../types/booking';

interface SlotGridProps {
  slots: VenueSlot[];
  selectedSlotId: string;
  onSelectSlot: (slotId: string) => void;
}

/** Groups slots by their row label */
function groupByRow(slots: VenueSlot[]): Map<string, VenueSlot[]> {
  return slots.reduce((map, slot) => {
    const group = map.get(slot.row) ?? [];
    group.push(slot);
    map.set(slot.row, group);
    return map;
  }, new Map<string, VenueSlot[]>());
}

const SlotBox: React.FC<{
  slot: VenueSlot;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ slot, isSelected, onSelect }) => {
  const isOccupied = slot.status === 'OCCUPIED';

  let boxClass =
    'relative flex flex-col items-center justify-center rounded-lg border-2 h-14 w-[52px] text-[11px] font-bold transition-all duration-150 select-none ';

  if (isOccupied) {
    boxClass +=
      'bg-red-50 border-red-200 text-red-300 cursor-not-allowed opacity-60';
  } else if (isSelected) {
    boxClass +=
      'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105 cursor-pointer';
  } else {
    boxClass +=
      'bg-green-50 border-green-300 text-green-700 hover:bg-green-100 hover:border-green-500 cursor-pointer';
    if (slot.isPremium) {
      boxClass += ' ring-1 ring-yellow-400';
    }
  }

  return (
    <button
      type="button"
      disabled={isOccupied}
      onClick={() => !isOccupied && onSelect(slot.id)}
      title={
        isOccupied
          ? `${slot.number} — Occupied`
          : `${slot.number}${slot.isPremium ? ' (Premium)' : ''}`
      }
      className={boxClass}
    >
      <span className="leading-none">{slot.number.split('-')[1]}</span>
      {slot.isPremium && !isOccupied && (
        <span
          className={`text-[9px] leading-none mt-0.5 ${
            isSelected ? 'text-yellow-200' : 'text-yellow-500'
          }`}
        >
          ★
        </span>
      )}
    </button>
  );
};

const SlotGrid: React.FC<SlotGridProps> = ({ slots, selectedSlotId, onSelectSlot }) => {
  const rowGroups = groupByRow(slots);
  const availableCount = slots.filter((s) => s.status === 'AVAILABLE').length;

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <p className="font-semibold">No slots available for this venue.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500 pb-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-green-200 border border-green-400 inline-block" />
          Available ({availableCount})
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-100 border border-red-300 inline-block" />
          Occupied ({slots.length - availableCount})
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
          Selected
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-green-50 border border-green-300 ring-1 ring-yellow-400 inline-block" />
          Premium
        </div>
      </div>

      {/* Road / entry indicator */}
      <div className="flex items-center gap-2 py-1">
        <div className="flex-1 border-b-2 border-dashed border-gray-200" />
        <span className="text-[10px] font-black tracking-widest text-gray-300 uppercase">
          Entry ▸
        </span>
        <div className="flex-1 border-b-2 border-dashed border-gray-200" />
      </div>

      {/* Slot rows */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-block min-w-full">
          {Array.from(rowGroups.entries()).map(([row, rowSlots]) => (
            <div key={row} className="flex items-center gap-2 mb-2">
              {/* Row label */}
              <span className="w-5 text-center text-[11px] font-black text-gray-400 flex-shrink-0">
                {row}
              </span>

              {/* Slots — aisle after index 3 */}
              <div className="flex items-center gap-1.5">
                {rowSlots.map((slot, idx) => (
                  <React.Fragment key={slot.id}>
                    {idx === 4 && (
                      <div className="w-px self-stretch bg-gray-200 mx-1" />
                    )}
                    <SlotBox
                      slot={slot}
                      isSelected={selectedSlotId === slot.id}
                      onSelect={onSelectSlot}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlotGrid;
