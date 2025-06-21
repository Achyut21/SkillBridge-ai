import { 
  Skill, 
  JobMarketData, 
  SkillTrend, 
  IndustryInsight,
  SkillLevel 
} from "@/lib/types"

interface MarketAnalysis {
  topSkills: Skill[]
  emergingSkills: Skill[]
  decliningSkills: Skill[]
  averageSalary: number
  jobGrowthRate: number
}

interface RoleRequirements {
  role: string
  requiredSkills: Skill[]
  preferredSkills: Skill[]
  averageSalary: number
  jobCount: number
  growthRate: number
}

class MarketAnalyzer {
  private apiEndpoint: string
  private cacheTimeout = 3600000 // 1 hour
  private cache = new Map<string, { data: any; timestamp: number }>()

  constructor(apiEndpoint?: string) {
    this.apiEndpoint = apiEndpoint || process.env.MARKET_DATA_API || "/api/market-data"
  }

  // Get skill demand analysis for a specific role
  async getSkillDemandAnalysis(role: string): Promise<MarketAnalysis> {
    const cacheKey = `skill-demand-${role}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      // In production, this would call real market data API
      // For now, return mock data
      const analysis: MarketAnalysis = {
        topSkills: await this.getMockTopSkills(role),
        emergingSkills: await this.getMockEmergingSkills(role),
        decliningSkills: [],
        averageSalary: this.getMockSalaryForRole(role),
        jobGrowthRate: 15.5
      }

      this.setCache(cacheKey, analysis)
      return analysis
    } catch (error) {
      console.error("Failed to fetch skill demand analysis:", error)
      return this.getDefaultAnalysis()
    }
  }

  // Get trending roles in the market
  async getTrendingRoles(): Promise<string[]> {
    const cacheKey = "trending-roles"
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    // Mock data - in production, fetch from API
    const roles = [
      "AI/ML Engineer",
      "Cloud Architect",
      "DevOps Engineer",
      "Full Stack Developer",
      "Data Scientist",
      "Product Manager",
      "UX Designer",
      "Cybersecurity Analyst"
    ]

    this.setCache(cacheKey, roles)
    return roles
  }

  // Get required skills for a specific role
  async getRequiredSkillsForRole(role: string): Promise<Skill[]> {
    const cacheKey = `required-skills-${role}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    // Role-based skill mapping
    const roleSkillMap: Record<string, string[]> = {
      "Software Developer": ["JavaScript", "React", "Node.js", "Git", "TypeScript", "REST APIs"],
      "AI/ML Engineer": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "Data Science"],
      "Cloud Architect": ["AWS", "Azure", "Kubernetes", "Docker", "Terraform", "CI/CD"],
      "Data Scientist": ["Python", "R", "SQL", "Statistics", "Machine Learning", "Data Visualization"],
      "Product Manager": ["Product Strategy", "Agile", "User Research", "Analytics", "Roadmapping", "Stakeholder Management"],
      "UX Designer": ["Figma", "User Research", "Prototyping", "Design Systems", "Wireframing", "Usability Testing"],
      "DevOps Engineer": ["Docker", "Kubernetes", "Jenkins", "AWS", "CI/CD", "Linux", "Monitoring"],
      "Cybersecurity Analyst": ["Network Security", "Penetration Testing", "SIEM", "Incident Response", "Cryptography", "Compliance"]
    }

    const skillNames = roleSkillMap[role] || roleSkillMap["Software Developer"]
    const skills = skillNames.map((name, index) => this.createSkill(name, index))

