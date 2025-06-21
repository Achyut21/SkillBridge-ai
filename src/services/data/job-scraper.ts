import { JobMarketData, Skill } from "@/lib/types"
import { getMCPConnector } from "./mcp-connector"

interface JobListing {
  id: string
  title: string
  company: string
  location: string
  salary?: {
    min: number
    max: number
    currency: string
  }
  description: string
  requirements: string[]
  benefits?: string[]
  postedDate: Date
  source: string
  url: string
  remote?: boolean
  experienceLevel?: string
  employmentType?: string
}

interface ScrapingOptions {
  keywords?: string[]
  location?: string
  remote?: boolean
  experienceLevel?: string[]
  minSalary?: number
  maxResults?: number
}

class JobScraper {
  private mcpConnector = getMCPConnector()
  private scraperEndpoint: string
  private rateLimitDelay = 1000 // 1 second between requests

  constructor(endpoint?: string) {
    this.scraperEndpoint = endpoint || process.env.JOB_SCRAPER_API || "/api/job-scraper"
  }

  // Scrape jobs from multiple sources
  async scrapeJobs(options: ScrapingOptions = {}): Promise<JobListing[]> {
    const sources = ["indeed", "linkedin", "glassdoor", "remote.co", "angellist"]
    const allJobs: JobListing[] = []

    // Get real-time data from MCP
    const mcpJobs = await this.mcpConnector.getJobListings({
      skills: options.keywords,
      location: options.location,
      minSalary: options.minSalary
    })

    // Convert MCP jobs to our format
    const convertedMcpJobs = mcpJobs.map(job => this.convertMCPJob(job))
    allJobs.push(...convertedMcpJobs)

    // Scrape from other sources (mock data for now)
    for (const source of sources) {
      const jobs = await this.scrapeFromSource(source, options)
      allJobs.push(...jobs)
      
      // Rate limiting
      await this.delay(this.rateLimitDelay)
    }

    // Remove duplicates and sort by relevance
    const uniqueJobs = this.deduplicateJobs(allJobs)
    return this.rankJobsByRelevance(uniqueJobs, options)
  }

  // Analyze job postings for skill demand
  async analyzeSkillDemand(jobs: JobListing[]): Promise<Map<string, number>> {
    const skillCount = new Map<string, number>()
    
    // Common tech skills to look for
    const skillPatterns = [
      "JavaScript", "TypeScript", "Python", "Java", "C#", "Go", "Rust",
      "React", "Vue", "Angular", "Node.js", "Django", "Flask", "Spring",
      "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform",
      "PostgreSQL", "MongoDB", "MySQL", "Redis", "Elasticsearch",
      "Machine Learning", "AI", "Deep Learning", "TensorFlow", "PyTorch",
      "Git", "CI/CD", "Agile", "Scrum", "DevOps", "Microservices"
    ]

    for (const job of jobs) {
      const jobText = `${job.title} ${job.description} ${job.requirements.join(" ")}`
      
      for (const skill of skillPatterns) {
        const regex = new RegExp(`\\b${skill}\\b`, "gi")
        if (regex.test(jobText)) {
          skillCount.set(skill, (skillCount.get(skill) || 0) + 1)
        }
      }
    }

    return skillCount
  }

  // Get salary insights from job data
  async getSalaryInsights(jobs: JobListing[]): Promise<{
    average: number
    median: number
    range: { min: number; max: number }
    byExperience: Record<string, number>
    byLocation: Record<string, number>
  }> {
    const salaries = jobs
      .filter(job => job.salary)
      .map(job => (job.salary!.min + job.salary!.max) / 2)

    if (salaries.length === 0) {
      return {
        average: 0,
        median: 0,
        range: { min: 0, max: 0 },
        byExperience: {},
        byLocation: {}
      }
    }

    // Calculate statistics
    const average = salaries.reduce((a, b) => a + b, 0) / salaries.length
    const sorted = salaries.sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]
    
    // Group by experience level
    const byExperience: Record<string, number> = {}
    const byLocation: Record<string, number> = {}

    for (const job of jobs) {
      if (!job.salary) continue
      
      const avgSalary = (job.salary.min + job.salary.max) / 2
      
      if (job.experienceLevel) {
        if (!byExperience[job.experienceLevel]) {
          byExperience[job.experienceLevel] = 0
        }
        byExperience[job.experienceLevel] = 
          (byExperience[job.experienceLevel] + avgSalary) / 2
      }

      if (job.location) {
        const city = job.location.split(",")[0]
        if (!byLocation[city]) {
          byLocation[city] = 0
        }
        byLocation[city] = (byLocation[city] + avgSalary) / 2
      }
    }

