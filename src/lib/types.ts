// Core application types for SkillBridge AI

// User and Authentication Types
export interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: UserRole
  onboardingCompleted: boolean
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN"
}

// Learning and Skills Types
export interface Skill {
  id: string
  name: string
  category: string
  level: SkillLevel
  marketDemand: number // 0-100
  averageSalary?: number
  trendingScore: number // 0-100
  description?: string
  createdAt: Date
  updatedAt: Date
}

export enum SkillLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT"
}

export interface LearningPath {
  id: string
  title: string
  description: string
  userId: string
  targetRole?: string
  duration: number // in weeks
  difficulty: Difficulty
  skills: LearningPathSkill[]
  resources: Resource[]
  progress: number // 0-100
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface LearningPathSkill {
  skillId: string
  skill: Skill
  order: number
  targetLevel: SkillLevel
  currentLevel?: SkillLevel
}

export enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD"
}

export interface Resource {
  id: string
  title: string
  type: ResourceType
  url: string
  provider?: string
  duration?: number // in minutes
  difficulty?: Difficulty
  rating?: number
  price?: number
  isFree: boolean
}

export enum ResourceType {
  VIDEO = "VIDEO",
  ARTICLE = "ARTICLE",
  COURSE = "COURSE",
  BOOK = "BOOK",
  TUTORIAL = "TUTORIAL",
  PRACTICE = "PRACTICE"
}

// AI and Chat Types
export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  metadata?: {
    voiceId?: string
    audioUrl?: string
    isVoiceMessage?: boolean
    suggestions?: string[]
  }
}

export interface ChatSession {
  id: string
  userId: string
  messages: ChatMessage[]
  context?: SessionContext
  createdAt: Date
  updatedAt: Date
}

export interface SessionContext {
  currentSkills?: Skill[]
  learningGoals?: string[]
  preferredLearningStyle?: LearningStyle
  timeCommitment?: number // hours per week
  careerObjective?: string
}

export enum LearningStyle {
  VISUAL = "VISUAL",
  AUDITORY = "AUDITORY",
  READING = "READING",
  KINESTHETIC = "KINESTHETIC"
}

// Market Data Types
export interface JobMarketData {
  skillId: string
  skill: Skill
  jobCount: number
  averageSalary: number
  salaryRange: {
    min: number
    max: number
  }
  growthRate: number // percentage
  companies: string[]
  locations: string[]
  lastUpdated: Date
}

export interface SkillTrend {
  skillId: string
  date: Date
  demandScore: number
  jobPostings: number
  averageSalary: number
}

export interface IndustryInsight {
  industry: string
  topSkills: Skill[]
  emergingSkills: Skill[]
  averageSalary: number
  jobGrowth: number
  description: string
}

// Progress and Analytics Types
export interface UserProgress {
  userId: string
  skillId: string
  currentLevel: SkillLevel
  targetLevel: SkillLevel
  progressPercentage: number
  hoursSpent: number
  lastActivity: Date
  milestones: Milestone[]
}

export interface Milestone {
  id: string
  title: string
  description: string
  achievedAt?: Date
  points: number
  badge?: string
}

export interface LearningAnalytics {
  userId: string
  totalHoursLearned: number
  skillsAcquired: number
  currentStreak: number
  longestStreak: number
  completionRate: number
  averageSessionDuration: number
  preferredLearningTime?: string
  topSkillCategories: string[]
}

// Recommendation Types
export interface SkillRecommendation {
  skill: Skill
  reason: string
  matchScore: number // 0-100
  requiredTime: number // hours to learn
  potentialSalaryIncrease?: number
  relatedSkills: Skill[]
  suggestedResources: Resource[]
}

export interface PathRecommendation {
  title: string
  description: string
  targetRole: string
  skills: Skill[]
  estimatedDuration: number // weeks
  difficulty: Difficulty
  careerOutlook: {
    averageSalary: number
    jobGrowth: number
    demandLevel: "HIGH" | "MEDIUM" | "LOW"
  }
}

// Voice Types
export interface VoiceSettings {
  voiceId: string
  speed: number // 0.5-2.0
  pitch: number // 0.5-2.0
  volume: number // 0-1
  language: string
  autoPlay: boolean
  enableBackgroundMusic: boolean
}

export interface VoiceSession {
  id: string
  userId: string
  duration: number // seconds
  messages: ChatMessage[]
  skillsDiscussed: Skill[]
  actionItems: string[]
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE"
  createdAt: Date
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Form Types
export interface SkillAssessmentForm {
  currentRole: string
  targetRole: string
  yearsOfExperience: number
  currentSkills: { skillId: string; level: SkillLevel }[]
  learningGoals: string[]
  timeCommitment: number
  preferredLearningStyle: LearningStyle
  budget?: number
}

export interface ProfileUpdateForm {
  name?: string
  email?: string
  bio?: string
  location?: string
  linkedinUrl?: string
  githubUrl?: string
  portfolioUrl?: string
  skills?: { skillId: string; level: SkillLevel }[]
  careerGoals?: string[]
}
