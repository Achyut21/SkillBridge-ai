'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassmorphismCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'light' | 'medium' | 'heavy';
  hover?: boolean;
  glow?: boolean;
  depth?: 'single' | 'double' | 'triple';
  pulse?: boolean;
  tilt?: boolean;
}

export function GlassmorphismCard({
  children,
  className,
  variant = 'medium',
  hover = true,
  glow = false,
  depth = 'single',
  pulse = false,
  tilt = false,
}: GlassmorphismCardProps) {
  const variants = {
    light: 'backdrop-blur-lg bg-white/50 dark:bg-brand-900/5 border border-gray-200/50 dark:border-brand-500/10',
    medium: 'backdrop-blur-xl bg-white/70 dark:bg-brand-900/10 border border-gray-200/60 dark:border-brand-500/20',
    heavy: 'backdrop-blur-2xl bg-white/80 dark:bg-brand-900/20 border border-gray-200/70 dark:border-brand-500/30',
  };

  const depthStyles = {
    single: 'relative',
    double: 'relative before:absolute before:inset-0 before:backdrop-blur-md before:bg-white/30 dark:before:bg-brand-900/10 before:rounded-2xl before:scale-[0.98] before:-z-10 before:opacity-50',
    triple: 'relative before:absolute before:inset-0 before:backdrop-blur-md before:bg-white/20 dark:before:bg-brand-900/10 before:rounded-2xl before:scale-[0.98] before:-z-10 before:opacity-50 after:absolute after:inset-0 after:backdrop-blur-sm after:bg-white/10 dark:after:bg-brand-900/5 after:rounded-2xl after:scale-[0.96] after:-z-20 after:opacity-30'
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-all duration-500 transform-gpu',
        variants[variant],
        depthStyles[depth],
        hover && 'hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-500/10 dark:hover:shadow-brand-500/20',
        glow && 'shadow-lg shadow-brand-500/10 dark:shadow-brand-500/20',
        pulse && 'animate-subtle-pulse',
        tilt && 'card-tilt',
        className
      )}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-400/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}