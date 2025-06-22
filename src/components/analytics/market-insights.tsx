'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassmorphismCard } from '@/components/custom/glassmorphism-card';
import { GradientButton } from '@/components/custom/gradient-button';
import { 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Briefcase,
  Building,
  Users,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

interface MarketInsight {
  id: string;
  category: string;
  title: string;
  value: string;
  change: number;
  details: string[];
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'stable';
}

interface SalaryData {
  role: string;
  min: number;
  median: number;
  max: number;
  location: string;
  experience: string;
}

interface MarketInsightsProps {
  className?: string;
  onViewDetails?: (insight: MarketInsight) => void;
}

const mockInsights: MarketInsight[] = [
  {
    id: 'avg-salary',
    category: 'Compensation',
    title: 'Average Salary',
    value: '$125,000',
    change: 8.5,
    details: [
      'Based on 2,450 data points',
      'Top 10% earn $180k+',
      'Remote positions +15% premium'
    ],
    icon: <DollarSign className="w-5 h-5" />,
    trend: 'up'
  },
  {
    id: 'job-openings',
    category: 'Opportunities',
    title: 'Active Job Openings',
    value: '15,234',
    change: 12.3,
    details: [
      '45% require 3+ years experience',
      '68% offer remote options',
      'Top cities: SF, NYC, Austin'
    ],
    icon: <Briefcase className="w-5 h-5" />,
    trend: 'up'
  },
  {
    id: 'skill-demand',
    category: 'Market Demand',
    title: 'Skill Demand Index',
    value: '92/100',
    change: 5.2,
    details: [
      'React/Next.js: Very High',
      'TypeScript: High',
      'AI/ML Integration: Growing'
    ],
    icon: <TrendingUp className="w-5 h-5" />,
    trend: 'up'
  },
  {
    id: 'competition',
    category: 'Competition',
    title: 'Candidate Pool',
    value: '8.2k',
    change: -3.1,
    details: [
      'Average applicants per role: 125',
      'Senior positions: 45 applicants',
      'Entry level: 250+ applicants'
    ],
    icon: <Users className="w-5 h-5" />,
    trend: 'down'
  }
];

const salaryData: SalaryData[] = [
  { role: 'Senior Frontend Developer', min: 110000, median: 135000, max: 165000, location: 'San Francisco', experience: '5+ years' },
  { role: 'Full Stack Developer', min: 95000, median: 120000, max: 145000, location: 'New York', experience: '3-5 years' },
  { role: 'AI/ML Engineer', min: 125000, median: 155000, max: 195000, location: 'Remote', experience: '4+ years' },
  { role: 'DevOps Engineer', min: 105000, median: 130000, max: 160000, location: 'Austin', experience: '3-5 years' },
];

export function MarketInsights({ className = '', onViewDetails }: MarketInsightsProps) {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [liveUpdateTime, setLiveUpdateTime] = useState(new Date());

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUpdateTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const formatSalary = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div className={className}>
      {/* Market Overview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Real-Time Market Insights
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live • Updated {liveUpdateTime.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {mockInsights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassmorphismCard 
              className={`p-6 cursor-pointer transition-all duration-300 ${
                selectedInsight === insight.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => setSelectedInsight(insight.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    insight.trend === 'up' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                    insight.trend === 'down' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                    'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400'
                  }`}>
                    {insight.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{insight.category}</p>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{insight.title}</h3>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{insight.value}</p>
                <p className={`text-sm font-medium mt-1 ${
                  insight.trend === 'up' ? 'text-green-600 dark:text-green-400' :
                  insight.trend === 'down' ? 'text-red-600 dark:text-red-400' :
                  'text-gray-600 dark:text-gray-400'
                }`}>
                  {insight.trend === 'up' ? '+' : ''}{insight.change}% from last month
                </p>
              </div>

              <AnimatePresence>
                {selectedInsight === insight.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200 dark:border-gray-700 pt-4"
                  >
                    <ul className="space-y-2">
                      {insight.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-purple-500 rounded-full mt-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassmorphismCard>
          </motion.div>
        ))}
      </div>

      {/* Salary Comparison Table */}
      <GlassmorphismCard className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Salary Ranges by Role
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Experience
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Salary Range
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </th>
              </tr>
            </thead>
            <tbody>
              {salaryData.map((salary, index) => (
                <tr 
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors"
                >
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900 dark:text-white">{salary.role}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{salary.experience}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-gray-500">{formatSalary(salary.min)}</span>
                      <div className="flex-1 max-w-[200px]">
                        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="absolute h-full bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600"
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${((salary.median - salary.min) / (salary.max - salary.min)) * 100}%`,
                              left: '0%'
                            }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{formatSalary(salary.max)}</span>
                    </div>
                    <p className="text-center text-sm font-medium text-purple-600 dark:text-purple-400 mt-1">
                      {formatSalary(salary.median)} median
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{salary.location}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Market Alert */}
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900 dark:text-amber-100">
                Market Trend Alert
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                AI/ML skills showing 35% YoY growth in demand. Consider adding these to your learning path for maximum market value.
              </p>
            </div>
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  );
}