'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { GlassmorphismCard } from '@/components/custom/glassmorphism-card';
import { GradientButton } from '@/components/custom/gradient-button';
import { 
  Target, 
  Clock, 
  Award,
  BookOpen,
  Zap,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface ProgressMetric {
  category: string;
  current: number;
  target: number;
  trend: number;
}

interface TimeSpentData {
  day: string;
  learning: number;
  practice: number;
  assessment: number;
}

interface SkillProgressData {
  skill: string;
  proficiency: number;
  targetProficiency: number;
  hoursInvested: number;
}

interface ProgressAnalyticsProps {
  className?: string;
}

const progressMetrics: ProgressMetric[] = [
  { category: 'Completion Rate', current: 85, target: 90, trend: 5 },
  { category: 'Learning Velocity', current: 92, target: 95, trend: 8 },
  { category: 'Skill Retention', current: 78, target: 85, trend: 3 },
  { category: 'Practice Score', current: 88, target: 90, trend: 6 },
  { category: 'Assessment Score', current: 82, target: 88, trend: 4 },
  { category: 'Consistency', current: 95, target: 95, trend: 10 }
];

const timeSpentData: TimeSpentData[] = [
  { day: 'Mon', learning: 2.5, practice: 1.5, assessment: 0.5 },
  { day: 'Tue', learning: 3.0, practice: 2.0, assessment: 0.8 },
  { day: 'Wed', learning: 2.8, practice: 1.8, assessment: 0.6 },
  { day: 'Thu', learning: 3.5, practice: 2.2, assessment: 1.0 },
  { day: 'Fri', learning: 2.0, practice: 1.0, assessment: 0.5 },
  { day: 'Sat', learning: 4.0, practice: 2.5, assessment: 1.2 },
  { day: 'Sun', learning: 3.2, practice: 2.0, assessment: 0.8 }
];

const skillProgressData: SkillProgressData[] = [
  { skill: 'React/Next.js', proficiency: 85, targetProficiency: 95, hoursInvested: 120 },
  { skill: 'TypeScript', proficiency: 78, targetProficiency: 90, hoursInvested: 80 },
  { skill: 'Node.js', proficiency: 72, targetProficiency: 85, hoursInvested: 65 },
  { skill: 'AI/ML Basics', proficiency: 45, targetProficiency: 70, hoursInvested: 30 },
  { skill: 'Cloud (AWS)', proficiency: 68, targetProficiency: 80, hoursInvested: 55 }
];

export function ProgressAnalytics({ className = '' }: ProgressAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name.includes('proficiency') ? '%' : entry.name.includes('hours') ? ' hrs' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Performance Analytics
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your learning progress and identify areas for improvement
        </p>
      </div>

      {/* Performance Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GlassmorphismCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Performance Overview
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={progressMetrics}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Target"
                  dataKey="target"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphismCard>

        {/* Time Investment */}
        <GlassmorphismCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Time Investment
            </h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-1 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSpentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="learning"
                  stackId="1"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="practice"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="assessment"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphismCard>
      </div>

      {/* Skill Progress */}
      <GlassmorphismCard className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Skill Development Progress
        </h3>
        <div className="space-y-4">
          {skillProgressData.map((skill, index) => (
            <motion.div
              key={skill.skill}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{skill.skill}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {skill.hoursInvested} hours invested
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {skill.proficiency}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Target: {skill.targetProficiency}%
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="absolute h-full bg-gradient-to-r from-purple-500 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                  <div 
                    className="absolute h-full w-0.5 bg-green-500"
                    style={{ left: `${skill.targetProficiency}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassmorphismCard>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: <Target className="w-5 h-5" />, label: 'Goals Completed', value: '18/24', color: 'purple' },
          { icon: <Clock className="w-5 h-5" />, label: 'Total Hours', value: '284', color: 'blue' },
          { icon: <Award className="w-5 h-5" />, label: 'Achievements', value: '12', color: 'green' },
          { icon: <TrendingUp className="w-5 h-5" />, label: 'Growth Rate', value: '+28%', color: 'orange' }
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassmorphismCard className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  metric.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' :
                  metric.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                  metric.color === 'green' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                  'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                }`}>
                  {metric.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                </div>
              </div>
            </GlassmorphismCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}