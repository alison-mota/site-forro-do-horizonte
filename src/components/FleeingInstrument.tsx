import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FleeingInstrumentProps {
  Icon: React.ElementType;
  className: string;
  id: string;
  initialPosition: {
    top: string;
    left: string;
  };
}

const FleeingInstrument: React.FC<FleeingInstrumentProps> = ({ 
  Icon, 
  className, 
  id, 
  initialPosition 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Generate random animation parameters
  const duration = 30 + Math.random() * 30; // Random duration between 30-60s
  const delay = Math.random() * 5; // Random delay between 0-5s

  // Create a more complex path with multiple points
  const pathPoints = Array(8).fill(0).map(() => ({
    x: Math.random() * window.innerWidth - window.innerWidth/2,
    y: Math.random() * window.innerHeight - window.innerHeight/2
  }));

  const floatAnimation = {
    x: [
      0,
      ...pathPoints.map(point => point.x),
      0
    ],
    y: [
      0,
      ...pathPoints.map(point => point.y),
      0
    ],
    rotate: [
      0,
      ...Array(pathPoints.length).fill(0).map(() => Math.random() * 720 - 360),
      0
    ]
  };

  return (
    <motion.div
      className={`${className} transition-colors duration-300`}
      style={{
        ...initialPosition,
        position: 'absolute',
        color: isHovered ? '#FFC157' : 'inherit',
      }}
      animate={floatAnimation}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        times: Array(pathPoints.length + 2).fill(0).map((_, i) => i / (pathPoints.length + 1))
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.2 }}
    >
      <Icon />
    </motion.div>
  );
};

export default FleeingInstrument;