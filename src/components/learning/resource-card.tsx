"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Star, 
  Clock, 
  Users, 
  ExternalLink, 
  DollarSign,
  Bookmark,
  Play,
  Download,
  BookOpen,
  Video,
  FileText,
  Code,
  Zap,
  TrendingUp,
  Award,
  CheckCircle
} from "lucide-react"
import { GlassmorphismCard } from "@/components/custom/glassmorphism-card"
import { GradientButton } from "@/components/custom/gradient-button"
import { NeonBorder } from "@/components/custom/neon-border"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Resource, 
  ResourceType, 
  Difficulty 
} from "@/lib/types"

interface ResourceCardProps {
  resource: Resource
  onAddToPath?: (resource: Resource) => void
  onStartLearning?: (resource: Resource) => void
  isInPath?: boolean
  progress?: number
  showProgress?: boolean
  variant?: "compact" | "detailed" | "featured"
}

const resourceTypeIcons = {
  [ResourceType.VIDEO]: Video,
  [ResourceType.ARTICLE]: FileText,
  [ResourceType.COURSE]: BookOpen,
  [ResourceType.BOOK]: BookOpen,
  [ResourceType.TUTORIAL]: Code,
  [ResourceType.PRACTICE]: Zap
}

const resourceTypeColors = {
  [ResourceType.VIDEO]: "from-red-500 to-pink-500",
  [ResourceType.ARTICLE]: "from-blue-500 to-cyan-500",
  [ResourceType.COURSE]: "from-purple-500 to-indigo-500",
  [ResourceType.BOOK]: "from-green-500 to-emerald-500",
  [ResourceType.TUTORIAL]: "from-yellow-500 to-orange-500",
  [ResourceType.PRACTICE]: "from-violet-500 to-purple-500"
}

const difficultyColors = {
  [Difficulty.EASY]: "text-green-600 bg-green-100 dark:bg-green-900/30",
  [Difficulty.MEDIUM]: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
  [Difficulty.HARD]: "text-red-600 bg-red-100 dark:bg-red-900/30"
}

export function ResourceCard({ 
  resource, 
  onAddToPath, 
  onStartLearning, 
  isInPath = false,
  progress = 0,
  showProgress = false,
  variant = "detailed"
}: ResourceCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const Icon = resourceTypeIcons[resource.type]
  const typeColor = resourceTypeColors[resource.type]

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getDifficultyLabel = (difficulty?: Difficulty) => {
    if (!difficulty) return null
    return difficulty.charAt(0) + difficulty.slice(1).toLowerCase()
  }

  if (variant === "compact") {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <GlassmorphismCard 
          variant="subtle" 
          hover
          className="p-4 cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${typeColor}`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{resource.title}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                {resource.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(resource.duration)}
                  </span>
                )}
                {resource.rating && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    {resource.rating}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {resource.isFree ? (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  Free
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  ${resource.price}
                </Badge>
              )}
              
              {isHovered && onAddToPath && !isInPath && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <GradientButton 
                    size="sm" 
                    variant="ghost"
                    onClick={() => onAddToPath(resource)}
                  >
                    <Bookmark className="h-4 w-4" />
                  </GradientButton>
                </motion.div>
              )}
            </div>
          </div>

          {showProgress && progress > 0 && (
            <div className="mt-3">
              <Progress value={progress} className="h-1" />
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {progress}% complete
              </p>
            </div>
          )}
        </GlassmorphismCard>
      </motion.div>
    )
  }

  if (variant === "featured") {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <NeonBorder 
          color="purple" 
          className="relative overflow-hidden group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Featured Badge */}
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Award className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          </div>

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${typeColor} shadow-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{resource.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  by {resource.provider}
                </p>
              </div>

              <GradientButton
                variant="ghost"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? "text-yellow-500" : ""}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              </GradientButton>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
              {resource.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDuration(resource.duration)}
                </div>
              )}
              
              {resource.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  {resource.rating} (4.2k reviews)
                </div>
              )}

              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                12.3k students
              </div>

              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Trending
              </div>
            </div>

            {/* Difficulty & Price */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {resource.difficulty && (
                  <Badge className={difficultyColors[resource.difficulty]}>
                    {getDifficultyLabel(resource.difficulty)}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {resource.type.toLowerCase()}
                </Badge>
              </div>

              <div className="text-right">
                {resource.isFree ? (
                  <div className="text-lg font-bold text-green-600">Free</div>
                ) : (
                  <div>
                    <div className="text-lg font-bold">${resource.price}</div>
                    <div className="text-xs text-gray-500 line-through">$99</div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress (if applicable) */}
            {showProgress && progress > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Your Progress</span>
                  <span className="text-sm text-brand-600">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {onStartLearning && (
                <GradientButton 
                  onClick={() => onStartLearning(resource)}
                  className="flex-1 gap-2"
                >
                  {progress > 0 ? (
                    <>
                      <Play className="h-4 w-4" />
                      Continue
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Start Learning
                    </>
                  )}
                </GradientButton>
              )}

              {onAddToPath && !isInPath && (
                <GradientButton 
                  variant="outline"
                  onClick={() => onAddToPath(resource)}
                  className="gap-2"
                >
                  <Bookmark className="h-4 w-4" />
                  Add to Path
                </GradientButton>
              )}

              <GradientButton variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </GradientButton>
            </div>
          </div>

          {/* Hover Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
          />
        </NeonBorder>
      </motion.div>
    )
  }

  // Default detailed variant
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <GlassmorphismCard 
        variant="default" 
        hover
        className="relative overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${typeColor}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              
              <div>
                <h4 className="font-semibold text-lg">{resource.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {resource.provider}
                </p>
              </div>
            </div>

            <GradientButton
              variant="ghost"
              size="sm"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={isBookmarked ? "text-yellow-500" : ""}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </GradientButton>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
            {resource.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(resource.duration)}
              </div>
            )}
            
            {resource.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                {resource.rating}
              </div>
            )}

            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              2.4k
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            {resource.difficulty && (
              <Badge className={difficultyColors[resource.difficulty]}>
                {getDifficultyLabel(resource.difficulty)}
              </Badge>
            )}
            
            <Badge variant="outline" className="text-xs">
              {resource.type.toLowerCase()}
            </Badge>

            {resource.isFree && (
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30">
                Free
              </Badge>
            )}
          </div>

          {/* Progress (if applicable) */}
          {showProgress && progress > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-brand-600">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-lg font-bold">
              {resource.isFree ? (
                <span className="text-green-600">Free</span>
              ) : (
                <span>${resource.price}</span>
              )}
            </div>

            <div className="flex gap-2">
              {onStartLearning && (
                <GradientButton 
                  size="sm"
                  onClick={() => onStartLearning(resource)}
                  className="gap-1"
                >
                  {progress > 0 ? (
                    <>
                      <Play className="h-3 w-3" />
                      Continue
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3" />
                      Start
                    </>
                  )}
                </GradientButton>
              )}

              {onAddToPath && !isInPath && (
                <GradientButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => onAddToPath(resource)}
                  className="gap-1"
                >
                  <Bookmark className="h-3 w-3" />
                  Add
                </GradientButton>
              )}

              {isInPath && (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  In Path
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Hover Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />
      </GlassmorphismCard>
    </motion.div>
  )
}