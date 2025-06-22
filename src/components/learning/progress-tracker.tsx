"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Zap,
  Award,
  Calendar,
  BarChart3,
  Activity,
  CheckCircle,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Flame,
  Trophy,
  Star,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react"
import { GlassmorphismCard } from "@/components/custom/glassmorphism-card"
import { GradientButton } from "@/components/custom/gradient-button"
import { NeonBorder } from "@/components/custom/neon-border"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  UserProgress, 
  LearningPath, 
  Skill, 
  SkillLevel,
  Milestone 
} from "@/lib/types"

interface ProgressTrackerProps {
  userProgress: UserProgress[]
  learningPaths: LearningPath[]
  currentStreak: number
  totalHoursLearned: number
  skillsAcquired: number
  onStartSession?: () => void
  onPauseSession?: () => void
  isSessionActive?: boolean
}

interface ProgressStats {
  completionRate: number
  weeklyProgress: number
  averageSessionTime: number
  skillsImprovedThisWeek: number
  hoursThisWeek: number
  streakStatus: "rising" | "stable" | "declining"
}

const skillLevelColors = {
  [SkillLevel.BEGINNER]: "from-gray-400 to-gray-500",
  [SkillLevel.INTERMEDIATE]: "from-blue-400 to-blue-600", 
  [SkillLevel.ADVANCED]: "from-purple-400 to-purple-600",
  [SkillLevel.EXPERT]: "from-yellow-400 to-yellow-600"
}

const skillLevelLabels = {
  [SkillLevel.BEGINNER]: "Beginner",
  [SkillLevel.INTERMEDIATE]: "Intermediate",
  [SkillLevel.ADVANCED]: "Advanced", 
  [SkillLevel.EXPERT]: "Expert"
}

