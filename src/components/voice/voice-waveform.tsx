'use client';

import { useEffect, useState } from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
  color?: string;
}

export function VoiceWaveform({ isActive, color = 'brand' }: VoiceWaveformProps) {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    // Initialize bars with random heights
    setBars(Array(20).fill(0).map(() => Math.random()));
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setBars(prev => 
        prev.map(() => 0.2 + Math.random() * 0.8)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="flex items-center justify-center gap-1 h-16 px-4">
      {bars.map((height, i) => (
        <div
          key={i}
          className={`w-1 bg-gradient-to-t from-${color}-600 to-${color}-400 rounded-full transition-all duration-150`}
          style={{
            height: isActive 
              ? `${20 + height * 30}px`
              : '4px',
            opacity: isActive ? 0.8 + height * 0.2 : 0.3,
            transform: `scaleY(${isActive ? 1 : 0.2})`,
          }}
        />
      ))}
    </div>
  );
}