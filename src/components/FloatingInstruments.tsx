import React from 'react';
import { Music2, Triangle, Drum, Guitar, Music } from 'lucide-react';
import FleeingInstrument from './FleeingInstrument';

const getRandomPosition = () => {
  const randomValue = Math.random() * 100;
  return `${randomValue}%`;
};

const instruments = [
  ...Array(4).fill(null).map((_, i) => ({
    Icon: Music2,
    className: `absolute text-white/30 w-16 h-16`,
    id: `accordion-${i}`,
    initialPosition: {
      top: getRandomPosition(),
      left: getRandomPosition()
    }
  })),
  ...Array(4).fill(null).map((_, i) => ({
    Icon: Triangle,
    className: `absolute text-white/30 w-12 h-12`,
    id: `triangle-${i}`,
    initialPosition: {
      top: getRandomPosition(),
      left: getRandomPosition()
    }
  })),
  ...Array(4).fill(null).map((_, i) => ({
    Icon: Drum,
    className: `absolute text-white/30 w-14 h-14`,
    id: `zabumba-${i}`,
    initialPosition: {
      top: getRandomPosition(),
      left: getRandomPosition()
    }
  })),
  ...Array(3).fill(null).map((_, i) => ({
    Icon: Guitar,
    className: `absolute text-white/30 w-10 h-10`,
    id: `guitar-${i}`,
    initialPosition: {
      top: getRandomPosition(),
      left: getRandomPosition()
    }
  })),
  ...Array(3).fill(null).map((_, i) => ({
    Icon: Music,
    className: `absolute text-white/30 w-10 h-10`,
    id: `music-${i}`,
    initialPosition: {
      top: getRandomPosition(),
      left: getRandomPosition()
    }
  }))
].flat();

const FloatingInstruments = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {instruments.map((instrument) => (
        <FleeingInstrument
          key={instrument.id}
          Icon={instrument.Icon}
          className={`${instrument.className}`}
          id={instrument.id}
          initialPosition={instrument.initialPosition}
        />
      ))}
    </div>
  );
};

export default FloatingInstruments;