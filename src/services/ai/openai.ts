import { 
  ChatMessage, 
  SkillRecommendation, 
  PathRecommendation, 
  Skill, 
  SessionContext,
  LearningStyle,
  SkillLevel
} from "@/lib/types"

// Utility function to generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

interface ChatCompletionOptions {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  model?: string
  systemPrompt?: string
}

interface SkillAnalysisOptions {
  userSkills: { skillId: string; level: SkillLevel }[]
  targetRole: string
  marketData?: any
  timeCommitment?: number
}

interface PathGenerationOptions {
  currentRole: string
  targetRole: string
  currentSkills: Skill[]
  timeframe: number // weeks
  learningStyle: LearningStyle
  budget?: number
}

class OpenAIService {
  private apiKey: string
  private baseUrl = "https://api.openai.com/v1"
  private defaultModel = "gpt-4o"
  
  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // Core chat completion method
  async createChatCompletion({
    messages,
    temperature = 0.7,
    maxTokens = 1000,
    model = this.defaultModel,
    systemPrompt
  }: ChatCompletionOptions): Promise<string> {
    const formattedMessages = [
      ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ]

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        temperature,
        max_tokens: maxTokens,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  }

  // Generate skill recommendations based on user profile and market data
  async generateSkillRecommendations(options: SkillAnalysisOptions): Promise<SkillRecommendation[]> {
    const systemPrompt = `You are an expert career advisor and skills analyst for SkillBridge AI. 
    Analyze the user's current skills and target role to recommend the most valuable skills to learn.
    Consider market demand, salary potential, and skill synergies.
    Return recommendations in JSON format.`

    const userPrompt = `
    Current Skills: ${JSON.stringify(options.userSkills)}
    Target Role: ${options.targetRole}
    Time Commitment: ${options.timeCommitment || 10} hours/week
    Market Data: ${JSON.stringify(options.marketData || {})}
    
    Provide 5 skill recommendations with:
    - skill name and details
    - reason for recommendation
    - match score (0-100)
    - estimated learning time
    - potential salary increase
    - related skills
    
    Format as JSON array of recommendations.
    `

    const response = await this.createChatCompletion({
      messages: [{ id: generateId(), role: "user", content: userPrompt, timestamp: new Date() }],
      systemPrompt,
      temperature: 0.6,
      maxTokens: 1500,
    })

    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      throw new Error("Failed to parse recommendations")
    } catch {
      // Fallback to text parsing if JSON fails
      return this.parseRecommendationsFromText(response)
    }
  }

  // Generate personalized learning path
  async generateLearningPath(options: PathGenerationOptions): Promise<PathRecommendation> {
    const systemPrompt = `You are an expert learning path designer for SkillBridge AI.
    Create personalized, achievable learning paths that consider the user's current skills,
    target role, available time, and preferred learning style.`

    const userPrompt = `
    Current Role: ${options.currentRole}
    Target Role: ${options.targetRole}
    Current Skills: ${options.currentSkills.map(s => `${s.name} (${s.level})`).join(", ")}
    Timeframe: ${options.timeframe} weeks
    Learning Style: ${options.learningStyle}
    Budget: ${options.budget ? `$${options.budget}` : "Flexible"}
    
    Create a detailed learning path with:
    - Path title and description
    - Required skills to learn (in order)
    - Estimated duration
    - Difficulty level
    - Career outlook (salary, job growth, demand)
    
    Format as JSON.
    `

    const response = await this.createChatCompletion({
      messages: [{ id: generateId(), role: "user", content: userPrompt, timestamp: new Date() }],
      systemPrompt,
      temperature: 0.7,
      maxTokens: 2000,
    })

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      throw new Error("Failed to parse learning path")
    } catch {
      // Create a default structure if parsing fails
      return this.createDefaultLearningPath(options)
    }
  }

  // AI Coach conversation
  async generateCoachResponse(
    messages: ChatMessage[],
    context?: SessionContext
  ): Promise<string> {
    const systemPrompt = `You are Alex, an encouraging and knowledgeable AI career coach for SkillBridge AI.
    Your personality is warm, supportive, and motivating. You help users:
    - Identify skill gaps and create learning plans
    - Stay motivated and overcome learning challenges
    - Make informed career decisions based on market data
    - Track progress and celebrate achievements
    
    Context: ${context ? JSON.stringify(context) : "General coaching session"}
    
    Keep responses concise (2-3 paragraphs), actionable, and encouraging.
    Use the user's name when known, and reference their goals and progress.`

    return this.createChatCompletion({
      messages,
      systemPrompt,
      temperature: 0.8,
      maxTokens: 500,
    })
  }

  // Generate a daily learning brief
  async generateDailyBrief(
    userName: string,
    currentSkills: Skill[],
    learningStreak: number,
    todaysFocus?: string
  ): Promise<string> {
    const prompt = `Generate an encouraging daily brief for ${userName}.
    Current learning streak: ${learningStreak} days
    Current skills focus: ${currentSkills.map(s => s.name).join(", ")}
    Today's focus: ${todaysFocus || "General learning"}
    
    Include:
    - Warm greeting acknowledging their streak
    - Today's learning suggestion (specific and actionable)
    - Motivational message
    - One interesting fact about their focus area
    
    Keep it concise and energizing!`

    return this.createChatCompletion({
      messages: [{ id: generateId(), role: "user", content: prompt, timestamp: new Date() }],
      temperature: 0.9,
      maxTokens: 300,
    })
  }

  // Analyze resume/profile for skill extraction
  async analyzeProfileForSkills(profileText: string): Promise<Skill[]> {
    const systemPrompt = `You are an expert at analyzing professional profiles and extracting skills.
    Identify technical skills, soft skills, and domain expertise.
    Categorize each skill and estimate the proficiency level based on context.`

    const response = await this.createChatCompletion({
      messages: [{
        id: generateId(),
        role: "user",
        content: `Analyze this profile and extract skills with categories and estimated levels:\n\n${profileText}`,
        timestamp: new Date()
      }],
      systemPrompt,
      temperature: 0.5,
      maxTokens: 1000,
    })

    return this.parseSkillsFromText(response)
  }

  // Helper methods
  private parseRecommendationsFromText(text: string): SkillRecommendation[] {
    // Fallback parser for non-JSON responses
    const recommendations: SkillRecommendation[] = []
    // Implementation would parse text and create recommendation objects
    // For now, return empty array
    return recommendations
  }

  private createDefaultLearningPath(options: PathGenerationOptions): PathRecommendation {
    return {
      title: `Path to ${options.targetRole}`,
      description: `Customized learning path from ${options.currentRole} to ${options.targetRole}`,
      targetRole: options.targetRole,
      skills: options.currentSkills,
      estimatedDuration: options.timeframe,
      difficulty: "MEDIUM",
      careerOutlook: {
        averageSalary: 0,
        jobGrowth: 0,
        demandLevel: "MEDIUM"
      }
    }
  }

  private parseSkillsFromText(text: string): Skill[] {
    // Implementation would parse skills from text
    return []
  }
}

// Singleton instance
let openAIInstance: OpenAIService | null = null

export function getOpenAIService(): OpenAIService {
  if (!openAIInstance) {
    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("OpenAI API key not configured")
    }
    openAIInstance = new OpenAIService(apiKey)
  }
  return openAIInstance
}

export default OpenAIService
