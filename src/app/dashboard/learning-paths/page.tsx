'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  BookOpen, 
  TrendingUp, 
  Target, 
  Zap, 
  Users, 
  Clock, 
  Star,
  ArrowRight,
  Settings,
  Filter,
  Search,
  Grid,
  List,
  Award,
  PlayCircle
} from 'lucide-react';

import { GlassmorphismCard, GradientButton } from '@/components/custom';
// Using GradientButton for buttons instead of separate Button component
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Import our new learning components
import { SkillAssessment } from '@/components/learning/skill-assessment';
import { PathBuilder } from '@/components/learning/path-builder';
import { ProgressTracker } from '@/components/learning/progress-tracker';
import { LearningTimeline } from '@/components/learning/learning-timeline';
import { SkillRadar } from '@/components/learning/skill-radar';
import { MilestoneCelebration } from '@/components/learning/milestone-celebration';

import { 
  LearningPath, 
  UserProgress, 
  Skill, 
  SkillLevel, 
  Milestone,
  Difficulty 
} from '@/lib/types';

type ViewMode = 'overview' | 'assessment' | 'builder' | 'progress' | 'timeline' | 'radar';

export default function LearningPathsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);

  // Mock data for demonstration
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([
    {
      id: '1',
      title: 'Full-Stack AI Developer',
      description: 'Master AI integration with modern web development technologies and frameworks',
      userId: 'user1',
      targetRole: 'Senior AI Engineer',
      duration: 24,
      difficulty: Difficulty.HARD,
      skills: [
        { skillId: '1', skill: { id: '1', name: 'React', category: 'Frontend', level: SkillLevel.INTERMEDIATE, marketDemand: 85, trendingScore: 92, createdAt: new Date(), updatedAt: new Date() }, order: 0, targetLevel: SkillLevel.ADVANCED },
        { skillId: '2', skill: { id: '2', name: 'Python', category: 'Backend', level: SkillLevel.BEGINNER, marketDemand: 90, trendingScore: 88, createdAt: new Date(), updatedAt: new Date() }, order: 1, targetLevel: SkillLevel.EXPERT },
        { skillId: '3', skill: { id: '3', name: 'TensorFlow', category: 'AI/ML', level: SkillLevel.BEGINNER, marketDemand: 95, trendingScore: 96, createdAt: new Date(), updatedAt: new Date() }, order: 2, targetLevel: SkillLevel.ADVANCED }
      ],
      resources: [],
      progress: 65,
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Cloud Architecture Mastery',
      description: 'Design and deploy scalable cloud solutions with AWS, Azure, and Kubernetes',
      userId: 'user1',
      targetRole: 'Cloud Solutions Architect',
      duration: 16,
      difficulty: Difficulty.MEDIUM,
      skills: [
        { skillId: '4', skill: { id: '4', name: 'AWS', category: 'DevOps', level: SkillLevel.BEGINNER, marketDemand: 88, trendingScore: 85, createdAt: new Date(), updatedAt: new Date() }, order: 0, targetLevel: SkillLevel.ADVANCED },
        { skillId: '5', skill: { id: '5', name: 'Kubernetes', category: 'DevOps', level: SkillLevel.BEGINNER, marketDemand: 92, trendingScore: 90, createdAt: new Date(), updatedAt: new Date() }, order: 1, targetLevel: SkillLevel.INTERMEDIATE }
      ],
      resources: [],
      progress: 0,
      isActive: false,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date()
    }
  ]);

  const [userProgress] = useState<UserProgress[]>([
    {
      userId: 'user1',
      skillId: '1',
      currentLevel: SkillLevel.INTERMEDIATE,
      targetLevel: SkillLevel.ADVANCED,
      progressPercentage: 75,
      hoursSpent: 45,
      lastActivity: new Date(),
      milestones: [
        { id: '1', title: 'React Fundamentals', description: 'Completed basic React concepts', achievedAt: new Date(), points: 25, badge: 'react-basic' },
        { id: '2', title: 'Component Mastery', description: 'Built 10 custom components', achievedAt: new Date(), points: 35 }
      ]
    },
    {
      userId: 'user1',
      skillId: '2',
      currentLevel: SkillLevel.BEGINNER,
      targetLevel: SkillLevel.EXPERT,
      progressPercentage: 30,
      hoursSpent: 20,
      lastActivity: new Date(),
      milestones: [
        { id: '3', title: 'Python Basics', description: 'Learned Python syntax and fundamentals', achievedAt: new Date(), points: 20 }
      ]
    }
  ]);

  const [availableSkills] = useState<Skill[]>([
    { id: '1', name: 'React', category: 'Frontend', level: SkillLevel.INTERMEDIATE, marketDemand: 85, trendingScore: 92, createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'Python', category: 'Backend', level: SkillLevel.BEGINNER, marketDemand: 90, trendingScore: 88, createdAt: new Date(), updatedAt: new Date() },
    { id: '3', name: 'TensorFlow', category: 'AI/ML', level: SkillLevel.BEGINNER, marketDemand: 95, trendingScore: 96, createdAt: new Date(), updatedAt: new Date() },
    { id: '4', name: 'AWS', category: 'DevOps', level: SkillLevel.BEGINNER, marketDemand: 88, trendingScore: 85, createdAt: new Date(), updatedAt: new Date() },
    { id: '5', name: 'Kubernetes', category: 'DevOps', level: SkillLevel.BEGINNER, marketDemand: 92, trendingScore: 90, createdAt: new Date(), updatedAt: new Date() },
    { id: '6', name: 'Node.js', category: 'Backend', level: SkillLevel.INTERMEDIATE, marketDemand: 78, trendingScore: 82, createdAt: new Date(), updatedAt: new Date() },
    { id: '7', name: 'TypeScript', category: 'Frontend', level: SkillLevel.ADVANCED, marketDemand: 83, trendingScore: 89, createdAt: new Date(), updatedAt: new Date() },
    { id: '8', name: 'GraphQL', category: 'Backend', level: SkillLevel.BEGINNER, marketDemand: 76, trendingScore: 84, createdAt: new Date(), updatedAt: new Date() }
  ]);

  const mockMilestone: Milestone = {
    id: '1',
    title: 'First Path Milestone',
    description: 'Congratulations on completing your first learning milestone!',
    achievedAt: new Date(),
    points: 50,
    badge: 'first-milestone'
  };

  const filteredPaths = learningPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           path.skills.some(skill => skill.skill.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(availableSkills.map(skill => skill.category)))];

  const handleAssessmentComplete = (assessmentData: any) => {
    console.log('Assessment completed:', assessmentData);
    setViewMode('builder');
  };

  const handlePathSave = (pathData: Partial<LearningPath>) => {
    console.log('Path saved:', pathData);
    setViewMode('overview');
  };

  const renderViewContent = () => {
    switch (viewMode) {
      case 'assessment':
        return (
          <SkillAssessment
            onComplete={handleAssessmentComplete}
            availableSkills={availableSkills}
          />
        );

      case 'builder':
        return (
          <PathBuilder
            availableSkills={availableSkills}
            onSave={handlePathSave}
            onCancel={() => setViewMode('overview')}
          />
        );

      case 'progress':
        return (
          <ProgressTracker
            userProgress={userProgress}
            learningPaths={learningPaths}
            currentStreak={7}
            totalHoursLearned={152}
            skillsAcquired={12}
            onStartSession={() => console.log('Session started')}
            onPauseSession={() => console.log('Session paused')}
          />
        );

      case 'timeline':
        return (
          <LearningTimeline
            learningPath={learningPaths[0]}
            userProgress={userProgress}
            milestones={userProgress.flatMap(p => p.milestones)}
            onEventClick={(event) => console.log('Event clicked:', event)}
            onStartMilestone={(milestone) => console.log('Starting milestone:', milestone)}
          />
        );

      case 'radar':
        return (
          <SkillRadar
            userProgress={userProgress}
            skills={availableSkills}
            onSkillClick={(skill) => console.log('Skill clicked:', skill)}
          />
        );

      default:
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Learning <span className="gradient-text-animated">Paths</span>
                </h1>
                <p className="text-gray-600 dark:text-neutral-400 text-lg">
                  Discover and create personalized learning journeys
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <GradientButton 
                  onClick={() => setViewMode('assessment')}
                  size="lg" 
                  className="gap-2"
                >
                  <Target className="w-5 h-5" />
                  Take Assessment
                </GradientButton>
                
                <GradientButton 
                  onClick={() => setViewMode('builder')}
                  variant="secondary"
                  size="lg" 
                  className="gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Path
                </GradientButton>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <GradientButton
                variant="outline"
                onClick={() => setViewMode('progress')}
                className="p-4 h-auto flex-col gap-2"
              >
                <TrendingUp className="h-6 w-6 text-brand-500" />
                <span className="font-medium">Progress</span>
              </GradientButton>
              
              <GradientButton
                variant="outline"
                onClick={() => setViewMode('timeline')}
                className="p-4 h-auto flex-col gap-2"
              >
                <Clock className="h-6 w-6 text-brand-500" />
                <span className="font-medium">Timeline</span>
              </GradientButton>
              
              <GradientButton
                variant="outline"
                onClick={() => setViewMode('radar')}
                className="p-4 h-auto flex-col gap-2"
              >
                <Target className="h-6 w-6 text-brand-500" />
                <span className="font-medium">Skill Radar</span>
              </GradientButton>
              
              <GradientButton
                variant="outline"
                onClick={() => setShowCelebration(true)}
                className="p-4 h-auto flex-col gap-2"
              >
                <Award className="h-6 w-6 text-brand-500" />
                <span className="font-medium">Achievements</span>
              </GradientButton>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search learning paths..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-40 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <GradientButton
                  variant={layoutMode === 'grid' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setLayoutMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </GradientButton>
                <GradientButton
                  variant={layoutMode === 'list' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setLayoutMode('list')}
                >
                  <List className="h-4 w-4" />
                </GradientButton>
              </div>
            </div>

            {/* Learning Paths Grid */}
            <div className={layoutMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
              <AnimatePresence>
                {filteredPaths.map((path, index) => (
                  <motion.div
                    key={path.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full"
                  >
                    <GlassmorphismCard
                      variant="medium"
                      hover={false}
                      depth={path.progress > 0 ? 'triple' : 'double'}
                      className="relative overflow-hidden group cursor-pointer h-full flex flex-col no-flicker stable-hover"
                      onClick={() => setSelectedPath(path)}
                    >
                      {/* Header Section with Icon and Progress */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          
                          {/* Trending Badge - Positioned next to icon */}
                          {path.skills.some(s => s.skill.trendingScore > 90) && (
                            <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Trending
                            </div>
                          )}
                        </div>
                        
                        {/* Progress Percentage - Clear right positioning */}
                        {path.progress > 0 && (
                          <div className="text-right flex-shrink-0">
                            <p className="text-2xl font-bold stat-number">{path.progress}%</p>
                            <p className="text-xs text-gray-500 dark:text-neutral-400">Complete</p>
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">{path.title}</h3>
                      <p className="text-gray-600 dark:text-neutral-400 text-sm mb-4 line-clamp-3 flex-grow">
                        {path.description}
                      </p>
                      
                      {/* Skills Preview */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {path.skills.slice(0, 3).map((pathSkill, i) => (
                          <span 
                            key={i}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300"
                          >
                            {pathSkill.skill.name}
                          </span>
                        ))}
                        {path.skills.length > 3 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-500">
                            +{path.skills.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      {/* Progress Bar */}
                      {path.progress > 0 && (
                        <div className="mb-4">
                          <div className="w-full bg-gray-200 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                            <motion.div 
                              className="bg-gradient-to-r from-brand-600 to-brand-500 h-2 rounded-full relative"
                              initial={{ width: 0 }}
                              animate={{ width: `${path.progress}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            >
                              <div className="absolute inset-0 bg-white/20" />
                            </motion.div>
                          </div>
                        </div>
                      )}

                      {/* Footer Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-brand-800/30 mt-auto">
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-neutral-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {path.duration}w
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {path.skills.length} skills
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              path.difficulty === Difficulty.HARD
                                ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                : path.difficulty === Difficulty.MEDIUM
                                  ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                                  : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            }`}
                          >
                            {path.difficulty.toLowerCase()}
                          </span>
                          
                          {/* Action Button - No more opacity animation to prevent flickering */}
                          <div className="group-hover:scale-105 transition-transform duration-200">
                            <GradientButton 
                              variant="ghost" 
                              size="sm" 
                              className="gap-1 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                            >
                              {path.progress > 0 ? (
                                <>
                                  <PlayCircle className="w-4 h-4" />
                                  Continue
                                </>
                              ) : (
                                <>
                                  <ArrowRight className="w-4 h-4" />
                                  Start
                                </>
                              )}
                            </GradientButton>
                          </div>
                        </div>
                      </div>
                    </GlassmorphismCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredPaths.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                  No learning paths found
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-4">
                  Try adjusting your search or create a new learning path
                </p>
                <GradientButton onClick={() => setViewMode('assessment')} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Your First Path
                </GradientButton>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* View Mode Navigation */}
      {viewMode !== 'overview' && (
        <div className="flex items-center gap-2 mb-6">
          <GradientButton 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode('overview')}
            className="gap-2"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Overview
          </GradientButton>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            / {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
          </div>
        </div>
      )}

      {renderViewContent()}

      {/* Milestone Celebration */}
      <MilestoneCelebration
        milestone={mockMilestone}
        isVisible={showCelebration}
        onClose={() => setShowCelebration(false)}
        celebrationType="achievement"
        showConfetti
      />
    </div>
  );
}