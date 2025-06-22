'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { GlassmorphismCard } from '@/components/custom/glassmorphism-card';
import { GradientButton } from '@/components/custom/gradient-button';
import { Calendar, TrendingUp, Filter } from 'lucide-react';

interface SkillTrendData {
  month: string;
  demand: number;
  supply: number;
  salary: number;
  growth: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface SkillTrendsChartProps {
  className?: string;
  onExport?: () => void;
}

const trendData: SkillTrendData[] = [
  { month: 'Jan', demand: 85, supply: 45, salary: 95000, growth: 12 },
  { month: 'Feb', demand: 88, supply: 48, salary: 96500, growth: 15 },
  { month: 'Mar', demand: 92, supply: 52, salary: 98000, growth: 18 },
  { month: 'Apr', demand: 95, supply: 55, salary: 102000, growth: 22 },
  { month: 'May', demand: 98, supply: 58, salary: 105000, growth: 25 },
  { month: 'Jun', demand: 102, supply: 60, salary: 108000, growth: 28 },
];

const categoryData: CategoryData[] = [
  { name: 'AI/ML', value: 35, color: '#8b5cf6' },
  { name: 'Cloud', value: 25, color: '#a78bfa' },
  { name: 'DevOps', value: 20, color: '#c4b5fd' },
  { name: 'Security', value: 15, color: '#ddd6fe' },
  { name: 'Other', value: 5, color: '#ede9fe' },
];

export function SkillTrendsChart({ className = '', onExport }: SkillTrendsChartProps) {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area');
  const [timeRange, setTimeRange] = useState<'6m' | '1y' | 'all'>('6m');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'salary' ? `$${entry.value.toLocaleString()}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const chartProps = {
      data: trendData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const commonAxisProps = {
      stroke: '#9ca3af',
      fontSize: 12
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis dataKey="month" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="demand" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="supply" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
        
      case 'area':
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis dataKey="month" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="demand" 
              stackId="1"
              stroke="#8b5cf6" 
              fill="#8b5cf6"
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="supply" 
              stackId="2"
              stroke="#10b981" 
              fill="#10b981"
              fillOpacity={0.6}
            />
          </AreaChart>
        );
        
      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis dataKey="month" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="demand" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="supply" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <div className={className}>
      <GlassmorphismCard className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Skill Market Trends
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Track demand, supply, and growth rates for your skills
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 text-sm"
            >
              <option value="area">Area Chart</option>
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
            </select>
            
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 text-sm"
            >
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
              <option value="all">All Time</option>
            </select>
            
            {onExport && (
              <GradientButton
                onClick={onExport}
                size="sm"
                variant="secondary"
              >
                Export Data
              </GradientButton>
            )}
          </div>
        </div>

        {/* Main Chart */}
        <div className="h-80 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Skills Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Skills Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Growth Indicators */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Growth Indicators
            </h3>
            <div className="space-y-4">
              {['React/Next.js', 'Machine Learning', 'Cloud Architecture', 'DevOps'].map((skill, index) => {
                const growth = [28, 35, 22, 18][index];
                return (
                  <div key={skill}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {skill}
                      </span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        +{growth}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${growth * 2.5}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  );
}