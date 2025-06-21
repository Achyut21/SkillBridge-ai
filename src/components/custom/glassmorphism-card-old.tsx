'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassmorphismCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'light' | 'medium' | 'heavy';
  hover?: boolean;
  glow?: boolean;
}

export function GlassmorphismCard({
  children,
  className,
  variant = 'medium',
  hover = true,
  glow = false,
}: GlassmorphismCardProps) {
  const variants = {
    light: 'backdrop-blur-lg bg-white/50 dark:bg-brand-900/5 border border-gray-200/50 dark:border-brand-500/10',
    medium: 'backdrop-blur-xl bg-white/70 dark:bg-brand-900/10 border border-gray-200/60 dark:border-brand-500/20',
    heavy: 'backdrop-blur-2xl bg-white/80 dark:bg-brand-900/20 border border-gray-200/70 dark:border-brand-500/30',
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-all duration-300',
        variants[variant],
        hover && 'hover:-translate-y-1 hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-400/30',
        glow && 'shadow-lg dark:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
        className
      )}
    >
      {children}
    </div>
  );
}
