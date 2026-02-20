import React from 'react';
import { Text } from '@react-three/drei';

interface SlotLabelProps {
  position: [number, number, number];
  text: string;
  type: 'row' | 'column';
  color?: string;
  size?: number;
}

/**
 * 3D text label component for parking slot identification
 * Used for row letters (A, B, C...) and column numbers (1, 2, 3...)
 */
const SlotLabel: React.FC<SlotLabelProps> = ({ 
  position, 
  text, 
  type, 
  color = '#ffffff',
  size = 0.5 
}) => {
  return (
    <Text
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      fontSize={size}
      color={color}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.02}
      outlineColor="#000000"
      font="/fonts/Inter-Bold.woff"
    >
      {text}
    </Text>
  );
};

export default SlotLabel;
