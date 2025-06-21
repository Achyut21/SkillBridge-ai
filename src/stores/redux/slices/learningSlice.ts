import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LearningPath, UserProgress, Milestone, Resource } from "@/lib/types"

interface LearningState {
  activePaths: LearningPath[]
  completedPaths: LearningPath[]
  currentPath: LearningPath | null
  userProgress: Record<string, UserProgress>
  milestones: Milestone[]
  savedResources: Resource[]
  learningStreak: {
    current: number
    longest: number
    lastActivity: string | null
  }
  preferences: {
    dailyGoal: number // minutes
    reminderTime: string | null
    preferredLearningTime: "morning" | "afternoon" | "evening" | "night"
    notifications: {
      dailyReminder: boolean
      weeklyProgress: boolean
      milestoneAchieved: boolean
    }
  }
  stats: {
    totalHoursLearned: number
    skillsCompleted: number
    pathsCompleted: number
    averageCompletionTime: number // days
  }
}

const initialState: LearningState = {
  activePaths: [],
  completedPaths: [],
  currentPath: null,
  userProgress: {},
  milestones: [],
  savedResources: [],
  learningStreak: {
    current: 0,
    longest: 0,
    lastActivity: null,
  },
  preferences: {
    dailyGoal: 30,
    reminderTime: null,
    preferredLearningTime: "evening",
    notifications: {
      dailyReminder: true,
      weeklyProgress: true,
      milestoneAchieved: true,
    },
  },
  stats: {
    totalHoursLearned: 0,
    skillsCompleted: 0,
    pathsCompleted: 0,
    averageCompletionTime: 0,
  },
}

const learningSlice = createSlice({
  name: "learning",
  initialState,
  reducers: {
    // Path management
    addActivePath: (state, action: PayloadAction<LearningPath>) => {
      state.activePaths.push(action.payload)
    },
    
    setCurrentPath: (state, action: PayloadAction<LearningPath | null>) => {
      state.currentPath = action.payload
    },
    
    updatePathProgress: (state, action: PayloadAction<{ pathId: string; progress: number }>) => {
      const { pathId, progress } = action.payload
      const path = state.activePaths.find(p => p.id === pathId)
      if (path) {
        path.progress = progress
        if (progress >= 100 && !state.completedPaths.find(p => p.id === pathId)) {
          state.completedPaths.push(path)
          state.activePaths = state.activePaths.filter(p => p.id !== pathId)
          state.stats.pathsCompleted += 1
        }
      }
    },
    
    removePath: (state, action: PayloadAction<string>) => {
      state.activePaths = state.activePaths.filter(p => p.id !== action.payload)
      if (state.currentPath?.id === action.payload) {
        state.currentPath = null
      }
    },
    
    // Progress tracking
    updateUserProgress: (state, action: PayloadAction<{ skillId: string; progress: UserProgress }>) => {
      const { skillId, progress } = action.payload
      state.userProgress[skillId] = progress
    },
    
    addMilestone: (state, action: PayloadAction<Milestone>) => {
      state.milestones.push(action.payload)
    },
    
    completeMilestone: (state, action: PayloadAction<string>) => {
      const milestone = state.milestones.find(m => m.id === action.payload)
      if (milestone) {
        milestone.achievedAt = new Date()
      }
    },
    
    // Resources
    saveResource: (state, action: PayloadAction<Resource>) => {
      if (!state.savedResources.find(r => r.id === action.payload.id)) {
        state.savedResources.push(action.payload)
      }
    },
    
    removeResource: (state, action: PayloadAction<string>) => {
      state.savedResources = state.savedResources.filter(r => r.id !== action.payload)
    },
    
    // Streak management
    updateStreak: (state, action: PayloadAction<{ increment: boolean }>) => {
      const now = new Date().toISOString()
      const lastActivity = state.learningStreak.lastActivity
      
      if (action.payload.increment) {
        // Check if it's a new day
        const isNewDay = !lastActivity || 
          new Date(lastActivity).toDateString() !== new Date(now).toDateString()
        
        if (isNewDay) {
          state.learningStreak.current += 1
          state.learningStreak.longest = Math.max(
            state.learningStreak.current, 
            state.learningStreak.longest
          )
        }
        state.learningStreak.lastActivity = now
      } else {
        // Reset streak
        state.learningStreak.current = 0
      }
    },
    
    // Preferences
    updatePreferences: (state, action: PayloadAction<Partial<LearningState["preferences"]>>) => {
      state.preferences = { ...state.preferences, ...action.payload }
    },
    
    updateNotificationSettings: (
      state, 
      action: PayloadAction<Partial<LearningState["preferences"]["notifications"]>>
    ) => {
      state.preferences.notifications = { 
        ...state.preferences.notifications, 
        ...action.payload 
      }
    },
    
    // Stats
    updateStats: (state, action: PayloadAction<Partial<LearningState["stats"]>>) => {
      state.stats = { ...state.stats, ...action.payload }
    },
    
    incrementLearningTime: (state, action: PayloadAction<number>) => {
      state.stats.totalHoursLearned += action.payload / 60 // Convert minutes to hours
    },
    
    // Bulk updates
    setActivePaths: (state, action: PayloadAction<LearningPath[]>) => {
      state.activePaths = action.payload
    },
    
    setCompletedPaths: (state, action: PayloadAction<LearningPath[]>) => {
      state.completedPaths = action.payload
    },
    
    // Reset
    resetLearningState: (state) => {
      Object.assign(state, initialState)
    },
  },
})

export const {
  addActivePath,
  setCurrentPath,
  updatePathProgress,
  removePath,
  updateUserProgress,
  addMilestone,
  completeMilestone,
  saveResource,
  removeResource,
  updateStreak,
  updatePreferences,
  updateNotificationSettings,
  updateStats,
  incrementLearningTime,
  setActivePaths,
  setCompletedPaths,
  resetLearningState,
} = learningSlice.actions

export default learningSlice.reducer
