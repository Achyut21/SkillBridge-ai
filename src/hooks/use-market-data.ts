import { useState, useEffect, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/stores/redux/hooks"
import {
  setJobMarketData,
  setSkillTrends,
  setTrendingSkills,
  toggleRealtimeUpdates,
  setLoading,
  setError
} from "@/stores/redux/slices/marketDataSlice"
import { JobMarketData, SkillTrend } from "@/lib/types"
import { getMCPConnector } from "@/services/data/mcp-connector"
import { getMarketAnalyzer } from "@/services/data/market-analyzer"

interface UseMarketDataOptions {
  skills?: string[]
  enableRealtime?: boolean
  updateInterval?: number // minutes
}

interface UseMarketDataReturn {
  jobMarketData: Record<string, JobMarketData>
  skillTrends: Record<string, SkillTrend[]>
  trendingSkills: string[]
  isLoading: boolean
  error: string | null
  isRealtimeEnabled: boolean
  refreshData: () => Promise<void>
  subscribeToSkill: (skillId: string) => void
  unsubscribeFromSkill: (skillId: string) => void
}

export function useMarketData(options: UseMarketDataOptions = {}): UseMarketDataReturn {
  const dispatch = useAppDispatch()
  const { 
    jobMarketData, 
    skillTrends, 
    trendingSkills,
    isLoading,
    error,
    realtimeUpdates
  } = useAppSelector(state => state.marketData)

  const [subscribedSkills, setSubscribedSkills] = useState<Set<string>>(
    new Set(options.skills || [])
  )

  const marketAnalyzer = getMarketAnalyzer()
  const mcpConnector = getMCPConnector()

  // Initialize MCP connection for real-time updates
  useEffect(() => {
    if (options.enableRealtime) {
      initializeRealtimeConnection()
    }

    return () => {
      if (options.enableRealtime) {
        mcpConnector.disconnect()
      }
    }
  }, [options.enableRealtime])

  // Fetch initial data for subscribed skills
  useEffect(() => {
    if (subscribedSkills.size > 0) {
      fetchMarketData(Array.from(subscribedSkills))
    }
  }, [subscribedSkills])

  // Set up periodic updates
  useEffect(() => {
    if (!realtimeUpdates.enabled || subscribedSkills.size === 0) return

    const interval = setInterval(() => {
      fetchMarketData(Array.from(subscribedSkills))
    }, (options.updateInterval || 5) * 60 * 1000)

    return () => clearInterval(interval)
  }, [realtimeUpdates.enabled, subscribedSkills, options.updateInterval])

  const initializeRealtimeConnection = async () => {
    try {
      await mcpConnector.connect()
      dispatch(toggleRealtimeUpdates(true))

      // Subscribe to real-time updates
      const unsubscribe: any = mcpConnector.streamUpdates((update: any) => {
        handleRealtimeUpdate(update)
      })

      // Store unsubscribe function for cleanup
      if (unsubscribe) {
        (window as any).__mcpUnsubscribe = unsubscribe
      }
    } catch (error) {
      console.error("Failed to connect to MCP:", error)
      dispatch(setError("Failed to connect to real-time market data"))
    }
  }

  const handleRealtimeUpdate = (update: any) => {
    switch (update.type) {
      case "skill_trend":
        if (subscribedSkills.has(update.skillId)) {
          dispatch(setSkillTrends({
            skillId: update.skillId,
            trends: update.trends
          }))
        }
        break
      
      case "job_update":
        if (update.skills.some((skill: string) => subscribedSkills.has(skill))) {
          // Update relevant job market data
          update.skills.forEach((skillId: string) => {
            if (subscribedSkills.has(skillId)) {
              dispatch(setJobMarketData({
                skillId,
                data: update.marketData
              }))
            }
          })
        }
        break
      
      case "trending_update":
        dispatch(setTrendingSkills(update.trendingSkills))
        break
    }
  }

  const fetchMarketData = async (skillIds: string[]) => {
    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      // Fetch job market data
      const marketDataPromises = skillIds.map(async (skillId) => {
        const data = await marketAnalyzer.getJobMarketData([skillId])
        return data[0]
      })

      const marketData = await Promise.all(marketDataPromises)
      marketData.forEach(data => {
        dispatch(setJobMarketData({
          skillId: data.skillId,
          data
        }))
      })

      // Fetch skill trends
      const trendPromises = skillIds.map(async (skillId) => {
        const trends = await marketAnalyzer.getSkillTrends(skillId, 90)
        return { skillId, trends }
      })

      const trendData = await Promise.all(trendPromises)
      trendData.forEach(({ skillId, trends }) => {
        dispatch(setSkillTrends({ skillId, trends }))
      })

      // Fetch trending skills
      const trending = await marketAnalyzer.getTrendingRoles()
      dispatch(setTrendingSkills(trending))
    } catch (error) {
      console.error("Failed to fetch market data:", error)
      dispatch(setError("Failed to fetch market data"))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const refreshData = useCallback(async () => {
    await fetchMarketData(Array.from(subscribedSkills))
  }, [subscribedSkills])

  const subscribeToSkill = useCallback((skillId: string) => {
    setSubscribedSkills(prev => new Set([...prev, skillId]))
  }, [])

  const unsubscribeFromSkill = useCallback((skillId: string) => {
    setSubscribedSkills(prev => {
      const next = new Set(prev)
      next.delete(skillId)
      return next
    })
  }, [])

  return {
    jobMarketData,
    skillTrends,
    trendingSkills,
    isLoading,
    error,
    isRealtimeEnabled: realtimeUpdates.enabled,
    refreshData,
    subscribeToSkill,
    unsubscribeFromSkill
  }
}
