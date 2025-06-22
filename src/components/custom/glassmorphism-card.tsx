'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassmorphismCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'light' | 'medium' | 'heavy' | 'subtle' | 'default' | 'single' | 'double';
  hover?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  // Legacy props for compatibility
  depth?: 'single' | 'double' | 'triple' | string;
  glow?: boolean;
  pulse?: boolean;
  tilt?: boolean;
}

export function GlassmorphismCard({
  children,
  className,
  variant = 'medium',
  hover = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: GlassmorphismCardProps) {
  const variants = {
    light: 'glass-light',
    medium: 'glass',
    heavy: 'glass-heavy',
    subtle: 'glass-light',
    default: 'glass',
    single: 'glass-light',
    double: 'glass',
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-smooth no-flicker',
        variants[variant],
        hover && 'interactive-scale shadow-soft hover:shadow-soft-lg',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}