'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { GlassmorphismCard } from '@/components/custom/glassmorphism-card';
import { GradientButton } from '@/components/custom/gradient-button';
import { 
  Users, 
  Target, 
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface SkillComparison {
  skill: string;
  yourLevel: number;
  marketAverage: number;
  topPerformers: number;
  demandScore: number;
}

interface CompetitorData {
  x: number; // Skill Level
  y: number; // Market Value
  size: number; // Experience
  category: string;
}

interface MarketPosition {
  category: string;
  position: number;
  total: number;
  percentile: number;
}

interface CompetitiveAnalysisProps {
  className?: string;
}

const skillComparisons: SkillComparison[] = [
  { skill: 'React/Next.js', yourLevel: 85, marketAverage: 72, topPerformers: 95, demandScore: 92 },
  { skill: 'TypeScript', yourLevel: 78, marketAverage: 68, topPerformers: 90, demandScore: 88 },
  { skill: 'Node.js', yourLevel: 72, marketAverage: 70, topPerformers: 88, demandScore: 85 },
  { skill: 'AI/ML', yourLevel: 45, marketAverage: 55, topPerformers: 85, demandScore: 95 },
  { skill: 'Cloud (AWS)', yourLevel: 68, marketAverage: 65, topPerformers: 92, demandScore: 90 },
  { skill: 'DevOps', yourLevel: 60, marketAverage: 62, topPerformers: 88, demandScore: 87 }
];

const competitorData: CompetitorData[] = [
  // You
  { x: 82, y: 125000, size: 100, category: 'You' },
  // Market Average
  { x: 70, y: 105000, size: 60, category: 'Average' },
  // Top Performers
  { x: 92, y: 165000, size: 80, category: 'Top 10%' },
  // Other candidates
  ...Array.from({ length: 20 }, (_, i) => ({
    x: 50 + Math.random() * 40,
    y: 80000 + Math.random() * 60000,
    size: 30 + Math.random() * 40,
    category: 'Others'
  }))
];

const marketPositions: MarketPosition[] = [
  { category: 'Overall Ranking', position: 1243, total: 8500, percentile: 85 },
  { category: 'Frontend Skills', position: 892, total: 6200, percentile: 86 },
  { category: 'Experience Level', position: 2100, total: 12000, percentile: 83 },
  { category: 'Market Readiness', position: 1050, total: 7800, percentile: 87 }
];

export function CompetitiveAnalysis({ className = '' }: CompetitiveAnalysisProps) {
  const [selectedView, setSelectedView] = useState<'skills' | 'market' | 'position'>('skills');

  const getColorForCategory = (category: string) => {
    switch (category) {
      case 'You': return '#8b5cf6';
      case 'Average': return '#6b7280';
      case 'Top 10%': return '#10b981';
      default: return '#e5e7eb';
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {data.category || data.skill}
          </p>
          {data.x !== undefined && (
            <>
              <p className="text-sm">Skill Level: {data.x}%</p>
              <p className="text-sm">Market Value: ${data.y.toLocaleString()}</p>
            </>
          )}
          {data.yourLevel !== undefined && (
            <>
              <p className="text-sm">Your Level: {data.yourLevel}%</p>
              <p className="text-sm">Market Avg: {data.marketAverage}%</p>
              <p className="text-sm">Demand Score: {data.demandScore}%</p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Competitive Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          See how your skills compare to the market and identify opportunities
        </p>
      </div>

      {/* View Selector */}
      <div className="flex gap-2 mb-6">
        {['skills', 'market', 'position'].map((view) => (
          <GradientButton
            key={view}
            onClick={() => setSelectedView(view as any)}
            variant={selectedView === view ? 'primary' : 'secondary'}
            size="sm"
          >
            {view === 'skills' ? 'Skill Comparison' : 
             view === 'market' ? 'Market Position' : 
             'Rankings'}
          </GradientButton>
        ))}
      </div>

      {/* Skills Comparison View */}
      {selectedView === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassmorphismCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Skills vs Market
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillComparisons} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="skill" type="category" tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="yourLevel" fill="#8b5cf6" name="Your Level" />
                  <Bar dataKey="marketAverage" fill="#6b7280" name="Market Average" />
                  <Bar dataKey="topPerformers" fill="#10b981" name="Top 10%" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassmorphismCard>

          <GlassmorphismCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Skill Demand Analysis
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillComparisons}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="Your Skills"
                    dataKey="yourLevel"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Market Demand"
                    dataKey="demandScore"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.3}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassmorphismCard>
        </div>
      )}

      {/* Market Position View */}
      {selectedView === 'market' && (
        <GlassmorphismCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Market Value Distribution
          </h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Skill Level" 
                  unit="%" 
                  domain={[40, 100]}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Market Value" 
                  unit="$"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter 
                  name="Candidates" 
                  data={competitorData} 
                  fill="#8884d8"
                >
                  {competitorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColorForCategory(entry.category)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">You</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Average</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Top 10%</span>
            </div>
          </div>
        </GlassmorphismCard>
      )}

      {/* Rankings View */}
      {selectedView === 'position' && (
        <div className="space-y-4">
          {marketPositions.map((position, index) => (
            <motion.div
              key={position.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassmorphismCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {position.category}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Position {position.position.toLocaleString()} of {position.total.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      Top {100 - position.percentile}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {position.percentile}th percentile
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <motion.div
                      className="absolute h-full bg-gradient-to-r from-purple-500 to-purple-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${position.percentile}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </GlassmorphismCard>
            </motion.div>
          ))}
          
          {/* Recommendations */}
          <GlassmorphismCard className="p-6 bg-purple-50/50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  Key Recommendations
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Your React/Next.js skills are above market average - leverage this strength
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      AI/ML skills are below market average but in high demand - prioritize learning
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      You're in the top 15% overall - aim for top 10% to unlock premium opportunities
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </GlassmorphismCard>
        </div>
      )}
    </div>
  );
}