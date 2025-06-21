'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface NeonBorderProps {
  children: ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
  animate?: boolean;
}

export function NeonBorder({
  children,
  className,
  intensity = 'subtle',
  animate = false,
}: NeonBorderProps) {
  const intensities = {
    subtle: 'shadow-md dark:shadow-[0_0_15px_rgba(168,85,247,0.2)] border-brand-300 dark:border-brand-500/30',
    medium: 'shadow-lg dark:shadow-[0_0_25px_rgba(168,85,247,0.3)] border-brand-400 dark:border-brand-500/40',
    strong: 'shadow-xl dark:shadow-[0_0_35px_rgba(168,85,247,0.4)] border-brand-500 dark:border-brand-500/50',
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl p-[2px] transition-all duration-300',
        intensities[intensity],
        animate && 'animate-subtle-pulse',
        className
      )}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-400 to-brand-600 dark:from-brand-600 dark:to-brand-700 opacity-10 dark:opacity-20" />
      <div className="relative rounded-2xl bg-background">
        {children}
      </div>
    </div>
  );
}
