"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Target,
  Award,
  Zap,
  Book,
  Trophy,
  Star,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  AlertCircle,
  Flame,
  Users,
  TrendingUp
} from "lucide-react"
import { GlassmorphismCard } from "@/components/custom/glassmorphism-card"
import { GradientButton } from "@/components/custom/gradient-button"
import { NeonBorder } from "@/components/custom/neon-border"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  LearningPath, 
  Milestone, 
  UserProgress,
  Skill,
  SkillLevel 
} from "@/lib/types"

interface TimelineEvent {
  id: string
  type: "milestone" | "skill_completed" | "path_started" | "achievement" | "deadline"
  title: string
  description: string
  date: Date
  isCompleted: boolean
  isUpcoming: boolean
  priority: "low" | "medium" | "high"
  relatedSkills?: string[]
  points?: number
  icon: any
  color: string
}

interface LearningTimelineProps {
  learningPath: LearningPath
  userProgress: UserProgress[]
  milestones: Milestone[]
  onEventClick?: (event: TimelineEvent) => void
  onStartMilestone?: (milestone: Milestone) => void
  showCelebrations?: boolean
}

const eventTypeIcons = {
  milestone: Award,
  skill_completed: CheckCircle,
  path_started: Play,
  achievement: Trophy,
  deadline: AlertCircle
}

const eventTypeColors = {
  milestone: "from-yellow-500 to-orange-500",
  skill_completed: "from-green-500 to-emerald-500", 
  path_started: "from-blue-500 to-cyan-500",
  achievement: "from-purple-500 to-pink-500",
  deadline: "from-red-500 to-pink-500"
}

const priorityColors = {
  low: "border-gray-300 dark:border-gray-600",
  medium: "border-yellow-400 dark:border-yellow-500",
  high: "border-red-400 dark:border-red-500"
}

