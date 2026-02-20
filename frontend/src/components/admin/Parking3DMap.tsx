import { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useParkingData, ParkingSlot } from '../../hooks/useParkingData';
import FloorSelector from './FloorSelector';
import SlotLabel from './SlotLabel';

// Enhanced Car/Vehicle Model Component with realistic styling
const CarModel = ({ position, color, type }: { position: [number, number, number], color: string, type: 'car' | 'suv' | 'bike' | 'truck' }) => {
  const meshRef = useRef<THREE.Group>(null);

  // Subtle rotation animation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  // Bike model
  if (type === 'bike') {
    return (
      <group ref={meshRef} position={position}>
        {/* Bike body */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.3, 0.15, 0.6]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Wheels */}
        <mesh position={[0.15, 0.1, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.05]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0.15, 0.1, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.05]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
    );
  }

  // Truck model (larger)
  if (type === 'truck') {
    return (
      <group ref={meshRef} position={position}>
        {/* Truck cabin */}
        <mesh position={[0, 0.4, 0.5]}>
          <boxGeometry args={[1.1, 0.6, 1.0]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Truck cargo area */}
        <mesh position={[0, 0.4, -0.8]}>
          <boxGeometry args={[1.1, 0.7, 2.0]} />
          <meshStandardMaterial color={color} metalness={0.4} roughness={0.6} />
        </mesh>
        {/* Wheels */}
        {[
          [-0.55, 0.15, 0.7],
          [0.55, 0.15, 0.7],
          [-0.55, 0.15, -0.5],
          [0.55, 0.15, -0.5],
          [-0.55, 0.15, -1.5],
          [0.55, 0.15, -1.5]
        ].map((pos, idx) => (
          <mesh key={idx} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        ))}
      </group>
    );
  }

  // Car and SUV models
  const height = type === 'suv' ? 0.45 : 0.35;
  const width = type === 'suv' ? 1.0 : 0.9;
  const length = type === 'suv' ? 2.0 : 1.8;

  return (
    <group ref={meshRef} position={position}>
      {/* Car body */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[width, height, length]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Car roof */}
      <mesh position={[0, 0.5, -0.2]}>
        <boxGeometry args={[width * 0.8, 0.3, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Wheels */}
      {[
        [-width/2.5, 0.1, 0.6],
        [width/2.5, 0.1, 0.6],
        [-width/2.5, 0.1, -0.6],
        [width/2.5, 0.1, -0.6]
      ].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
      {/* Headlights */}
      <mesh position={[width/3, 0.3, 0.9]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-width/3, 0.3, 0.9]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

// Enhanced Parking Slot Component with hover effects
const ParkingSlotBox = ({ slot, onClick, isSelected }: { slot: ParkingSlot, onClick: () => void, isSelected: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Glowing animation for available slots
  useFrame((state) => {
    if (meshRef.current && !slot.occupied) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      if (material && 'emissiveIntensity' in material) {
        material.emissiveIntensity = Math.sin(state.clock.elapsedTime * 2) * 0.15 + 0.25;
      }
    }
  });

  // Realistic vehicle colors
  const carColors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#95a5a6'];
  const randomColor = carColors[Math.floor(Math.random() * carColors.length)];

  return (
    <group>
      {/* Parking slot base - Enhanced with hover effect */}
      <mesh
        ref={meshRef}
        position={slot.position}
        onClick={onClick}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <boxGeometry args={[2, 0.08, 3]} />
        <meshStandardMaterial 
          color={slot.occupied ? '#ef4444' : '#10b981'} 
          emissive={slot.occupied ? '#ef4444' : '#10b981'}
          emissiveIntensity={hovered ? 0.5 : (slot.occupied ? 0.15 : 0.3)}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Bold parking lines (realistic slot markings) */}
      <lineSegments position={[slot.position[0], slot.position[1] + 0.05, slot.position[2]]}>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(2.1, 0.08, 3.1)]} />
        <lineBasicMaterial 
          attach="material" 
          color={isSelected ? '#fbbf24' : (slot.occupied ? '#dc2626' : '#059669')} 
          linewidth={isSelected ? 4 : 2.5}
        />
      </lineSegments>

      {/* Slot number label - Enhanced visibility */}
      <Text
        position={[slot.position[0], slot.position[1] + 0.12, slot.position[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.35}
        color={slot.occupied ? '#ffffff' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {slot.slotNumber}
      </Text>

      {/* Car model if occupied - Realistic placement */}
      {slot.occupied && slot.vehicleType && (
        <CarModel 
          position={[slot.position[0], slot.position[1] + 0.08, slot.position[2]]} 
          color={randomColor}
          type={slot.vehicleType}
        />
      )}

      {/* Spotlight effect for selected slot */}
      {isSelected && (
        <pointLight 
          position={[slot.position[0], slot.position[1] + 3, slot.position[2]]} 
          color="#fbbf24" 
          intensity={3} 
          distance={6}
          decay={2}
        />
      )}

      {/* Hover highlight beam */}
      {hovered && !isSelected && (
        <pointLight 
          position={[slot.position[0], slot.position[1] + 2, slot.position[2]]} 
          color={slot.occupied ? "#fca5a5" : "#86efac"} 
          intensity={2} 
          distance={4}
          decay={2}
        />
      )}
    </group>
  );
};

// Row and Column Labels Component
const ParkingLabels = ({ slots }: { slots: ParkingSlot[] }) => {
  if (slots.length === 0) return null;

  // Get unique rows and columns
  const rows = Array.from(new Set(slots.map(s => s.row))).sort();
  const columns = Array.from(new Set(slots.map(s => s.column))).sort((a, b) => a - b);

  // Calculate label positions based on slot positions
  const getRowPosition = (row: string): [number, number, number] => {
    const rowSlots = slots.filter(s => s.row === row);
    if (rowSlots.length === 0) return [0, 0, 0];
    const avgZ = rowSlots.reduce((sum, s) => sum + s.position[2], 0) / rowSlots.length;
    const minX = Math.min(...rowSlots.map(s => s.position[0]));
    return [minX - 3, 0.2, avgZ];
  };

  const getColumnPosition = (col: number): [number, number, number] => {
    const colSlots = slots.filter(s => s.column === col);
    if (colSlots.length === 0) return [0, 0, 0];
    const avgX = colSlots.reduce((sum, s) => sum + s.position[0], 0) / colSlots.length;
    const minZ = Math.min(...colSlots.map(s => s.position[2]));
    return [avgX, 0.2, minZ - 3];
  };

  return (
    <group>
      {/* Row labels (A, B, C...) */}
      {rows.map(row => (
        <SlotLabel
          key={`row-${row}`}
          position={getRowPosition(row)}
          text={row}
          type="row"
          color="#fbbf24"
          size={0.7}
        />
      ))}

      {/* Column labels (1, 2, 3...) */}
      {columns.filter((_, idx) => idx % 2 === 0).map(col => (
        <SlotLabel
          key={`col-${col}`}
          position={getColumnPosition(col)}
          text={col.toString()}
          type="column"
          color="#60a5fa"
          size={0.6}
        />
      ))}
    </group>
  );
};

// Enhanced Main Scene Component with Labels
const ParkingScene = ({ slots, onSlotClick, selectedSlot, viewAngle }: { 
  slots: ParkingSlot[], 
  onSlotClick: (slot: ParkingSlot) => void,
  selectedSlot: string | null,
  viewAngle: 'top' | 'angle'
}) => {
  const controlsRef = useRef<any>();

  // Auto-adjust camera based on view angle
  useEffect(() => {
    if (controlsRef.current) {
      if (viewAngle === 'top') {
        controlsRef.current.object.position.set(0, 50, 0.1);
      } else {
        controlsRef.current.object.position.set(0, 35, 25);
      }
      controlsRef.current.update();
    }
  }, [viewAngle]);

  return (
    <>
      {/* Enhanced lighting for realistic appearance */}
      <ambientLight intensity={0.7} />
      
      {/* Main directional lights (simulating sun) */}
      <directionalLight position={[20, 30, 15]} intensity={1.2} castShadow />
      <directionalLight position={[-20, 25, -15]} intensity={0.6} />
      
      {/* Fill lights for better visibility */}
      <hemisphereLight args={['#87ceeb', '#545454', 0.4]} />
      
      {/* Spot lights for depth */}
      <spotLight position={[0, 40, 0]} angle={0.6} penumbra={0.8} intensity={0.4} castShadow />

      {/* Realistic ground (concrete texture) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#3f4652" 
          metalness={0.1} 
          roughness={0.9}
        />
      </mesh>

      {/* Parking area boundary */}
      <lineLoop position={[0, 0.1, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={4}
            array={new Float32Array([
              -45, 0, -35,
              45, 0, -35,
              45, 0, 35,
              -45, 0, 35
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#fbbf24" linewidth={3} />
      </lineLoop>

      {/* Grid lines (subtle, like in real parking lots) */}
      <gridHelper args={[90, 60, '#5a6169', '#4a5058']} position={[0, 0, 0]} />

      {/* Row and Column Labels */}
      <ParkingLabels slots={slots} />

      {/* Parking slots */}
      {slots.map((slot) => (
        <ParkingSlotBox 
          key={slot.id} 
          slot={slot} 
          onClick={() => onSlotClick(slot)}
          isSelected={selectedSlot === slot.id}
        />
      ))}

      {/* Camera and controls */}
      <PerspectiveCamera makeDefault position={[0, 35, 25]} fov={50} />
      <OrbitControls 
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={15}
        maxDistance={80}
        maxPolarAngle={Math.PI / 2.1}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
};

/**
 * Enhanced 3D Parking Map Component
 * Features:
 * - Multi-floor support with dropdown selector
 * - Realistic top-down parking visualization
 * - Row/Column labeling system
 * - Real-time occupancy updates
 * - Interactive slot selection with vehicle details
 * - Smooth animations and transitions
 */
const Parking3DMap = () => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showOccupiedOnly, setShowOccupiedOnly] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [viewAngle, setViewAngle] = useState<'top' | 'angle'>('angle');

  // Use custom hook for parking data management
  const { 
    floors, 
    selectedFloor, 
    setSelectedFloor, 
    currentFloorData, 
    totalStats,
    loading 
  } = useParkingData();

  const slots = currentFloorData?.slots || [];

  const handleSlotClick = (slot: ParkingSlot) => {
    setSelectedSlot(slot.id === selectedSlot ? null : slot.id);
  };

  const filteredSlots = slots.filter(slot => {
    if (showOccupiedOnly) return slot.occupied;
    if (showAvailableOnly) return !slot.occupied;
    return true;
  });

  const occupiedCount = slots.filter(s => s.occupied).length;
  const availableCount = slots.length - occupiedCount;
  const occupancyRate = ((occupiedCount / slots.length) * 100).toFixed(1);

  const selectedSlotData = slots.find(s => s.id === selectedSlot);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading parking data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header with occupancy count (like the image) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🗺️ Interactive 3D Parking Map</h2>
          <p className="text-sm text-gray-600 mt-1">Real-time multi-floor visualization • AI-powered occupancy detection</p>
          <div className="mt-2 inline-block bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg px-4 py-2">
            <span className="text-2xl font-bold text-gray-900">
              Available spots: <span className="text-green-600">{totalStats.available}</span> / {totalStats.total}
            </span>
          </div>
        </div>
        
        {/* View controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewAngle('angle')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewAngle === 'angle' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🎮 3D View
          </button>
          <button
            onClick={() => setViewAngle('top')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewAngle === 'top' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📐 Top View
          </button>
          <button
            onClick={() => setShowOccupiedOnly(!showOccupiedOnly)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showOccupiedOnly 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🚗 Occupied
          </button>
          <button
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showAvailableOnly 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ✅ Available
          </button>
        </div>
      </div>

      {/* Floor Selector */}
      <div className="mb-6">
        <FloorSelector 
          floors={floors}
          selectedFloor={selectedFloor}
          onFloorChange={setSelectedFloor}
        />
      </div>

      {/* Current Floor Stats */}
      {currentFloorData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
            <p className="text-sm text-blue-700 font-medium">Total Slots</p>
            <p className="text-3xl font-bold text-blue-900">{currentFloorData.totalSlots}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
            <p className="text-sm text-green-700 font-medium">Available</p>
            <p className="text-3xl font-bold text-green-900">{currentFloorData.availableSlots}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border-2 border-red-200">
            <p className="text-sm text-red-700 font-medium">Occupied</p>
            <p className="text-3xl font-bold text-red-900">{currentFloorData.occupiedSlots}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-2 border-purple-200">
            <p className="text-sm text-purple-700 font-medium">Occupancy Rate</p>
            <p className="text-3xl font-bold text-purple-900">
              {((currentFloorData.occupiedSlots / currentFloorData.totalSlots) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl overflow-hidden" style={{ height: '500px' }}>
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading 3D View...</p>
            </div>
          </div>
        }>
          <Canvas shadows>
            <ParkingScene 
              slots={filteredSlots} 
              onSlotClick={handleSlotClick}
              selectedSlot={selectedSlot}
              viewAngle={viewAngle}
            />
          </Canvas>
        </Suspense>

        {/* Enhanced Legend with vehicle types */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-gray-200">
          <p className="text-sm font-bold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">📊</span> Legend
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Slot Status:</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded border-2 border-green-700"></div>
                  <span className="text-xs text-gray-800 font-medium">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-red-500 rounded border-2 border-red-700"></div>
                  <span className="text-xs text-gray-800 font-medium">Occupied</span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <p className="text-xs font-semibold text-gray-600 mb-2">Vehicles:</p>
              <div className="space-y-1">
                <p className="text-xs">🚗 Cars • 🚙 SUVs</p>
                <p className="text-xs">🏍️ Bikes • 🚛 Trucks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time update indicator */}
        <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg px-4 py-2 shadow-lg flex items-center space-x-2 animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          <span className="text-sm font-semibold">Live Updates Active</span>
        </div>
      </div>

      {/* Selected Slot Info - Enhanced Details */}
      {selectedSlotData && (
        <div className="mt-6 bg-gradient-to-r from-primary-50 to-purple-50 border-2 border-primary-300 rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                  selectedSlotData.occupied ? 'bg-red-200' : 'bg-green-200'
                }`}>
                  {selectedSlotData.occupied ? '🚗' : '✅'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Slot {selectedSlotData.slotNumber}</h3>
                  <p className="text-sm text-gray-600">
                    Floor {selectedSlotData.floor} • Row {selectedSlotData.row} • Column {selectedSlotData.column}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                    selectedSlotData.occupied 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedSlotData.occupied ? 'Occupied' : 'Available'}
                  </span>
                </div>
                
                {selectedSlotData.vehicleType && (
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Vehicle Type</p>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium inline-block">
                      {selectedSlotData.vehicleType === 'car' ? '🚗 Car' : 
                       selectedSlotData.vehicleType === 'suv' ? '🚙 SUV' : 
                       selectedSlotData.vehicleType === 'truck' ? '🚛 Truck' : '🏍️ Bike'}
                    </span>
                  </div>
                )}
                
                {selectedSlotData.vehicleId && (
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Vehicle ID</p>
                    <p className="text-sm font-mono font-semibold text-gray-900">{selectedSlotData.vehicleId}</p>
                  </div>
                )}
                
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Position</p>
                  <p className="text-sm font-semibold text-gray-900">
                    X:{selectedSlotData.position[0].toFixed(1)} Z:{selectedSlotData.position[2].toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedSlot(null)}
              className="ml-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <span>✕</span>
              <span>Close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parking3DMap;
