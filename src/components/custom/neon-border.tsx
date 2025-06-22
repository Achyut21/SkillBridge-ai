'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface NeonBorderProps {
  children: ReactNode;
  className?: string;
  color?: 'brand' | 'green' | 'blue' | 'red' | 'yellow' | 'purple' | 'cyan' | 'gradient' | 'gray';
  rounded?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function NeonBorder({
  children,
  className,
  color = 'brand',
  rounded = 'rounded-2xl',
  onMouseEnter,
  onMouseLeave,
}: NeonBorderProps) {
  const colorClasses = {
    brand: 'border-purple-500/30 shadow-soft',
    green: 'border-green-500/30',
    blue: 'border-blue-500/30',
    red: 'border-red-500/30',
    yellow: 'border-yellow-500/30',
    purple: 'border-purple-500/30 shadow-soft',
    cyan: 'border-cyan-500/30',
    gradient: 'border-purple-500/30 shadow-soft',
    gray: 'border-gray-500/30',
  };

  return (
    <div
      className={cn(
        'relative p-[1px] border transition-smooth no-flicker',
        rounded,
        colorClasses[color],
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={cn('relative bg-background', rounded)}>
        {children}
      </div>
    </div>
  );
}