export function LearningTimeline({
  learningPath,
  userProgress,
  milestones,
  onEventClick,
  onStartMilestone,
  showCelebrations = true
}: LearningTimelineProps) {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "completed" | "upcoming" | "overdue">("all")
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Generate timeline events from various sources
  const timelineEvents: TimelineEvent[] = useMemo(() => {
    const events: TimelineEvent[] = []

    // Add path start event
    events.push({
      id: `path-start-${learningPath.id}`,
      type: "path_started",
      title: `Started "${learningPath.title}"`,
      description: `Began learning journey toward ${learningPath.targetRole}`,
      date: learningPath.createdAt,
      isCompleted: true,
      isUpcoming: false,
      priority: "medium",
      icon: Play,
      color: eventTypeColors.path_started,
      points: 10
    })

    // Add milestones
    milestones.forEach((milestone) => {
      events.push({
        id: `milestone-${milestone.id}`,
        type: "milestone",
        title: milestone.title,
        description: milestone.description,
        date: milestone.achievedAt || new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Future date if not achieved
        isCompleted: !!milestone.achievedAt,
        isUpcoming: !milestone.achievedAt,
        priority: milestone.points > 50 ? "high" : milestone.points > 20 ? "medium" : "low",
        icon: Award,
        color: eventTypeColors.milestone,
        points: milestone.points
      })
    })

    // Add skill completion events from progress
    userProgress.forEach((progress) => {
      if (progress.progressPercentage >= 100) {
        events.push({
          id: `skill-${progress.skillId}`,
          type: "skill_completed",
          title: `Mastered Skill`,
          description: `Reached ${progress.targetLevel} level`,
          date: progress.lastActivity,
          isCompleted: true,
          isUpcoming: false,
          priority: "medium",
          relatedSkills: [progress.skillId],
          icon: CheckCircle,
          color: eventTypeColors.skill_completed,
          points: 25
        })
      }
    })

    // Add upcoming deadlines (mock data)
    const upcomingDeadlines = [
      {
        title: "Complete React Fundamentals",
        description: "Finish basic React concepts before advanced topics",
        daysFromNow: 7,
        priority: "high" as const
      },
      {
        title: "Mid-path Review",
        description: "Review progress and adjust learning plan",
        daysFromNow: 14,
        priority: "medium" as const
      }
    ]

    upcomingDeadlines.forEach((deadline, index) => {
      const date = new Date()
      date.setDate(date.getDate() + deadline.daysFromNow)
      
      events.push({
        id: `deadline-${index}`,
        type: "deadline",
        title: deadline.title,
        description: deadline.description,
        date,
        isCompleted: false,
        isUpcoming: true,
        priority: deadline.priority,
        icon: AlertCircle,
        color: eventTypeColors.deadline
      })
    })

    return events.sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [learningPath, userProgress, milestones])

  // Filter events based on selected filter
  const filteredEvents = useMemo(() => {
    switch (selectedFilter) {
      case "completed":
        return timelineEvents.filter(e => e.isCompleted)
      case "upcoming":
        return timelineEvents.filter(e => e.isUpcoming)
      case "overdue":
        return timelineEvents.filter(e => 
          e.isUpcoming && e.date < new Date() && e.type === "deadline"
        )
      default:
        return timelineEvents
    }
  }, [timelineEvents, selectedFilter])

  // Calculate timeline statistics
  const timelineStats = useMemo(() => {
    const completed = timelineEvents.filter(e => e.isCompleted).length
    const total = timelineEvents.length
    const totalPoints = timelineEvents
      .filter(e => e.isCompleted && e.points)
      .reduce((sum, e) => sum + (e.points || 0), 0)
    
    return {
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      totalEvents: total,
      completedEvents: completed,
      totalPoints,
      upcomingEvents: timelineEvents.filter(e => e.isUpcoming).length
    }
  }, [timelineEvents])

  const formatRelativeDate = (date: Date) => {
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays === -1) return "Yesterday"
    if (diffDays > 0) return `In ${diffDays} days`
    return `${Math.abs(diffDays)} days ago`
  }

  const getEventPriorityBorder = (priority: TimelineEvent["priority"]) => {
    return priorityColors[priority]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
            Learning Timeline
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your progress and celebrate milestones
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GradientButton
            variant={showDetails ? "primary" : "outline"}
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide" : "Show"} Details
          </GradientButton>
        </div>
      </div>

      {/* Timeline Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassmorphismCard variant="subtle" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">{timelineStats.completedEvents}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </div>
          </div>
        </GlassmorphismCard>

        <GlassmorphismCard variant="subtle" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">{timelineStats.upcomingEvents}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
            </div>
          </div>
        </GlassmorphismCard>

        <GlassmorphismCard variant="subtle" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">{timelineStats.totalPoints}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Points Earned</p>
            </div>
          </div>
        </GlassmorphismCard>

        <GlassmorphismCard variant="subtle" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">{Math.round(timelineStats.completionRate)}%</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
            </div>
          </div>
        </GlassmorphismCard>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <GlassmorphismCard variant="subtle" className="p-4">
            <h3 className="font-semibold mb-4">Filter Events</h3>
            <div className="space-y-2">
              {[
                { key: "all", label: "All Events", count: timelineEvents.length },
                { key: "completed", label: "Completed", count: timelineStats.completedEvents },
                { key: "upcoming", label: "Upcoming", count: timelineStats.upcomingEvents },
                { key: "overdue", label: "Overdue", count: timelineEvents.filter(e => e.isUpcoming && e.date < new Date() && e.type === "deadline").length }
              ].map((filter) => (
                <GradientButton
                  key={filter.key}
                  variant={selectedFilter === filter.key ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter.key as any)}
                  className="w-full justify-between"
                >
                  {filter.label}
                  <Badge variant="secondary" className="ml-2">
                    {filter.count}
                  </Badge>
                </GradientButton>
              ))}
            </div>

            {/* Overall Progress */}
            <div className="mt-6">
              <h4 className="font-medium mb-2">Overall Progress</h4>
              <Progress value={timelineStats.completionRate} className="h-2 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {timelineStats.completedEvents} of {timelineStats.totalEvents} events completed
              </p>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-3">
          <GlassmorphismCard variant="default" className="p-6">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-500 to-purple-500 opacity-30" />
              
              <div className="space-y-6">
                <AnimatePresence>
                  {filteredEvents.map((event, index) => {
                    const Icon = event.icon
                    const isExpanded = expandedEvent === event.id
                    
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                      >
                        {/* Timeline Dot */}
                        <div className="absolute left-6 w-4 h-4 z-10">
                          <div className={`w-full h-full rounded-full border-2 ${
                            event.isCompleted 
                              ? "bg-green-500 border-green-500" 
                              : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                          } ${getEventPriorityBorder(event.priority)}`} />
                        </div>

                        {/* Event Card */}
                        <div className="ml-16">
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="cursor-pointer"
                            onClick={() => {
                              setExpandedEvent(isExpanded ? null : event.id)
                              onEventClick?.(event)
                            }}
                          >
                            <NeonBorder 
                              color={event.isCompleted ? "green" : event.isUpcoming ? "blue" : "gray"}
                              className={`p-4 ${getEventPriorityBorder(event.priority)}`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className={`p-2 rounded-lg bg-gradient-to-br ${event.color}`}>
                                    <Icon className="h-5 w-5 text-white" />
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold">{event.title}</h4>
                                      {event.priority === "high" && (
                                        <Badge variant="destructive" className="text-xs">
                                          High Priority
                                        </Badge>
                                      )}
                                      {event.isCompleted && (
                                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 text-xs">
                                          Completed
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                      {event.description}
                                    </p>
                                    
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {formatRelativeDate(event.date)}
                                      </span>
                                      
                                      {event.points && (
                                        <span className="flex items-center gap-1">
                                          <Star className="h-3 w-3 text-yellow-500" />
                                          +{event.points} pts
                                        </span>
                                      )}
                                      
                                      {event.relatedSkills && (
                                        <span className="flex items-center gap-1">
                                          <Book className="h-3 w-3" />
                                          {event.relatedSkills.length} skills
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {event.type === "milestone" && !event.isCompleted && onStartMilestone && (
                                    <GradientButton
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        const milestone = milestones.find(m => `milestone-${m.id}` === event.id)
                                        if (milestone) onStartMilestone(milestone)
                                      }}
                                      className="gap-1"
                                    >
                                      <Play className="h-3 w-3" />
                                      Start
                                    </GradientButton>
                                  )}
                                  
                                  <GradientButton variant="ghost" size="sm">
                                    {isExpanded ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </GradientButton>
                                </div>
                              </div>

                              {/* Expanded Details */}
                              <AnimatePresence>
                                {isExpanded && showDetails && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                                  >
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <strong>Date:</strong> {event.date.toLocaleDateString()}
                                      </div>
                                      <div>
                                        <strong>Type:</strong> {event.type.replace("_", " ")}
                                      </div>
                                      <div>
                                        <strong>Priority:</strong> {event.priority}
                                      </div>
                                      {event.points && (
                                        <div>
                                          <strong>Points:</strong> {event.points}
                                        </div>
                                      )}
                                    </div>
                                    
                                    {event.relatedSkills && (
                                      <div className="mt-3">
                                        <strong className="text-sm">Related Skills:</strong>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {event.relatedSkills.map((skillId) => (
                                            <Badge key={skillId} variant="outline" className="text-xs">
                                              Skill {skillId}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </NeonBorder>
                          </motion.div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          </GlassmorphismCard>
        </div>
      </div>
    </div>
  )
}