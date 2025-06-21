'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { GlassmorphismCard } from './glassmorphism-card';
import { TrendingUp } from 'lucide-react';

interface StatsCardProps {
  stat: {
    label: string;
    value: string | number;
    subValue: string;
    icon: any;
    trend?: string | null;
    suffix?: string;
  };
  index: number;
}

export function StatsCard({ stat, index }: StatsCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Stagger the animation appearance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);
    return () => clearTimeout(timer);
  }, [index]);
  // Animate number counting up
  useEffect(() => {
    if (!isVisible) return;
    
    const numericValue = parseInt(stat.value.toString()) || 0;
    if (numericValue === 0) {
      setCurrentValue(0);
      return;
    }
    
    const duration = 1000 + index * 200; // Stagger animation
    const steps = 30;
    const increment = numericValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setCurrentValue(numericValue);
        clearInterval(timer);
      } else {
        setCurrentValue(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [stat.value, index, isVisible]);
  
  return (
    <div className={cn(      "transition-all duration-500 transform",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
    )}>
      <GlassmorphismCard 
        variant="light" 
        hover 
        depth="double"
        className="group cursor-pointer overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-brand-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Floating icon animation */}
        <div className={cn(
          "absolute top-4 right-4 transition-all duration-500",
          isHovered ? "scale-110 rotate-12" : ""
        )}>
          <div className="relative">
            <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full scale-150 animate-pulse" />
            <stat.icon className="h-8 w-8 text-brand-500 relative z-10" />
          </div>
        </div>
        
        <div className="relative z-10">
          <p className="text-gray-500 dark:text-neutral-400 text-sm mb-1">{stat.label}</p>          <p className="text-3xl font-bold stat-number mb-1">
            {typeof stat.value === 'string' && !parseInt(stat.value) 
              ? stat.value 
              : currentValue + (stat.suffix || '')}
          </p>
          <p className="text-sm text-brand-600 dark:text-brand-400">{stat.subValue}</p>
          
          {stat.trend && (
            <div className={cn(
              "absolute bottom-4 right-4 flex items-center gap-1 text-xs",
              "transform transition-all duration-300",
              isHovered ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
            )}>
              <TrendingUp className="h-3 w-3" />
              {stat.trend}
            </div>
          )}
        </div>
      </GlassmorphismCard>
    </div>
  );
}