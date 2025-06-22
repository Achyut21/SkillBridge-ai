'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassmorphismCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'light' | 'medium' | 'heavy' | 'subtle' | 'default';
  hover?: boolean;
  glow?: boolean;
  depth?: 'single' | 'double' | 'triple';
  pulse?: boolean;
  tilt?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  animated?: boolean;
  gradient?: boolean;
  neural?: boolean;
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
  onClick,
  onMouseEnter,
  onMouseLeave,
  animated = true,
  gradient = false,
  neural = false,
}: GlassmorphismCardProps) {
  const variants = {
    light: 'backdrop-blur-lg bg-white/50 dark:bg-brand-900/5 border border-gray-200/50 dark:border-brand-500/10',
    medium: 'backdrop-blur-xl bg-white/70 dark:bg-brand-900/10 border border-gray-200/60 dark:border-brand-500/20',
    heavy: 'backdrop-blur-2xl bg-white/80 dark:bg-brand-900/20 border border-gray-200/70 dark:border-brand-500/30',
    subtle: 'backdrop-blur-md bg-white/40 dark:bg-brand-900/5 border border-gray-200/30 dark:border-brand-500/10',
    default: 'backdrop-blur-xl bg-white/60 dark:bg-brand-900/15 border border-gray-200/50 dark:border-brand-500/20',
  };

  const depthStyles = {
    single: 'relative',
    double: 'relative before:absolute before:inset-0 before:backdrop-blur-md before:bg-white/30 dark:before:bg-brand-900/10 before:rounded-2xl before:scale-[0.98] before:-z-10 before:opacity-50',
    triple: 'relative before:absolute before:inset-0 before:backdrop-blur-md before:bg-white/20 dark:before:bg-brand-900/10 before:rounded-2xl before:scale-[0.98] before:-z-10 before:opacity-50 after:absolute after:inset-0 after:backdrop-blur-sm after:bg-white/10 dark:after:bg-brand-900/5 after:rounded-2xl after:scale-[0.96] after:-z-20 after:opacity-30'
  };

  const MotionCard = animated ? motion.div : 'div';

  return (
    <MotionCard
      className={cn(
        'rounded-2xl p-6 transition-all duration-500 transform-gpu relative overflow-hidden',
        variants[variant],
        depthStyles[depth],
        hover && 'hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-500/10 dark:hover:shadow-brand-500/20',
        glow && 'shadow-lg shadow-brand-500/10 dark:shadow-brand-500/20',
        pulse && 'animate-subtle-pulse',
        tilt && 'card-tilt',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...(animated && {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      })}
    >
      {/* Enhanced gradient background */}
      {gradient && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-400/10 via-brand-500/5 to-brand-600/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}

      {/* Neural network pattern */}
      {neural && (
        <div className="absolute inset-0 rounded-2xl opacity-5 dark:opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 400 400">
            <defs>
              <pattern id="neural" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="2" fill="currentColor" opacity="0.3">
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
                </circle>
                <line x1="25" y1="25" x2="50" y2="25" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                <line x1="25" y1="25" x2="25" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#neural)" />
          </svg>
        </div>
      )}

      {/* Enhanced inner glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-400/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Enhanced floating particles */}
      {hover && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-brand-400/30 rounded-full animate-float"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </MotionCard>
  );
}
