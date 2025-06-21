"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Target, 
  ChevronRight,
  RefreshCw,
  Zap,
  Award,
  BookOpen
} from "lucide-react"
import { GlassmorphismCard } from "@/components/custom/glassmorphism-card"
import { GradientButton } from "@/components/custom/gradient-button"
import { SkillRecommendation, PathRecommendation } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SmartSuggestionsProps {
  skillRecommendations?: SkillRecommendation[]
  pathRecommendations?: PathRecommendation[]
  nextAction?: {
    action: string
    reason: string
    expectedOutcome: string
    timeRequired: number
  }
  isLoading?: boolean
  onRefresh?: () => void
  onSelectSkill?: (skill: SkillRecommendation) => void
  onSelectPath?: (path: PathRecommendation) => void
  className?: string
}

export function SmartSuggestions({
  skillRecommendations = [],
  pathRecommendations = [],
  nextAction,
  isLoading = false,
  onRefresh,
  onSelectSkill,
  onSelectPath,
  className
}: SmartSuggestionsProps) {
  const [activeTab, setActiveTab] = useState<"skills" | "paths" | "action">("action")
  const [animationKey, setAnimationKey] = useState(0)

  // Trigger animation when data changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1)
  }, [skillRecommendations, pathRecommendations, nextAction])

  const tabs = [
    { id: "action", label: "Next Best Action", icon: Target },
    { id: "skills", label: "Skill Recommendations", icon: Sparkles },
    { id: "paths", label: "Learning Paths", icon: BookOpen }
  ]

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-600" />
          AI-Powered Suggestions
        </h3>
        
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn(
              "w-4 h-4 text-gray-600 dark:text-gray-400",
              isLoading && "animate-spin"
            )} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all",
              activeTab === tab.id
                ? "bg-white dark:bg-gray-700 shadow-sm text-brand-600 dark:text-brand-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTab}-${animationKey}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "action" && nextAction && (
            <GlassmorphismCard variant="double" className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {nextAction.action}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {nextAction.reason}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {nextAction.timeRequired} minutes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Quick win
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expected Outcome:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {nextAction.expectedOutcome}
                  </p>
                </div>

                <GradientButton variant="primary" size="md" className="w-full">
                  Start Now
                  <ChevronRight className="w-4 h-4 ml-1" />
                </GradientButton>
              </div>
            </GlassmorphismCard>
          )}

          {activeTab === "skills" && (
            <div className="space-y-3">
              {skillRecommendations.length === 0 ? (
                <GlassmorphismCard className="p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    No skill recommendations available yet. Complete your assessment to get started!
                  </p>
                </GlassmorphismCard>
              ) : (
                skillRecommendations.map((recommendation, index) => (
                  <motion.div
                    key={recommendation.skill.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassmorphismCard 
                      className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => onSelectSkill?.(recommendation)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {recommendation.skill.name}
                            </h4>
                            <span className={cn(
                              "px-2 py-0.5 text-xs rounded-full",
                              recommendation.matchScore >= 80
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                : recommendation.matchScore >= 60
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            )}>
                              {recommendation.matchScore}% match
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {recommendation.reason}
                          </p>

                          <div className="flex flex-wrap gap-4 text-xs">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {recommendation.requiredTime}h to learn
                              </span>
                            </div>
                            {recommendation.potentialSalaryIncrease && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3 text-gray-500" />
                                <span className="text-gray-600 dark:text-gray-400">
                                  +${recommendation.potentialSalaryIncrease.toLocaleString()}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {recommendation.skill.marketDemand}% demand
                              </span>
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                      </div>
                    </GlassmorphismCard>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === "paths" && (
            <div className="space-y-3">
              {pathRecommendations.length === 0 ? (
                <GlassmorphismCard className="p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    No learning paths available yet. Tell us about your career goals!
                  </p>
                </GlassmorphismCard>
              ) : (
                pathRecommendations.map((path, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassmorphismCard 
                      variant="double"
                      className="p-5 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => onSelectPath?.(path)}
                    >
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {path.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {path.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
                            {path.targetRole}
                          </span>
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            path.difficulty === "EASY"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                              : path.difficulty === "MEDIUM"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          )}>
                            {path.difficulty}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-2">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {path.estimatedDuration} weeks
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Avg Salary</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              ${path.careerOutlook.averageSalary.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Growth</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              +{path.careerOutlook.jobGrowth}%
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex -space-x-2">
                            {path.skills.slice(0, 4).map((skill, idx) => (
                              <div
                                key={idx}
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xs font-medium text-white border-2 border-white dark:border-gray-800"
                                title={skill.name}
                              >
                                {skill.name.charAt(0)}
                              </div>
                            ))}
                            {path.skills.length > 4 && (
                              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 border-2 border-white dark:border-gray-800">
                                +{path.skills.length - 4}
                              </div>
                            )}
                          </div>

                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </GlassmorphismCard>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
