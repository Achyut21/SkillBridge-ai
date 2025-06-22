import { 
  SkillRecommendation, 
  PathRecommendation, 
  Skill, 
  User,
  LearningPath,
  JobMarketData,
  UserProgress,
  LearningAnalytics,
  SkillLevel,
  LearningStyle
} from "@/lib/types"
import { getOpenAIService } from "./openai"
import { getMarketAnalyzer } from "../data/market-analyzer"

interface RecommendationContext {
  user: User
  currentSkills: Skill[]
  targetRole?: string
  learningHistory?: UserProgress[]
  analytics?: LearningAnalytics
  marketData?: JobMarketData[]
}

interface RecommendationOptions {
  count?: number
  includeMarketData?: boolean
  considerBudget?: boolean
  timeframe?: number // weeks
}

class RecommendationEngine {
  private openAI = getOpenAIService()
  private marketAnalyzer = getMarketAnalyzer()

  // Generate comprehensive skill recommendations
  async generateSkillRecommendations(
    context: RecommendationContext,
    options: RecommendationOptions = {}
  ): Promise<SkillRecommendation[]> {
    const {
      count = 5,
      includeMarketData = true,
      considerBudget = false,
      timeframe = 12
    } = options

    // Gather market intelligence if requested
    let marketInsights = null
    if (includeMarketData) {
      marketInsights = await this.marketAnalyzer.getSkillDemandAnalysis(
        context.targetRole || "Software Developer"
      )
    }

    // Analyze user's learning patterns
    const learningPatterns = this.analyzeLearningPatterns(context.learningHistory)
    
    // Get AI recommendations
    const aiRecommendations = await this.openAI.generateSkillRecommendations({
      userSkills: context.currentSkills.map(skill => ({
        skillId: skill.id,
        level: skill.level as SkillLevel
      })),
      targetRole: context.targetRole || "Software Developer",
      marketData: marketInsights,
      timeCommitment: context.analytics?.averageSessionDuration
    })

    // Enhance recommendations with local data
    const enhancedRecommendations = await this.enhanceRecommendations(
      aiRecommendations,
      context,
      marketInsights
    )

    // Sort by match score and return top N
    return enhancedRecommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, count)
  }

  // Generate personalized learning paths
  async generateLearningPaths(
    context: RecommendationContext,
    count: number = 3
  ): Promise<PathRecommendation[]> {
    const paths: PathRecommendation[] = []

    // Generate primary path based on target role
    if (context.targetRole) {
      const primaryPath = await this.openAI.generateLearningPath({
        currentRole: this.inferCurrentRole(context.currentSkills),
        targetRole: context.targetRole,
        currentSkills: context.currentSkills,
        timeframe: 24, // 6 months default
        learningStyle: LearningStyle.VISUAL, // TODO: Get from user preferences
        budget: 1000 // TODO: Get from user preferences
      })
      paths.push(primaryPath)
    }

    // Generate alternative paths based on market trends
    const trendingRoles = await this.marketAnalyzer.getTrendingRoles()
    for (const role of trendingRoles.slice(0, count - 1)) {
      const path = await this.generatePathForRole(context, role)
      paths.push(path)
    }

    return paths
  }

  // Get next best action for user
  async getNextBestAction(
    context: RecommendationContext
  ): Promise<{
    action: string
    reason: string
    expectedOutcome: string
    timeRequired: number
  }> {
    // Analyze current progress and momentum
    const momentum = this.calculateLearningMomentum(context.learningHistory)
    const skillGaps = await this.identifySkillGaps(context)
    
    // Determine best next action based on multiple factors
    if (momentum < 0.3) {
      // User needs motivation
      return {
        action: "Complete a quick 15-minute tutorial on your current skill",
        reason: "You haven't been active recently. Small wins build momentum!",
        expectedOutcome: "Regain learning momentum and confidence",
        timeRequired: 15
      }
    } else if (skillGaps.critical.length > 0) {
      // Address critical skill gaps
      const criticalSkill = skillGaps.critical[0]
      return {
        action: `Start learning ${criticalSkill.name} - it's crucial for your target role`,
        reason: `${criticalSkill.name} is a must-have skill with ${criticalSkill.marketDemand}% market demand`,
        expectedOutcome: `Close a critical skill gap and increase job opportunities by ${criticalSkill.marketDemand}%`,
        timeRequired: 60
      }
    } else {
      // Continue current path
      return {
        action: "Continue with your current learning path module",
        reason: "You're making great progress! Stay consistent.",
        expectedOutcome: "Complete another milestone towards your goal",
        timeRequired: 45
      }
    }
  }

  // Analyze skill gaps between current and target
  async identifySkillGaps(
    context: RecommendationContext
  ): Promise<{
    critical: Skill[]
    important: Skill[]
    nice_to_have: Skill[]
  }> {
    if (!context.targetRole) {
      return { critical: [], important: [], nice_to_have: [] }
    }

    const requiredSkills = await this.marketAnalyzer.getRequiredSkillsForRole(
      context.targetRole
    )
    
    const currentSkillIds = new Set(context.currentSkills.map(s => s.id))
    
    const gaps = requiredSkills.filter(skill => !currentSkillIds.has(skill.id))
    
    // Categorize gaps by importance
    return {
      critical: gaps.filter(s => s.marketDemand > 80),
      important: gaps.filter(s => s.marketDemand >= 50 && s.marketDemand <= 80),
      nice_to_have: gaps.filter(s => s.marketDemand < 50)
    }
  }

  // Private helper methods
  private analyzeLearningPatterns(history?: UserProgress[]): any {
    if (!history || history.length === 0) {
      return {
        preferredDifficulty: "MEDIUM",
        averagePace: 1, // normal pace
        completionRate: 0,
        strongCategories: []
      }
    }

    // Analyze patterns from history
    const completedMilestones = history.flatMap(h => 
      h.milestones.filter(m => m.achievedAt)
    )
    
    return {
      preferredDifficulty: "MEDIUM", // TODO: Calculate from history
      averagePace: 1,
      completionRate: completedMilestones.length / history.length,
      strongCategories: this.identifyStrongCategories(history)
    }
  }

  private async enhanceRecommendations(
    recommendations: SkillRecommendation[],
    context: RecommendationContext,
    marketData: any
  ): Promise<SkillRecommendation[]> {
    // Add local context and market data to recommendations
    return recommendations.map(rec => ({
      ...rec,
      // Ensure all required fields are present
      skill: rec.skill || this.createDefaultSkill(rec),
      matchScore: this.calculateMatchScore(rec, context, marketData),
      potentialSalaryIncrease: marketData?.averageSalaryIncrease || rec.potentialSalaryIncrease
    }))
  }

  private calculateMatchScore(
    recommendation: SkillRecommendation,
    context: RecommendationContext,
    marketData: any
  ): number {
    let score = recommendation.matchScore || 50

    // Boost score based on market demand
    if (marketData?.demand > 70) score += 10
    
    // Boost if builds on existing skills
    const buildsOnExisting = context.currentSkills.some(skill => 
      recommendation.relatedSkills?.some(related => related.id === skill.id)
    )
    if (buildsOnExisting) score += 15

    // Cap at 100
    return Math.min(score, 100)
  }

  private calculateLearningMomentum(history?: UserProgress[]): number {
    if (!history || history.length === 0) return 0

    // Calculate based on recent activity
    const recentActivity = history.filter(h => {
      const daysSinceActivity = (Date.now() - h.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceActivity < 7
    })

    return recentActivity.length / Math.max(history.length, 1)
  }

  private inferCurrentRole(skills: Skill[]): string {
    // Simple inference based on skill categories
    const categories = skills.map(s => s.category)
    const mostCommon = this.getMostCommonElement(categories)
    
    const roleMap: Record<string, string> = {
      "Programming": "Software Developer",
      "Design": "Designer",
      "Marketing": "Marketing Professional",
      "Data": "Data Analyst",
      "Management": "Manager"
    }

    return roleMap[mostCommon] || "Professional"
  }

  private getMostCommonElement(arr: string[]): string {
    const counts = arr.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.keys(counts).reduce((a, b) => 
      counts[a] > counts[b] ? a : b
    )
  }

  private identifyStrongCategories(history: UserProgress[]): string[] {
    // TODO: Implement analysis of strong categories from progress history
    return []
  }

  private createDefaultSkill(recommendation: any): Skill {
    return {
      id: `skill-${Date.now()}`,
      name: recommendation.skillName || "Unknown Skill",
      category: "General",
      level: "BEGINNER" as SkillLevel,
      marketDemand: 50,
      trendingScore: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  private async generatePathForRole(
    context: RecommendationContext,
    role: string
  ): Promise<PathRecommendation> {
    return this.openAI.generateLearningPath({
      currentRole: this.inferCurrentRole(context.currentSkills),
      targetRole: role,
      currentSkills: context.currentSkills,
      timeframe: 24,
      learningStyle: LearningStyle.VISUAL,
      budget: 1000
    })
  }
}

// Singleton instance
let recommendationEngine: RecommendationEngine | null = null

export function getRecommendationEngine(): RecommendationEngine {
  if (!recommendationEngine) {
    recommendationEngine = new RecommendationEngine()
  }
  return recommendationEngine
}

export default RecommendationEngine