    return {
      average: Math.round(average),
      median: Math.round(median),
      range: {
        min: Math.min(...salaries),
        max: Math.max(...salaries)
      },
      byExperience,
      byLocation
    }
  }

  // Get trending job titles
  async getTrendingJobTitles(): Promise<{ title: string; count: number }[]> {
    const recentJobs = await this.scrapeJobs({ maxResults: 100 })
    const titleCount = new Map<string, number>()

    // Normalize and count job titles
    for (const job of recentJobs) {
      const normalizedTitle = this.normalizeJobTitle(job.title)
      titleCount.set(normalizedTitle, (titleCount.get(normalizedTitle) || 0) + 1)
    }

    // Convert to array and sort by count
    return Array.from(titleCount.entries())
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  // Helper methods
  private async scrapeFromSource(
    source: string, 
    options: ScrapingOptions
  ): Promise<JobListing[]> {
    // In production, this would make actual API calls or web scraping
    // For now, return mock data based on source
    const mockJobs: JobListing[] = []
    const jobCount = Math.min(options.maxResults || 10, 10)

    for (let i = 0; i < jobCount; i++) {
      mockJobs.push(this.generateMockJob(source, i))
    }

    return mockJobs
  }

  private generateMockJob(source: string, index: number): JobListing {
    const titles = [
      "Senior Software Engineer",
      "Full Stack Developer",
      "Frontend Engineer",
      "Backend Developer",
      "DevOps Engineer",
      "Data Scientist",
      "Product Manager",
      "UX Designer"
    ]

    const companies = [
      "TechCorp", "DataVision", "CloudScale", "InnovateLabs",
      "DigitalForge", "NextGen Solutions", "FutureTech"
    ]

    const locations = [
      "San Francisco, CA", "New York, NY", "Seattle, WA",
      "Austin, TX", "Remote", "Boston, MA", "Denver, CO"
    ]

    const title = titles[index % titles.length]
    const company = companies[index % companies.length]
    const location = locations[index % locations.length]

    return {
      id: `${source}-job-${index}`,
      title,
      company,
      location,
      salary: {
        min: 80000 + (index * 5000),
        max: 120000 + (index * 5000),
        currency: "USD"
      },
      description: `Exciting opportunity for a ${title} at ${company}.`,
      requirements: this.getRequirementsForTitle(title),
      benefits: ["Health insurance", "401k", "Remote work", "PTO"],
      postedDate: new Date(Date.now() - index * 86400000), // Days ago
      source,
      url: `https://${source}.com/job/${index}`,
      remote: location === "Remote",
      experienceLevel: this.getExperienceLevel(title),
      employmentType: "Full-time"
    }
  }

  private getRequirementsForTitle(title: string): string[] {
    const requirementsMap: Record<string, string[]> = {
      "Senior Software Engineer": [
        "5+ years experience", "JavaScript/TypeScript", "React or Vue",
        "Node.js", "AWS or GCP", "System design experience"
      ],
      "Full Stack Developer": [
        "3+ years experience", "Frontend frameworks", "Backend development",
        "Database design", "RESTful APIs", "Git"
      ],
      "Data Scientist": [
        "Python", "Machine Learning", "Statistics", "SQL",
        "Data visualization", "TensorFlow or PyTorch"
      ]
    }

    return requirementsMap[title] || ["3+ years experience", "Relevant skills"]
  }

  private getExperienceLevel(title: string): string {
    if (title.includes("Senior")) return "Senior"
    if (title.includes("Lead") || title.includes("Principal")) return "Lead"
    if (title.includes("Junior")) return "Junior"
    return "Mid-level"
  }

  private convertMCPJob(mcpJob: any): JobListing {
    return {
      id: mcpJob.id,
      title: mcpJob.title,
      company: mcpJob.company,
      location: mcpJob.location,
      salary: mcpJob.salary,
      description: `Position at ${mcpJob.company} for ${mcpJob.title}`,
      requirements: [...mcpJob.requiredSkills, ...mcpJob.preferredSkills],
      postedDate: mcpJob.postedDate,
      source: "uclone-mcp",
      url: mcpJob.url,
      remote: mcpJob.location.includes("Remote"),
      experienceLevel: mcpJob.experienceLevel,
      employmentType: "Full-time"
    }
  }

  private deduplicateJobs(jobs: JobListing[]): JobListing[] {
    const seen = new Set<string>()
    return jobs.filter(job => {
      const key = `${job.company}-${job.title}-${job.location}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  private rankJobsByRelevance(
    jobs: JobListing[], 
    options: ScrapingOptions
  ): JobListing[] {
    return jobs.sort((a, b) => {
      let scoreA = 0, scoreB = 0

      // Recency bonus
      const daysAgoA = (Date.now() - a.postedDate.getTime()) / 86400000
      const daysAgoB = (Date.now() - b.postedDate.getTime()) / 86400000
      scoreA += Math.max(0, 10 - daysAgoA)
      scoreB += Math.max(0, 10 - daysAgoB)

      // Keyword match bonus
      if (options.keywords) {
        const textA = `${a.title} ${a.description}`
        const textB = `${b.title} ${b.description}`
        
        for (const keyword of options.keywords) {
          if (textA.toLowerCase().includes(keyword.toLowerCase())) scoreA += 5
          if (textB.toLowerCase().includes(keyword.toLowerCase())) scoreB += 5
        }
      }

      // Salary bonus (if above minimum)
      if (options.minSalary && a.salary && a.salary.min >= options.minSalary) {
        scoreA += 3
      }
      if (options.minSalary && b.salary && b.salary.min >= options.minSalary) {
        scoreB += 3
      }

      return scoreB - scoreA
    })
  }

  private normalizeJobTitle(title: string): string {
    // Remove company-specific prefixes/suffixes
    let normalized = title
      .replace(/\b(Sr\.?|Senior|Jr\.?|Junior|Lead|Principal|Staff)\b/gi, "")
      .replace(/\b(I|II|III|IV|V)\b/g, "")
      .trim()

    // Standardize common variations
    const replacements: Record<string, string> = {
      "Software Engineer": "Software Developer",
      "Software Dev": "Software Developer",
      "Front End": "Frontend",
      "Back End": "Backend",
      "Full-Stack": "Full Stack"
    }

    for (const [from, to] of Object.entries(replacements)) {
      normalized = normalized.replace(new RegExp(from, "gi"), to)
    }

    return normalized
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Singleton instance
let jobScraperInstance: JobScraper | null = null

export function getJobScraper(): JobScraper {
  if (!jobScraperInstance) {
    jobScraperInstance = new JobScraper()
  }
  return jobScraperInstance
}

export default JobScraper