    this.setCache(cacheKey, skills)
    return skills
  }

  // Get job market data for specific skills
  async getJobMarketData(skillIds: string[]): Promise<JobMarketData[]> {
    const marketData: JobMarketData[] = []

    for (const skillId of skillIds) {
      const skill = await this.getSkillById(skillId)
      if (!skill) continue

      marketData.push({
        skillId,
        skill,
        jobCount: Math.floor(Math.random() * 10000) + 1000,
        averageSalary: this.getMockSalaryForSkill(skill.name),
        salaryRange: {
          min: 60000,
          max: 180000
        },
        growthRate: Math.random() * 30 + 5,
        companies: this.getMockCompaniesForSkill(skill.name),
        locations: ["San Francisco", "New York", "Seattle", "Austin", "Remote"],
        lastUpdated: new Date()
      })
    }

    return marketData
  }

  // Get skill trends over time
  async getSkillTrends(skillId: string, days: number = 90): Promise<SkillTrend[]> {
    const trends: SkillTrend[] = []
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000

    for (let i = 0; i < days; i += 7) { // Weekly data points
      trends.push({
        skillId,
        date: new Date(now - (i * dayMs)),
        demandScore: Math.random() * 30 + 70,
        jobPostings: Math.floor(Math.random() * 500) + 200,
        averageSalary: 90000 + Math.floor(Math.random() * 20000)
      })
    }

    return trends.reverse()
  }

  // Get industry insights
  async getIndustryInsights(industry: string): Promise<IndustryInsight> {
    const cacheKey = `industry-${industry}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    const insight: IndustryInsight = {
      industry,
      topSkills: await this.getMockTopSkills(industry),
      emergingSkills: await this.getMockEmergingSkills(industry),
      averageSalary: 95000,
      jobGrowth: 12.5,
      description: `The ${industry} industry is experiencing significant growth with high demand for skilled professionals.`
    }

    this.setCache(cacheKey, insight)
    return insight
  }

  // Helper methods
  private getMockTopSkills(role: string): Skill[] {
    const baseSkills = [
      "JavaScript", "Python", "React", "Node.js", "AWS",
      "Docker", "Kubernetes", "TypeScript", "PostgreSQL", "Git"
    ]

    return baseSkills.slice(0, 5).map((name, index) => 
      this.createSkill(name, index, 80 + Math.random() * 20)
    )
  }

  private getMockEmergingSkills(role: string): Skill[] {
    const emergingSkills = [
      "AI/ML", "Rust", "Web3", "GraphQL", "Serverless",
      "Edge Computing", "Quantum Computing", "AR/VR"
    ]

    return emergingSkills.slice(0, 3).map((name, index) => 
      this.createSkill(name, index + 10, 60 + Math.random() * 20)
    )
  }

  private createSkill(name: string, index: number, demand?: number): Skill {
    return {
      id: `skill-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name,
      category: this.categorizeSkill(name),
      level: "INTERMEDIATE" as SkillLevel,
      marketDemand: demand || Math.floor(Math.random() * 40) + 60,
      averageSalary: this.getMockSalaryForSkill(name),
      trendingScore: Math.floor(Math.random() * 30) + 70,
      description: `${name} is a valuable skill in today's job market.`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  private categorizeSkill(skillName: string): string {
    const categories: Record<string, string[]> = {
      "Programming": ["JavaScript", "Python", "Java", "TypeScript", "Go", "Rust", "C++"],
      "Frontend": ["React", "Vue", "Angular", "HTML", "CSS", "Svelte"],
      "Backend": ["Node.js", "Django", "FastAPI", "Spring", "Express"],
      "Cloud": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform"],
      "Data": ["SQL", "MongoDB", "PostgreSQL", "Redis", "Elasticsearch"],
      "AI/ML": ["TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "NLP"],
      "DevOps": ["CI/CD", "Jenkins", "GitLab", "Monitoring", "Linux"],
      "Design": ["Figma", "Sketch", "Adobe XD", "UI/UX", "Prototyping"]
    }

    for (const [category, skills] of Object.entries(categories)) {
      if (skills.some(skill => skillName.toLowerCase().includes(skill.toLowerCase()))) {
        return category
      }
    }

    return "General"
  }

  private getMockSalaryForRole(role: string): number {
    const salaries: Record<string, number> = {
      "Software Developer": 95000,
      "AI/ML Engineer": 130000,
      "Cloud Architect": 125000,
      "Data Scientist": 115000,
      "Product Manager": 120000,
      "UX Designer": 90000,
      "DevOps Engineer": 110000,
      "Cybersecurity Analyst": 105000
    }

    return salaries[role] || 85000
  }

  private getMockSalaryForSkill(skill: string): number {
    const highValueSkills = ["AI/ML", "Kubernetes", "AWS", "React", "Python"]
    const baseValue = 80000
    const bonus = highValueSkills.includes(skill) ? 20000 : 0
    return baseValue + bonus + Math.floor(Math.random() * 15000)
  }

  private getMockCompaniesForSkill(skill: string): string[] {
    const techCompanies = [
      "Google", "Meta", "Amazon", "Microsoft", "Apple",
      "Netflix", "Uber", "Airbnb", "Stripe", "Spotify"
    ]

    // Return random subset
    return techCompanies
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
  }

  private async getSkillById(skillId: string): Promise<Skill | null> {
    // In production, fetch from database
    // For now, create mock skill
    const name = skillId.replace("skill-", "").replace(/-/g, " ")
    return this.createSkill(name, 0)
  }

  private getFromCache(key: string): any {
    const cached = this.cache.get(key)
    if (!cached) return null

    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  private getDefaultAnalysis(): MarketAnalysis {
    return {
      topSkills: [],
      emergingSkills: [],
      decliningSkills: [],
      averageSalary: 85000,
      jobGrowthRate: 10
    }
  }
}

// Singleton instance
let marketAnalyzer: MarketAnalyzer | null = null

export function getMarketAnalyzer(): MarketAnalyzer {
  if (!marketAnalyzer) {
    marketAnalyzer = new MarketAnalyzer()
  }
  return marketAnalyzer
}

export default MarketAnalyzer
