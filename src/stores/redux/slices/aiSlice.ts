import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ChatMessage, SkillRecommendation, PathRecommendation } from "@/lib/types"

interface AIState {
  chatSessions: Record<string, ChatMessage[]>
  currentSessionId: string | null
  recommendations: {
    skills: SkillRecommendation[]
    paths: PathRecommendation[]
    lastUpdated: string | null
  }
  nextAction: {
    action: string
    reason: string
    expectedOutcome: string
    timeRequired: number
  } | null
  isProcessing: boolean
  error: string | null
}

const initialState: AIState = {
  chatSessions: {},
  currentSessionId: null,
  recommendations: {
    skills: [],
    paths: [],
    lastUpdated: null,
  },
  nextAction: null,
  isProcessing: false,
  error: null,
}

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    // Chat actions
    startNewSession: (state, action: PayloadAction<string>) => {
      const sessionId = action.payload
      state.currentSessionId = sessionId
      if (!state.chatSessions[sessionId]) {
        state.chatSessions[sessionId] = []
      }
    },
    
    addMessage: (state, action: PayloadAction<{ sessionId: string; message: ChatMessage }>) => {
      const { sessionId, message } = action.payload
      if (!state.chatSessions[sessionId]) {
        state.chatSessions[sessionId] = []
      }
      state.chatSessions[sessionId].push(message)
    },
    
    clearSession: (state, action: PayloadAction<string>) => {
      const sessionId = action.payload
      delete state.chatSessions[sessionId]
      if (state.currentSessionId === sessionId) {
        state.currentSessionId = null
      }
    },
    
    // Recommendation actions
    setSkillRecommendations: (state, action: PayloadAction<SkillRecommendation[]>) => {
      state.recommendations.skills = action.payload
      state.recommendations.lastUpdated = new Date().toISOString()
    },
    
    setPathRecommendations: (state, action: PayloadAction<PathRecommendation[]>) => {
      state.recommendations.paths = action.payload
      state.recommendations.lastUpdated = new Date().toISOString()
    },
    
    setNextAction: (state, action: PayloadAction<AIState["nextAction"]>) => {
      state.nextAction = action.payload
    },
    
    // Processing state
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    // Clear all recommendations
    clearRecommendations: (state) => {
      state.recommendations = {
        skills: [],
        paths: [],
        lastUpdated: null,
      }
      state.nextAction = null
    },
  },
})

export const {
  startNewSession,
  addMessage,
  clearSession,
  setSkillRecommendations,
  setPathRecommendations,
  setNextAction,
  setProcessing,
  setError,
  clearRecommendations,
} = aiSlice.actions

export default aiSlice.reducer
