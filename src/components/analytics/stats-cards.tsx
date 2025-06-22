'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Clock,
  ArrowUp,
  ArrowDown,
  Activity,
  Zap
} from 'lucide-react';
import { GlassmorphismCard } from '@/components/custom/glassmorphism-card';

interface StatCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  subtitle?: string;
  sparklineData?: number[];
}

interface StatsCardsProps {
  stats?: StatCard[];
  className?: string;
}

const defaultStats: StatCard[] = [
  {
    id: 'skill-score',
    title: 'Skill Score',
    value: '87/100',
    change: 12,
    changeType: 'increase',
    icon: <Zap className="w-5 h-5" />,
    subtitle: 'Top 15% in your field',
    sparklineData: [65, 68, 72, 75, 80, 82, 87]
  },
  {
    id: 'completed-paths',
    title: 'Completed Paths',
    value: 24,
    change: 8.5,
    changeType: 'increase',
    icon: <Target className="w-5 h-5" />,
    subtitle: '3 more than avg user'
  },
  {
    id: 'learning-streak',
    title: 'Learning Streak',
    value: '45 days',
    change: 0,
    changeType: 'neutral',
    icon: <Activity className="w-5 h-5" />,
    subtitle: 'Personal best!'
  },
  {
    id: 'market-demand',
    title: 'Market Demand',
    value: 'High',
    change: 15,
    changeType: 'increase',
    icon: <TrendingUp className="w-5 h-5" />,
    subtitle: 'For your skills',
    sparklineData: [40, 45, 48, 52, 58, 65, 72]
  }
];

export function StatsCards({ stats = defaultStats, className = '' }: StatsCardsProps) {
  const renderSparkline = (data?: number[]) => {
    if (!data || data.length === 0) return null;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const width = 80;
    const height = 30;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="absolute bottom-4 right-4 opacity-30">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-purple-600 dark:text-purple-400"
        />
      </svg>
    );
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassmorphismCard className="relative p-6 h-full overflow-hidden group">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                  {stat.icon}
                </div>
                
                {/* Change indicator */}
                <div className={`flex items-center gap-1 text-sm ${
                  stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' :
                  stat.changeType === 'decrease' ? 'text-red-600 dark:text-red-400' :
                  'text-gray-600 dark:text-gray-400'
                }`}>
                  {stat.changeType === 'increase' && <ArrowUp className="w-4 h-4" />}
                  {stat.changeType === 'decrease' && <ArrowDown className="w-4 h-4" />}
                  {stat.change !== 0 && (
                    <span className="font-medium">{Math.abs(stat.change)}%</span>
                  )}
                </div>
              </div>

              {/* Value */}
              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>

              {/* Subtitle */}
              {stat.subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.subtitle}
                </p>
              )}
            </div>

            {/* Sparkline */}
            {renderSparkline(stat.sparklineData)}

            {/* Hover effect line */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </GlassmorphismCard>
        </motion.div>
      ))}
    </div>
  );
}