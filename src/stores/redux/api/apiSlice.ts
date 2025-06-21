import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { 
  SkillRecommendation, 
  PathRecommendation, 
  JobMarketData,
  ChatMessage,
  ApiResponse,
  PaginatedResponse,
  SkillTrend,
  IndustryInsight
} from "@/lib/types"

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      // Add auth token if available
      const token = localStorage.getItem("auth-token")
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Skills", "Recommendations", "MarketData", "LearningPaths", "Chat"],
  endpoints: (builder) => ({
    // AI Endpoints
    getSkillRecommendations: builder.query<SkillRecommendation[], { userId: string; count?: number }>({
      query: ({ userId, count = 5 }) => ({
        url: "/ai/recommendations",
        params: { userId, count },
      }),
      providesTags: ["Recommendations"],
    }),

    generateLearningPath: builder.mutation<PathRecommendation, {
      currentRole: string
      targetRole: string
      currentSkills: string[]
      timeframe: number
    }>({
      query: (data) => ({
        url: "/ai/generate-path",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LearningPaths"],
    }),

    sendChatMessage: builder.mutation<ChatMessage, { message: string; sessionId?: string }>({
      query: (data) => ({
        url: "/ai/chat",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    // Market Data Endpoints
    getJobMarketData: builder.query<JobMarketData[], string[]>({
      query: (skillIds) => ({
        url: "/market-data/jobs",
        params: { skills: skillIds.join(",") },
      }),
      providesTags: ["MarketData"],
    }),

    getSkillTrends: builder.query<SkillTrend[], { skillId: string; days?: number }>({
      query: ({ skillId, days = 90 }) => ({
        url: `/market-data/skills/${skillId}/trends`,
        params: { days },
      }),
      providesTags: ["MarketData"],
    }),

    getIndustryInsights: builder.query<IndustryInsight, string>({
      query: (industry) => `/market-data/industries/${industry}`,
      providesTags: ["MarketData"],
    }),

    getTrendingSkills: builder.query<PaginatedResponse<any>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/market-data/skills/trending",
        params: { page, limit },
      }),
      providesTags: ["Skills"],
    }),

    // Learning Endpoints
    getUserLearningPaths: builder.query<PaginatedResponse<any>, { userId: string; active?: boolean }>({
      query: ({ userId, active }) => ({
        url: "/learning/paths",
        params: { userId, active },
      }),
      providesTags: ["LearningPaths"],
    }),

    createLearningPath: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: "/learning/paths",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LearningPaths"],
    }),

    updateLearningProgress: builder.mutation<ApiResponse<any>, {
      pathId: string
      skillId: string
      progress: number
    }>({
      query: (data) => ({
        url: `/learning/paths/${data.pathId}/progress`,
        method: "PUT",
        body: { skillId: data.skillId, progress: data.progress },
      }),
      invalidatesTags: ["LearningPaths"],
    }),

    // Real-time subscriptions (WebSocket endpoints)
    subscribeToMarketUpdates: builder.query<any, string[]>({
      queryFn: () => ({ data: null }),
      async onCacheEntryAdded(skillIds, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        // WebSocket connection logic would go here
        try {
          await cacheDataLoaded
          // Connect to WebSocket and update cache with real-time data
        } catch {
          // Handle error
        }
        await cacheEntryRemoved
      },
    }),
  }),
})

// Export hooks for usage in components
export const {
  useGetSkillRecommendationsQuery,
  useGenerateLearningPathMutation,
  useSendChatMessageMutation,
  useGetJobMarketDataQuery,
  useGetSkillTrendsQuery,
  useGetIndustryInsightsQuery,
  useGetTrendingSkillsQuery,
  useGetUserLearningPathsQuery,
  useCreateLearningPathMutation,
  useUpdateLearningProgressMutation,
  useSubscribeToMarketUpdatesQuery,
} = apiSlice
