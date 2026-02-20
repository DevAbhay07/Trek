import { useState, useEffect } from 'react';

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  row: string;
  column: number;
  position: [number, number, number];
  status: 'available' | 'occupied';
  occupied: boolean;
  vehicleType?: 'car' | 'suv' | 'bike' | 'truck';
  vehicleId?: string;
  floor: number;
}

export interface FloorData {
  floorNumber: number;
  floorName: string;
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  slots: ParkingSlot[];
}

/**
 * Custom hook to manage parking data across multiple floors
 * This simulates real-time parking data with mock data
 * In production, this would fetch from Redux store or API
 */
export const useParkingData = () => {
  const [floors, setFloors] = useState<FloorData[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Generate realistic parking layout similar to the image
  const generateFloorLayout = (floorNumber: number, rows: number, cols: number): ParkingSlot[] => {
    const slots: ParkingSlot[] = [];
    const vehicleTypes: ('car' | 'suv' | 'bike' | 'truck')[] = ['car', 'car', 'car', 'suv', 'bike', 'truck'];
    
    // Create a realistic parking layout with aisles
    const spacing = 2.5;
    const aisleWidth = 5;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Skip some positions for aisles (create realistic paths)
        const isAisle = (col % 8 === 3 || col % 8 === 7);
        if (isAisle) continue;
        
        // Realistic occupancy rate: 60-75%
        const occupied = Math.random() > 0.35;
        const rowLetter = String.fromCharCode(65 + row);
        const actualCol = Math.floor(col - Math.floor(col / 8) * 1); // Adjust for aisles
        
        // Calculate position with aisles
        let xPos = (col - cols / 2) * spacing;
        if (col > 3) xPos += aisleWidth / 2;
        if (col > 7) xPos += aisleWidth / 2;
        
        slots.push({
          id: `floor-${floorNumber}-slot-${row}-${col}`,
          slotNumber: `${rowLetter}${actualCol + 1}`,
          row: rowLetter,
          column: actualCol + 1,
          position: [xPos, 0, (row - rows / 2) * spacing],
          status: occupied ? 'occupied' : 'available',
          occupied,
          vehicleType: occupied ? vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)] : undefined,
          vehicleId: occupied ? `VEH-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : undefined,
          floor: floorNumber
        });
      }
    }
    
    return slots;
  };

  // Initialize floors with mock data
  useEffect(() => {
    const initializeFloors = () => {
      setLoading(true);
      
      const floorConfigs = [
        { number: 1, name: 'Ground Floor', rows: 12, cols: 32 },
        { number: 2, name: 'First Floor', rows: 12, cols: 32 },
        { number: 3, name: 'Second Floor', rows: 10, cols: 28 },
        { number: 4, name: 'Rooftop', rows: 8, cols: 20 }
      ];
      
      const generatedFloors: FloorData[] = floorConfigs.map(config => {
        const slots = generateFloorLayout(config.number, config.rows, config.cols);
        const occupied = slots.filter(s => s.occupied).length;
        const available = slots.length - occupied;
        
        return {
          floorNumber: config.number,
          floorName: config.name,
          totalSlots: slots.length,
          availableSlots: available,
          occupiedSlots: occupied,
          slots
        };
      });
      
      setFloors(generatedFloors);
      setLoading(false);
    };
    
    initializeFloors();
  }, []);

  // Simulate real-time updates (in production, this would be WebSocket or polling)
  useEffect(() => {
    const interval = setInterval(() => {
      setFloors(prevFloors => {
        return prevFloors.map(floor => {
          // Randomly update 1-2 slots per floor
          const updatedSlots = floor.slots.map(slot => {
            if (Math.random() > 0.98) { // 2% chance of change
              const newOccupied = !slot.occupied;
              return {
                ...slot,
                occupied: newOccupied,
                status: newOccupied ? 'occupied' as const : 'available' as const,
                vehicleType: newOccupied ? (['car', 'suv', 'bike', 'truck'][Math.floor(Math.random() * 4)] as any) : undefined,
                vehicleId: newOccupied ? `VEH-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : undefined
              };
            }
            return slot;
          });
          
          const occupied = updatedSlots.filter(s => s.occupied).length;
          const available = updatedSlots.length - occupied;
          
          return {
            ...floor,
            slots: updatedSlots,
            occupiedSlots: occupied,
            availableSlots: available
          };
        });
      });
    }, 8000); // Update every 8 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getCurrentFloorData = (): FloorData | undefined => {
    return floors.find(f => f.floorNumber === selectedFloor);
  };

  const getTotalStats = () => {
    const total = floors.reduce((acc, floor) => acc + floor.totalSlots, 0);
    const available = floors.reduce((acc, floor) => acc + floor.availableSlots, 0);
    const occupied = floors.reduce((acc, floor) => acc + floor.occupiedSlots, 0);
    
    return { total, available, occupied };
  };

  return {
    floors,
    selectedFloor,
    setSelectedFloor,
    currentFloorData: getCurrentFloorData(),
    totalStats: getTotalStats(),
    loading
  };
};
