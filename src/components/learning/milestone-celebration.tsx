"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Confetti from "react-confetti"
import { 
  Trophy,
  Award,
  Star,
  Zap,
  Target,
  Crown,
  Gem,
  Sparkles,
  Gift,
  PartyPopper,
  Heart,
  Flame,
  CheckCircle,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  X,
  Share,
  Download,
  Repeat
} from "lucide-react"
import { GlassmorphismCard } from "@/components/custom/glassmorphism-card"
import { GradientButton } from "@/components/custom/gradient-button"
import { NeonBorder } from "@/components/custom/neon-border"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Milestone } from "@/lib/types"

interface MilestoneCelebrationProps {
  milestone: Milestone
  isVisible: boolean
  onClose: () => void
  onShare?: () => void
  onContinue?: () => void
  showConfetti?: boolean
  celebrationType?: "achievement" | "skill_mastery" | "streak" | "path_completion" | "level_up"
}

interface CelebrationTheme {
  colors: string[]
  icon: any
  title: string
  subtitle: string
  gradient: string
  particleCount: number
  duration: number
}

const celebrationThemes: Record<string, CelebrationTheme> = {
  achievement: {
    colors: ["#FFD700", "#FFA500", "#FF6347"],
    icon: Trophy,
    title: "Achievement Unlocked!",
    subtitle: "You've reached a new milestone",
    gradient: "from-yellow-400 via-orange-500 to-red-500",
    particleCount: 150,
    duration: 4000
  },
  skill_mastery: {
    colors: ["#9333EA", "#C084FC", "#E879F9"],
    icon: Gem,
    title: "Skill Mastered!",
    subtitle: "You've achieved expertise in this area",
    gradient: "from-purple-600 via-purple-400 to-pink-400",
    particleCount: 200,
    duration: 5000
  },
  streak: {
    colors: ["#EF4444", "#F97316", "#FBBF24"],
    icon: Flame,
    title: "Streak Extended!",
    subtitle: "Your dedication is paying off",
    gradient: "from-red-500 via-orange-500 to-yellow-400",
    particleCount: 100,
    duration: 3000
  },
  path_completion: {
    colors: ["#10B981", "#059669", "#047857"],
    icon: Crown,
    title: "Path Completed!",
    subtitle: "Congratulations on finishing your journey",
    gradient: "from-emerald-500 via-green-600 to-green-700",
    particleCount: 300,
    duration: 6000
  },
  level_up: {
    colors: ["#3B82F6", "#1D4ED8", "#1E3A8A"],
    icon: Star,
    title: "Level Up!",
    subtitle: "You've advanced to the next level",
    gradient: "from-blue-500 via-blue-600 to-blue-800",
    particleCount: 180,
    duration: 4500
  }
}

