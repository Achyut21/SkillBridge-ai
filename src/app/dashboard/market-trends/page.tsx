'use client';

import { useState } from 'react';
import { GlassmorphismCard } from '@/components/custom/glassmorphism-card';
import { GradientButton } from '@/components/custom/gradient-button';
import { StatsCard } from '@/components/custom/stats-card';
import { 
  TrendingUp, 
  DollarSign, 
  Briefcase,
  Users,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  Globe,
  Sparkles
} from 'lucide-react';

export default function MarketTrendsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);

  const marketStats = [
    {
      label: 'Job Openings',
      value: '385',
      suffix: 'K+',
      subValue: 'This month',
      icon: Briefcase,
      trend: '+12%',
    },
    {
      label: 'Avg. Salary',
      value: '135',
      suffix: 'K',
      subValue: 'Tech roles',
      icon: DollarSign,
      trend: '+8%',
    },
    {
      label: 'Skill Demand',
      value: '92',
      suffix: '%',
      subValue: 'AI/ML skills',
      icon: TrendingUp,
      trend: '+45%',
    },
    {
      label: 'Companies Hiring',
      value: '2.4',
      suffix: 'K',
      subValue: 'Active now',
      icon: Users,
      trend: '+18%',
    },
  ];

  const trendingSkills = [
    { name: 'AI/Machine Learning Engineer', growth: '+45%', salary: '$165,000', demand: 'Very High', category: 'ai' },
    { name: 'Cloud Architect', growth: '+32%', salary: '$145,000', demand: 'High', category: 'cloud' },
    { name: 'DevOps Engineer', growth: '+28%', salary: '$130,000', demand: 'High', category: 'devops' },
    { name: 'Data Scientist', growth: '+25%', salary: '$140,000', demand: 'High', category: 'data' },
    { name: 'Full Stack Developer', growth: '+18%', salary: '$115,000', demand: 'Moderate', category: 'web' },
    { name: 'Cybersecurity Analyst', growth: '+35%', salary: '$125,000', demand: 'Very High', category: 'security' },
  ];

  const categories = [
    { id: 'all', name: 'All Skills', icon: Globe },
    { id: 'ai', name: 'AI/ML', icon: Sparkles },
    { id: 'cloud', name: 'Cloud', icon: TrendingUp },
    { id: 'web', name: 'Web Dev', icon: Globe },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Market <span className="gradient-text-animated">Trends</span>
          </h1>
          <p className="text-gray-600 dark:text-neutral-400">
            Real-time insights into job market demand and skill trends
          </p>
        </div>
        
        <GradientButton variant="outline" size="md" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </GradientButton>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketStats.map((stat, index) => (
          <StatsCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-3 pb-4">
        <Filter className="w-5 h-5 text-gray-600 dark:text-neutral-400" />
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                  : 'bg-gray-100 dark:bg-brand-900/20 text-gray-600 dark:text-neutral-400 hover:bg-gray-200 dark:hover:bg-brand-900/30'
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Trending Skills */}
        <div className="lg:col-span-2">
          <GlassmorphismCard variant="medium" depth="triple">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-brand-500 animate-pulse" />
              Trending Skills & Salaries
            </h2>
            
            <div className="space-y-3">
              {trendingSkills
                .filter(skill => selectedCategory === 'all' || skill.category === selectedCategory)
                .map((skill, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-brand-900/10 dark:to-brand-800/5 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredSkill(index)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{skill.name}</h3>
                    <span className={`text-sm font-bold flex items-center gap-1 ${
                      skill.growth.startsWith('+3') || skill.growth.startsWith('+4') 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-brand-600 dark:text-brand-400'
                    }`}>
                      <TrendingUp className="w-4 h-4" />
                      {skill.growth}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600 dark:text-neutral-400">
                        Avg: <span className="font-semibold text-gray-900 dark:text-white">{skill.salary}</span>
                      </span>
                    </div>
                    
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      skill.demand === 'Very High' 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : skill.demand === 'High'
                        ? 'bg-brand-100 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-400'
                    }`}>
                      {skill.demand} demand
                    </span>
                  </div>
                  
                  {/* Hover effect */}
                  <div className={`mt-2 text-xs text-gray-600 dark:text-neutral-400 transition-all duration-300 ${
                    hoveredSkill === index ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'
                  }`}>
                    Click to see detailed market analysis and learning paths
                  </div>
                </div>
              ))}
            </div>
          </GlassmorphismCard>
        </div>
        {/* Industry Insights */}
        <div className="space-y-6">
          <GlassmorphismCard variant="medium" depth="double">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-500" />
              Industry Breakdown
            </h3>
            
            <div className="space-y-3">
              {[
                { industry: 'Technology', openings: '125K+', growth: '+22%', color: 'from-blue-500 to-cyan-500' },
                { industry: 'Healthcare Tech', openings: '48K+', growth: '+38%', color: 'from-green-500 to-emerald-500' },
                { industry: 'Finance', openings: '62K+', growth: '+15%', color: 'from-brand-500 to-purple-500' },
                { industry: 'E-commerce', openings: '38K+', growth: '+28%', color: 'from-orange-500 to-red-500' },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-brand-900/20 transition-colors">
                    <div>
                      <p className="font-medium">{item.industry}</p>
                      <p className="text-sm text-gray-600 dark:text-neutral-400">{item.openings} openings</p>
                    </div>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {item.growth}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000`}
                      style={{ width: `${parseInt(item.growth) * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassmorphismCard>
          
          {/* Quick Actions */}
          <GlassmorphismCard variant="medium" depth="double" pulse>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              Recommended Actions
            </h3>
            
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-900/10 dark:to-purple-900/10 border border-brand-200 dark:border-brand-800/30">
                <p className="text-sm font-medium mb-1">Focus on AI Skills</p>
                <p className="text-xs text-gray-600 dark:text-neutral-400">
                  45% growth in demand, highest salary potential
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800/30">
                <p className="text-sm font-medium mb-1">Cloud Certifications</p>
                <p className="text-xs text-gray-600 dark:text-neutral-400">
                  AWS, Azure, GCP skills in high demand
                </p>
              </div>
              
              <GradientButton variant="primary" size="sm" className="w-full mt-4 animate-glow-pulse">
                Create Learning Plan
              </GradientButton>
            </div>
          </GlassmorphismCard>
        </div>
      </div>
    </div>
  );
}