export function ProgressTracker({
  userProgress,
  learningPaths,
  currentStreak,
  totalHoursLearned,
  skillsAcquired,
  onStartSession,
  onPauseSession,
  isSessionActive = false
}: ProgressTrackerProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"week" | "month" | "year">("week")
  const [showMilestones, setShowMilestones] = useState(false)

  // Calculate progress statistics
  const progressStats: ProgressStats = useMemo(() => {
    const totalSkills = userProgress.length
    const completedSkills = userProgress.filter(p => p.progressPercentage >= 100).length
    
    return {
      completionRate: totalSkills > 0 ? (completedSkills / totalSkills) * 100 : 0,
      weeklyProgress: 12, // Mock data - would be calculated from actual progress
      averageSessionTime: 45, // Mock data
      skillsImprovedThisWeek: 3, // Mock data
      hoursThisWeek: 8, // Mock data
      streakStatus: currentStreak > 5 ? "rising" : currentStreak > 2 ? "stable" : "declining"
    }
  }, [userProgress, currentStreak])

  // Get recent milestones
  const recentMilestones = useMemo(() => {
    return userProgress
      .flatMap(p => p.milestones)
      .filter(m => m.achievedAt)
      .sort((a, b) => new Date(b.achievedAt!).getTime() - new Date(a.achievedAt!).getTime())
      .slice(0, 5)
  }, [userProgress])

  const getStreakIcon = () => {
    switch (progressStats.streakStatus) {
      case "rising": return <ArrowUp className="h-4 w-4 text-green-500" />
      case "declining": return <ArrowDown className="h-4 w-4 text-red-500" />
      default: return <Minus className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStreakColor = () => {
    switch (progressStats.streakStatus) {
      case "rising": return "from-green-500 to-emerald-500"
      case "declining": return "from-red-500 to-pink-500"
      default: return "from-yellow-500 to-orange-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Session Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
            Progress Tracker
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor your learning journey and celebrate achievements
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Session Controls */}
          <div className="flex items-center gap-2">
            {isSessionActive ? (
              <GradientButton 
                variant="secondary" 
                onClick={onPauseSession}
                className="gap-2"
              >
                <Pause className="h-4 w-4" />
                Pause Session
              </GradientButton>
            ) : (
              <GradientButton 
                onClick={onStartSession}
                className="gap-2 animate-pulse"
              >
                <Play className="h-4 w-4" />
                Start Learning
              </GradientButton>
            )}
          </div>

          {/* Timeframe Selector */}
          <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
            {["week", "month", "year"].map((timeframe) => (
              <GradientButton
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe as any)}
                className={`${
                  selectedTimeframe === timeframe
                    ? "bg-white dark:bg-gray-700 shadow-sm"
                    : ""
                }`}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </GradientButton>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Streak */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <GlassmorphismCard variant="subtle" className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${getStreakColor()}`}>
                <Flame className="h-5 w-5 text-white" />
              </div>
              {getStreakIcon()}
            </div>
            <div className="text-2xl font-bold">{currentStreak}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
          </GlassmorphismCard>
        </motion.div>

        {/* Total Hours */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <GlassmorphismCard variant="subtle" className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <Badge variant="secondary" className="text-xs">
                +{progressStats.hoursThisWeek}h this week
              </Badge>
            </div>
            <div className="text-2xl font-bold">{totalHoursLearned}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Hours Learned</p>
          </GlassmorphismCard>
        </motion.div>

        {/* Skills Acquired */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <GlassmorphismCard variant="subtle" className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <Badge variant="secondary" className="text-xs">
                +{progressStats.skillsImprovedThisWeek} this week
              </Badge>
            </div>
            <div className="text-2xl font-bold">{skillsAcquired}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Skills Acquired</p>
          </GlassmorphismCard>
        </motion.div>

        {/* Completion Rate */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <GlassmorphismCard variant="subtle" className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <Target className="h-5 w-5 text-white" />
              </div>
              <Badge variant="secondary" className="text-xs">
                +{progressStats.weeklyProgress}% this week
              </Badge>
            </div>
            <div className="text-2xl font-bold">{Math.round(progressStats.completionRate)}%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
          </GlassmorphismCard>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skills Progress */}
        <GlassmorphismCard variant="default" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-brand-500" />
              Skills Progress
            </h3>
            <GradientButton variant="outline" size="sm">
              View All
            </GradientButton>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {userProgress.slice(0, 6).map((progress) => (
              <motion.div
                key={progress.skillId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <NeonBorder color="blue" className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">Skill {progress.skillId}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{skillLevelLabels[progress.currentLevel]}</span>
                        <span>→</span>
                        <span className="text-brand-600">{skillLevelLabels[progress.targetLevel]}</span>
                      </div>
                    </div>
                    <Badge 
                      className={`bg-gradient-to-r ${skillLevelColors[progress.currentLevel]} text-white`}
                    >
                      {Math.round(progress.progressPercentage)}%
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Progress 
                      value={progress.progressPercentage} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500">
                      <span>{progress.hoursSpent}h spent</span>
                      <span>{new Date(progress.lastActivity).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Milestones */}
                  {progress.milestones.length > 0 && (
                    <div className="flex gap-1 mt-3">
                      {progress.milestones.slice(0, 3).map((milestone) => (
                        <div
                          key={milestone.id}
                          className={`p-1 rounded ${
                            milestone.achievedAt 
                              ? "bg-green-100 dark:bg-green-900/30" 
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          {milestone.achievedAt ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <Circle className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      ))}
                      {progress.milestones.length > 3 && (
                        <span className="text-xs text-gray-500 self-center">
                          +{progress.milestones.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </NeonBorder>
              </motion.div>
            ))}
          </div>
        </GlassmorphismCard>

        {/* Learning Path Progress */}
        <GlassmorphismCard variant="default" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-brand-500" />
              Learning Paths
            </h3>
            <GradientButton 
              variant="outline" 
              size="sm"
              onClick={() => setShowMilestones(!showMilestones)}
            >
              {showMilestones ? "Hide" : "Show"} Milestones
            </GradientButton>
          </div>

          <div className="space-y-4">
            {learningPaths.slice(0, 3).map((path) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <NeonBorder color="purple" className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{path.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {path.duration} weeks • {path.skills.length} skills
                      </p>
                    </div>
                    <Badge 
                      variant={path.progress >= 100 ? "default" : "secondary"}
                      className={path.progress >= 100 ? "bg-green-500" : ""}
                    >
                      {path.progress}%
                    </Badge>
                  </div>

                  <Progress value={path.progress} className="h-2 mb-3" />

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {path.duration}w
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {path.skills.length} skills
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Updated {new Date(path.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </NeonBorder>
              </motion.div>
            ))}
          </div>

          {/* Recent Milestones */}
          <AnimatePresence>
            {showMilestones && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-yellow-500" />
                  Recent Achievements
                </h4>
                <div className="space-y-2">
                  {recentMilestones.map((milestone) => (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20"
                    >
                      <Star className="h-4 w-4 text-yellow-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{milestone.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {milestone.achievedAt && new Date(milestone.achievedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        +{milestone.points} pts
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassmorphismCard>
      </div>
    </div>
  )
}