import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ChatMessage, SkillRecommendation } from '@/lib/types';

interface AIState {
  // Chat state
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  
  // Recommendations state
  recommendations: SkillRecommendation[];
  skillAssessment: {
    currentLevel: string;
    strengths: string[];
    gaps: string[];
    marketDemand: number;
  } | null;
  
  // Learning path state
  currentPath: {
    id: string;
    title: string;
    progress: number;
    nextMilestone: string;
  } | null;
  
  // Voice coaching state
  voiceSessionActive: boolean;
  dailyBriefing: string | null;
}

const initialState: AIState = {
  messages: [],
  isLoading: false,
  error: null,
  recommendations: [],
  skillAssessment: null,
  currentPath: null,
  voiceSessionActive: false,
  dailyBriefing: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    // Chat actions
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Recommendations actions
    setRecommendations: (state, action: PayloadAction<SkillRecommendation[]>) => {
      state.recommendations = action.payload;
    },
    updateRecommendationPriority: (
      state,
      action: PayloadAction<{ id: string; priority: 'high' | 'medium' | 'low' }>
    ) => {
      const rec = state.recommendations.find((r: SkillRecommendation) => (r as any).id === action.payload.id);
      if (rec) {
        (rec as any).priority = action.payload.priority;
      }
    },
    
    // Skill assessment actions
    setSkillAssessment: (state, action: PayloadAction<AIState['skillAssessment']>) => {
      state.skillAssessment = action.payload;
    },
    
    // Learning path actions
    setCurrentPath: (state, action: PayloadAction<AIState['currentPath']>) => {
      state.currentPath = action.payload;
    },
    updatePathProgress: (state, action: PayloadAction<number>) => {
      if (state.currentPath) {
        state.currentPath.progress = action.payload;
      }
    },
    
    // Voice coaching actions
    setVoiceSessionActive: (state, action: PayloadAction<boolean>) => {
      state.voiceSessionActive = action.payload;
    },
    setDailyBriefing: (state, action: PayloadAction<string>) => {
      state.dailyBriefing = action.payload;
    },
  },
});

export const {
  addMessage,
  clearMessages,
  setLoading,
  setError,
  setRecommendations,
  updateRecommendationPriority,
  setSkillAssessment,
  setCurrentPath,
  updatePathProgress,
  setVoiceSessionActive,
  setDailyBriefing,
} = aiSlice.actions;

export default aiSlice.reducer;