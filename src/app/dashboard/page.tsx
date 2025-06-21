'use client';

import { GlassmorphismCard } from '@/components/custom/glassmorphism-card';
import { GradientButton } from '@/components/custom/gradient-button';
import { StatsCard } from '@/components/custom/stats-card';
import { useAuthStore } from '@/stores/auth-store';
import { 
  Clock, 
  BookOpen, 
  Target, 
  Trophy,
  TrendingUp,
  Zap,
  Mic,
  BarChart3
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const stats = [
    {
      label: 'Learning Streak',
      value: '5 days',
      subValue: '24h',
      icon: Clock,
      trend: null,
    },
    {
      label: 'Skills Mastered',
      value: '12',
      subValue: '+3 this week',
      icon: BookOpen,
      trend: '+25%',
    },
    {
      label: 'Goal Progress',
      value: '78%',
      subValue: 'On track!',
      icon: Target,
      trend: '+5%',
    },
    {
      label: 'Achievements',
      value: '15',
      subValue: '2 new badges',
      icon: Trophy,
      trend: null,
    },
  ];

  const marketInsights = [
    { skill: 'React Developer', trend: '+15%', demand: 'High' },
    { skill: 'AI Engineer', trend: '+28%', demand: 'Very High' },
    { skill: 'DevOps', trend: '+8%', demand: 'Moderate' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, <span className="gradient-text-animated">{user?.name || 'Learner'}</span>
        </h1>
        <p className="text-gray-600 dark:text-neutral-400">
          Ready to continue your AI-powered learning journey?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Learning Path */}
        <div className="lg:col-span-2">
          <GlassmorphismCard variant="medium" glow depth="triple">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Zap className="h-6 w-6 text-brand-500 mr-2 animate-pulse" />
                Current Learning Path
              </h2>
            </div>

            <div className="bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900/20 dark:to-brand-800/10 rounded-xl p-4 mb-4 hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Full-Stack AI Developer</h3>
                <span className="text-brand-600 dark:text-brand-400 text-sm font-medium">65% Complete</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-neutral-800 rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-brand-600 to-brand-500 h-3 rounded-full transition-all duration-1000 relative"
                  style={{ width: '65%' }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
              <p className="text-gray-600 dark:text-neutral-400 text-sm mb-4">
                Next: Advanced Machine Learning with TensorFlow
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-brand-800/30">
              <div className="text-center">
                <BookOpen className="h-8 w-8 text-brand-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400">Courses</p>
                <p className="text-xs text-brand-600 dark:text-brand-400">8 completed</p>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 text-brand-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">48</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400">Hours</p>
                <p className="text-xs text-brand-600 dark:text-brand-400">Est. remaining</p>
              </div>
              <div className="text-center">
                <Target className="h-8 w-8 text-brand-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400">Projects</p>
                <p className="text-xs text-brand-600 dark:text-brand-400">To complete</p>
              </div>
            </div>
          </GlassmorphismCard>
        </div>

        {/* AI Voice Coach */}
        <div className="space-y-6">
          <GlassmorphismCard variant="medium" depth="double" pulse>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Mic className="h-5 w-5 text-brand-500 mr-2 animate-pulse" />
                AI Voice Coach
              </h2>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 text-sm mb-6">
              Get personalized guidance and motivation
            </p>
            <GradientButton variant="primary" size="md" className="w-full animate-glow-pulse">
              Start Voice Session
            </GradientButton>
          </GlassmorphismCard>

          {/* Market Insights */}
          <GlassmorphismCard variant="medium" depth="double">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <BarChart3 className="h-5 w-5 text-brand-500 mr-2" />
                Market Insights
              </h2>
              <TrendingUp className="h-4 w-4 text-brand-400 animate-float" />
            </div>
            
            <div className="space-y-3">
              {marketInsights.map((insight, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors duration-200"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">{insight.skill}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${
                      insight.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {insight.trend}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      insight.demand === 'Very High' 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : insight.demand === 'High'
                        ? 'bg-brand-100 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-400'
                    }`}>
                      {insight.demand}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <GradientButton variant="ghost" size="sm" className="w-full mt-4 group">
              View Full Report
              <TrendingUp className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
            </GradientButton>
          </GlassmorphismCard>
        </div>
      </div>
    </div>
  );
}