export function MilestoneCelebration({
  milestone,
  isVisible,
  onClose,
  onShare,
  onContinue,
  showConfetti = true,
  celebrationType = "achievement"
}: MilestoneCelebrationProps) {
  const [showCelebration, setShowCelebration] = useState(false)
  const [confettiActive, setConfettiActive] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  const theme = celebrationThemes[celebrationType]
  const Icon = theme.icon

  // Handle window resize for confetti
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateWindowSize()
    window.addEventListener("resize", updateWindowSize)
    return () => window.removeEventListener("resize", updateWindowSize)
  }, [])

  // Show celebration when milestone becomes visible
  useEffect(() => {
    if (isVisible) {
      setShowCelebration(true)
      if (showConfetti) {
        setConfettiActive(true)
        const timer = setTimeout(() => {
          setConfettiActive(false)
        }, theme.duration)
        return () => clearTimeout(timer)
      }
    } else {
      setShowCelebration(false)
      setConfettiActive(false)
    }
  }, [isVisible, showConfetti, theme.duration])

  const handleClose = useCallback(() => {
    setShowCelebration(false)
    setConfettiActive(false)
    setTimeout(() => onClose(), 300)
  }, [onClose])

  const formatDate = (date?: Date) => {
    if (!date) return "Recently"
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const getBadgeForPoints = (points: number) => {
    if (points >= 100) return { label: "Legendary", color: "from-yellow-500 to-orange-500" }
    if (points >= 50) return { label: "Epic", color: "from-purple-500 to-pink-500" }
    if (points >= 25) return { label: "Rare", color: "from-blue-500 to-cyan-500" }
    return { label: "Common", color: "from-gray-400 to-gray-600" }
  }

  if (!showCelebration) return null

  const badge = getBadgeForPoints(milestone.points)

  return (
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          {/* Confetti */}
          {confettiActive && showConfetti && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={theme.particleCount}
              colors={theme.colors}
              gravity={0.3}
              wind={0.05}
              initialVelocityX={5}
              initialVelocityY={20}
              opacity={0.8}
            />
          )}

          {/* Celebration Modal */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              transition: {
                type: "spring",
                damping: 15,
                stiffness: 300
              }
            }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            className="relative w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <GradientButton
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg"
            >
              <X className="h-4 w-4" />
            </GradientButton>

            <NeonBorder color="purple" className="relative overflow-hidden">
              {/* Background Animation */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-10`}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <div className="relative p-8 text-center">
                {/* Animated Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: 1, 
                    rotate: 0,
                    transition: {
                      type: "spring",
                      damping: 10,
                      stiffness: 200,
                      delay: 0.3
                    }
                  }}
                  className="mb-6 flex justify-center"
                >
                  <div className={`p-6 rounded-full bg-gradient-to-br ${theme.gradient} shadow-2xl`}>
                    <Icon className="h-12 w-12 text-white" />
                    
                    {/* Sparkle Effects */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(255, 255, 255, 0.7)",
                          "0 0 0 20px rgba(255, 255, 255, 0)",
                          "0 0 0 0 rgba(255, 255, 255, 0)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 1
                      }}
                    />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className={`text-4xl font-bold mb-2 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}
                >
                  {theme.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="text-lg text-gray-600 dark:text-gray-400 mb-6"
                >
                  {theme.subtitle}
                </motion.p>

                {/* Milestone Details */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="mb-8"
                >
                  <GlassmorphismCard variant="subtle" className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">{milestone.title}</h3>
                      <Badge className={`bg-gradient-to-r ${badge.color} text-white`}>
                        {badge.label}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-left mb-4">
                      {milestone.description}
                    </p>

                    {/* Milestone Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-2xl font-bold text-yellow-600">
                            {milestone.points}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Points Earned</span>
                      </div>
                      
                      <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium text-blue-600">
                            {formatDate(milestone.achievedAt)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Achievement Date</span>
                      </div>
                    </div>

                    {/* Achievement Badge Display */}
                    {milestone.badge && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.2, type: "spring" }}
                        className="mt-4 flex justify-center"
                      >
                        <div className="p-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                          <Award className="h-8 w-8 text-white" />
                        </div>
                      </motion.div>
                    )}
                  </GlassmorphismCard>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                  {onShare && (
                    <GradientButton
                      variant="secondary"
                      onClick={onShare}
                      className="gap-2"
                    >
                      <Share className="h-4 w-4" />
                      Share Achievement
                    </GradientButton>
                  )}

                  {onContinue ? (
                    <GradientButton
                      onClick={onContinue}
                      className="gap-2"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Continue Learning
                    </GradientButton>
                  ) : (
                    <GradientButton
                      onClick={handleClose}
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Awesome!
                    </GradientButton>
                  )}
                </motion.div>

                {/* Fun Stats (Optional) */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.6 }}
                  className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Top 15% of learners</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Achieved in record time</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [-20, -100, -20],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </NeonBorder>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Additional celebration variants for different milestone types
export function QuickCelebration({ 
  title, 
  points, 
  icon: Icon = Star, 
  color = "from-brand-500 to-purple-500",
  onClose 
}: {
  title: string
  points: number
  icon?: any
  color?: string
  onClose: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      className="fixed top-4 right-4 z-50"
    >
      <NeonBorder color="purple" className="p-4 min-w-[200px]">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              +{points} points
            </p>
          </div>
        </div>
      </NeonBorder>
    </motion.div>
  )
}

// Progress celebration for incremental achievements
export function ProgressCelebration({
  progress,
  skillName,
  onClose
}: {
  progress: number
  skillName: string
  onClose: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <GlassmorphismCard variant="default" className="p-4 min-w-[250px]">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold">Progress Made!</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {skillName}
            </p>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 text-center">
          {progress}% Complete
        </p>
      </GlassmorphismCard>
    </motion.div>
  )
}