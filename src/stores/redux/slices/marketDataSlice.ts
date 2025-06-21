import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { JobMarketData, SkillTrend, IndustryInsight } from "@/lib/types"

interface MarketDataState {
  jobMarketData: Record<string, JobMarketData>
  skillTrends: Record<string, SkillTrend[]>
  industryInsights: Record<string, IndustryInsight>
  trendingSkills: string[]
  realtimeUpdates: {
    enabled: boolean
    lastUpdate: string | null
    updateFrequency: number // minutes
  }
  filters: {
    location: string | null
    experienceLevel: string | null
    salary: {
      min: number | null
      max: number | null
    }
  }
  isLoading: boolean
  error: string | null
}

const initialState: MarketDataState = {
  jobMarketData: {},
  skillTrends: {},
  industryInsights: {},
  trendingSkills: [],
  realtimeUpdates: {
    enabled: false,
    lastUpdate: null,
    updateFrequency: 5,
  },
  filters: {
    location: null,
    experienceLevel: null,
    salary: {
      min: null,
      max: null,
    },
  },
  isLoading: false,
  error: null,
}

const marketDataSlice = createSlice({
  name: "marketData",
  initialState,
  reducers: {
    // Job market data
    setJobMarketData: (state, action: PayloadAction<{ skillId: string; data: JobMarketData }>) => {
      const { skillId, data } = action.payload
      state.jobMarketData[skillId] = data
    },
    
    batchSetJobMarketData: (state, action: PayloadAction<JobMarketData[]>) => {
      action.payload.forEach(data => {
        state.jobMarketData[data.skillId] = data
      })
    },
    
    // Skill trends
    setSkillTrends: (state, action: PayloadAction<{ skillId: string; trends: SkillTrend[] }>) => {
      const { skillId, trends } = action.payload
      state.skillTrends[skillId] = trends
    },
    
    // Industry insights
    setIndustryInsight: (state, action: PayloadAction<{ industry: string; insight: IndustryInsight }>) => {
      const { industry, insight } = action.payload
      state.industryInsights[industry] = insight
    },
    
    // Trending skills
    setTrendingSkills: (state, action: PayloadAction<string[]>) => {
      state.trendingSkills = action.payload
    },
    
    // Real-time updates
    toggleRealtimeUpdates: (state, action: PayloadAction<boolean>) => {
      state.realtimeUpdates.enabled = action.payload
      if (action.payload) {
        state.realtimeUpdates.lastUpdate = new Date().toISOString()
      }
    },
    
    setUpdateFrequency: (state, action: PayloadAction<number>) => {
      state.realtimeUpdates.updateFrequency = action.payload
    },
    
    recordUpdate: (state) => {
      state.realtimeUpdates.lastUpdate = new Date().toISOString()
    },
    
    // Filters
    setLocationFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.location = action.payload
    },
    
    setExperienceFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.experienceLevel = action.payload
    },
    
    setSalaryFilter: (state, action: PayloadAction<{ min?: number | null; max?: number | null }>) => {
      const { min, max } = action.payload
      if (min !== undefined) state.filters.salary.min = min
      if (max !== undefined) state.filters.salary.max = max
    },
    
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    
    // Loading and error states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    // Clear all data
    clearMarketData: (state) => {
      state.jobMarketData = {}
      state.skillTrends = {}
      state.industryInsights = {}
      state.trendingSkills = []
    },
  },
})

export const {
  setJobMarketData,
  batchSetJobMarketData,
  setSkillTrends,
  setIndustryInsight,
  setTrendingSkills,
  toggleRealtimeUpdates,
  setUpdateFrequency,
  recordUpdate,
  setLocationFilter,
  setExperienceFilter,
  setSalaryFilter,
  clearFilters,
  setLoading,
  setError,
  clearMarketData,
} = marketDataSlice.actions

export default marketDataSlice.reducer
