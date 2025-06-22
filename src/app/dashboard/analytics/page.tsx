'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  StatsCards,
  SkillTrendsChart,
  MarketInsights,
  ProgressAnalytics,
  CompetitiveAnalysis
} from '@/components/analytics';
import { GradientButton } from '@/components/custom/gradient-button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  Download,
  RefreshCw
} from 'lucide-react';

export default function AnalyticsPage() {
  const [activeView, setActiveView] = useState<'overview' | 'trends' | 'market' | 'progress' | 'competitive'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleExport = () => {
    // In a real app, this would generate and download a report
    console.log('Exporting analytics data...');
  };

  const viewOptions = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'trends', label: 'Skill Trends', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'market', label: 'Market Insights', icon: <Target className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'competitive', label: 'Competitive', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Analytics <span className="gradient-text-animated">Dashboard</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Track your progress, market trends, and competitive position
            </p>
          </div>
          
          <div className="flex gap-3">
            <GradientButton
              onClick={handleRefresh}
              variant="secondary"
              size="sm"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </GradientButton>
            <GradientButton
              onClick={handleExport}
              variant="secondary"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </GradientButton>
          </div>
        </div>
      </motion.div>

      {/* View Selector */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {viewOptions.map((option) => (
          <GradientButton
            key={option.id}
            onClick={() => setActiveView(option.id as any)}
            variant={activeView === option.id ? 'primary' : 'secondary'}
            size="sm"
          >
            {option.icon}
            <span className="ml-2">{option.label}</span>
          </GradientButton>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeView === 'overview' && (
          <div className="space-y-8">
            <StatsCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SkillTrendsChart />
              <MarketInsights />
            </div>
          </div>
        )}

        {activeView === 'trends' && (
          <SkillTrendsChart 
            onExport={handleExport}
            className="w-full"
          />
        )}

        {activeView === 'market' && (
          <MarketInsights className="w-full" />
        )}

        {activeView === 'progress' && (
          <ProgressAnalytics className="w-full" />
        )}

        {activeView === 'competitive' && (
          <CompetitiveAnalysis className="w-full" />
        )}
      </motion.div>
    </div>
  );
}