import React from 'react';

interface FloorSelectorProps {
  floors: Array<{
    floorNumber: number;
    floorName: string;
    totalSlots: number;
    availableSlots: number;
    occupiedSlots: number;
  }>;
  selectedFloor: number;
  onFloorChange: (floorNumber: number) => void;
}

/**
 * Floor selector dropdown component
 * Allows users to switch between different parking floors
 */
const FloorSelector: React.FC<FloorSelectorProps> = ({ floors, selectedFloor, onFloorChange }) => {
  const currentFloor = floors.find(f => f.floorNumber === selectedFloor);
  
  return (
    <div className="relative inline-block w-full md:w-auto">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Floor
      </label>
      <select
        value={selectedFloor}
        onChange={(e) => onFloorChange(Number(e.target.value))}
        className="w-full md:w-64 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all cursor-pointer text-gray-900 font-medium"
      >
        {floors.map((floor) => (
          <option key={floor.floorNumber} value={floor.floorNumber}>
            🏢 {floor.floorName} - {floor.availableSlots}/{floor.totalSlots} available
          </option>
        ))}
      </select>
      
      {/* Floor info card */}
      {currentFloor && (
        <div className="mt-3 p-3 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-semibold">{currentFloor.availableSlots} Free</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-700 font-semibold">{currentFloor.occupiedSlots} Occupied</span>
              </div>
            </div>
            <div className="text-gray-600 font-medium">
              {((currentFloor.occupiedSlots / currentFloor.totalSlots) * 100).toFixed(0)}% Full
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorSelector;
