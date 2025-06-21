'use client';

import { GlassmorphismCard, GradientButton } from '@/components/custom';
import { AnimatedBackground } from '@/components/custom/animated-background';
import { BookOpen, Plus, TrendingUp, Clock, Users, Star, ArrowRight, Zap } from 'lucide-react';
import { useState } from 'react';

export default function LearningPathsPage() {
  const [hoveredPath, setHoveredPath] = useState<number | null>(null);
  
  const learningPaths = [
    {
      title: 'Full-Stack AI Developer',
      description: 'Master AI integration with modern web development',
      duration: '6 months',
      students: '2.4k',
      demand: 'Very High',
      progress: 65,
      skills: ['React', 'Python', 'TensorFlow', 'Next.js'],
      trending: true,
    },
    {
      title: 'Cloud Architecture',
      description: 'Design and deploy scalable cloud solutions',
      duration: '4 months',
      students: '1.8k',
      demand: 'High',
      progress: 0,
      skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform'],
      trending: false,
    },
    {
      title: 'Data Science Fundamentals',
      description: 'Analytics, ML, and data visualization mastery',
      duration: '5 months',
      students: '3.2k',
      demand: 'High',
      progress: 0,
      skills: ['Python', 'SQL', 'Pandas', 'Scikit-learn'],
      trending: true,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Learning <span className="gradient-text-animated">Paths</span>
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 text-lg">
            Discover and create personalized learning journeys
          </p>
        </div>
        <GradientButton 
          variant="primary" 
          size="lg" 
          className="flex items-center gap-2 animate-glow-pulse"
        >
          <Plus className="w-5 h-5" />
          Create Path
        </GradientButton>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        {learningPaths.map((path, index) => (
          <GlassmorphismCard
            key={index}
            variant="medium"
            hover
            depth={path.progress > 0 ? 'triple' : 'double'}
            className="relative overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHoveredPath(index)}
            onMouseLeave={() => setHoveredPath(null)}
          >
            {path.trending && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Trending
              </div>
            )}
            
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              
              {path.progress > 0 && (
                <div className="text-right">
                  <p className="text-2xl font-bold stat-number">{path.progress}%</p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">Complete</p>
                </div>
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2">{path.title}</h3>
            <p className="text-gray-600 dark:text-neutral-400 text-sm mb-4">
              {path.description}
            </p>
            
            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {path.skills.slice(0, 3).map((skill, i) => (
                <span 
                  key={i}
                  className="text-xs px-2 py-1 rounded-full bg-brand-100 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300"
                >
                  {skill}
                </span>
              ))}
              {path.skills.length > 3 && (
                <span className="text-xs px-2 py-1 text-gray-500 dark:text-neutral-400">
                  +{path.skills.length - 3} more
                </span>
              )}
            </div>
            
            {/* Progress bar */}
            {path.progress > 0 ? (
              <div className="mb-4">
                <div className="w-full bg-gray-200 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-brand-600 to-brand-500 h-2 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${path.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
              </div>
            ) : null}
            {/* Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-brand-800/30">
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-neutral-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {path.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {path.students}
                </div>
              </div>
              
              <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                path.demand === 'Very High' 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'bg-brand-100 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
              }`}>
                {path.demand} demand
              </div>
            </div>
            
            {/* Hover action */}
            <div className={`absolute bottom-4 right-4 transition-all duration-300 ${
              hoveredPath === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
            }`}>
              <GradientButton variant="ghost" size="sm" className="flex items-center gap-1">
                {path.progress > 0 ? 'Continue' : 'Start'}
                <ArrowRight className="w-4 h-4" />
              </GradientButton>
            </div>
          </GlassmorphismCard>
        ))}
      </div>
      
      {/* Featured Section */}
      <GlassmorphismCard variant="heavy" depth="double" className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Star className="w-6 h-6 text-brand-500 animate-pulse" />
            Featured Learning Resources
          </h2>
          <TrendingUp className="w-5 h-5 text-brand-400 animate-float" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/10 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold mb-2">AI-First Development</h3>
            <p className="text-sm text-gray-600 dark:text-neutral-400 mb-3">
              Learn to build applications with AI at the core
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-brand-600 dark:text-brand-400">12 courses</span>
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/10 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold mb-2">Future Skills 2025</h3>
            <p className="text-sm text-gray-600 dark:text-neutral-400 mb-3">
              Stay ahead with emerging technologies
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-brand-600 dark:text-brand-400">8 courses</span>
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  );
}