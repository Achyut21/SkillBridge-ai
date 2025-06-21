"use client"

import { useState, useEffect } from "react"
import { GlassmorphismCard } from "@/components/custom"
import { StatsCard } from "@/components/custom/stats-card"
import { BarChart3, TrendingUp, Clock, Target, Calendar, Award, Activity, ChevronUp } from "lucide-react"

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  
  const stats = [
    {
      label: 'Completion Rate',
      value: '85',
      suffix: '%',
      subValue: 'Above average',
      icon: BarChart3,
      trend: '+5%',
    },
    {
      label: 'Total Learning Time',
      value: '142',
      suffix: 'h',
      subValue: 'This month',
      icon: Clock,
      trend: '+12%',
    },
    {
      label: 'Goals Achieved',
      value: '23',
      subValue: 'Out of 25',
      icon: Target,
      trend: null,
    },
    {
      label: 'Weekly Growth',
      value: '15',
      suffix: '%',
      subValue: 'Consistent',
      icon: TrendingUp,
      trend: '+3%',
    },
  ]

  const weeklyData = [
    { day: 'Mon', hours: 2.5, goal: 3 },
    { day: 'Tue', hours: 3.2, goal: 3 },
    { day: 'Wed', hours: 2.8, goal: 3 },
    { day: 'Thu', hours: 4.1, goal: 3 },
    { day: 'Fri', hours: 3.5, goal: 3 },
    { day: 'Sat', hours: 1.5, goal: 2 },
    { day: 'Sun', hours: 2.0, goal: 2 },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          Analytics <span className="gradient-text-animated">Dashboard</span>
        </h1>
        <p className="text-gray-600 dark:text-neutral-400 text-lg">
          Track your learning progress and performance
        </p>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>

      {/* Main Analytics Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <div className="lg:col-span-2">
          <GlassmorphismCard variant="medium" depth="triple">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Activity className="w-6 h-6 text-brand-500" />
                Weekly Progress
              </h2>
              
              <div className="flex gap-2">
                {['week', 'month', 'year'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedPeriod === period
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-100 dark:bg-brand-900/20 text-gray-600 dark:text-neutral-400 hover:bg-gray-200 dark:hover:bg-brand-900/30'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Chart Visualization */}
            <div className="space-y-4">
              {weeklyData.map((data, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm font-medium w-12 text-gray-600 dark:text-neutral-400">
                    {data.day}
                  </span>
                  <div className="flex-1 relative">
                    <div className="w-full bg-gray-200 dark:bg-neutral-800 rounded-full h-6 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-brand-600 to-brand-500 h-6 rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                        style={{ width: `${(data.hours / 5) * 100}%` }}
                      >
                        <span className="text-xs text-white font-medium">{data.hours}h</span>
                      </div>
                    </div>
                    {/* Goal indicator */}
                    <div 
                      className="absolute top-0 h-6 w-0.5 bg-green-500"
                      style={{ left: `${(data.goal / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-brand-800/30">
                <div className="text-sm text-gray-600 dark:text-neutral-400">
                  Total: <span className="font-semibold text-gray-900 dark:text-white">19.6 hours</span>
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <ChevronUp className="w-4 h-4" />
                  12% vs last week
                </div>
              </div>
            </div>
          </GlassmorphismCard>
        </div>
        {/* Achievements & Insights */}
        <div className="space-y-6">
          {/* Recent Achievements */}
          <GlassmorphismCard variant="medium" depth="double">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-500" />
              Recent Achievements
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <span className="text-white text-lg">🔥</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">7-Day Streak</p>
                  <p className="text-xs text-gray-600 dark:text-neutral-400">Consistent learner</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-900/10 dark:to-purple-900/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-lg">🎯</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Goal Crusher</p>
                  <p className="text-xs text-gray-600 dark:text-neutral-400">5 goals completed</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                  <span className="text-white text-lg">💡</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Quick Learner</p>
                  <p className="text-xs text-gray-600 dark:text-neutral-400">Above avg speed</p>
                </div>
              </div>
            </div>
          </GlassmorphismCard>
          
          {/* Learning Insights */}
          <GlassmorphismCard variant="medium" depth="double" pulse>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-500" />
              Insights
            </h3>
            
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30">
                <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                  Best Learning Time
                </p>
                <p className="text-xs text-green-700 dark:text-green-400">
                  You're most productive between 2-5 PM
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-brand-50 dark:bg-brand-900/10 border border-brand-200 dark:border-brand-800/30">
                <p className="text-sm font-medium text-brand-800 dark:text-brand-300 mb-1">
                  Focus Area
                </p>
                <p className="text-xs text-brand-700 dark:text-brand-400">
                  Complete 2 more React projects this week
                </p>
              </div>
            </div>
          </GlassmorphismCard>
        </div>
      </div>
    </div>
  )
}