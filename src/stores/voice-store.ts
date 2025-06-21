import { create } from "zustand"
import { persist } from "zustand/middleware"
import { VOICE_IDS } from "@/services/ai/elevenlabs"

interface VoiceSettings {
  voiceId: string
  voiceName: string
  speed: number
  stability: number
  similarityBoost: number
  style: number
  volume: number
  autoPlay: boolean
}

interface VoiceStore extends VoiceSettings {
  isEnabled: boolean
  isSpeaking: boolean
  isListening: boolean
  currentAudioUrl: string | null
  
  // Actions
  setVoiceSettings: (settings: Partial<VoiceSettings>) => void
  setEnabled: (enabled: boolean) => void
  setSpeaking: (speaking: boolean) => void
  setListening: (listening: boolean) => void
  setCurrentAudioUrl: (url: string | null) => void
  resetToDefaults: () => void
}

const defaultSettings: VoiceSettings = {
  voiceId: VOICE_IDS.rachel,
  voiceName: "Rachel",
  speed: 1.0,
  stability: 0.5,
  similarityBoost: 0.75,
  style: 0.5,
  volume: 1.0,
  autoPlay: true,
}

export const useVoiceStore = create<VoiceStore>()(
  persist(
    (set) => ({
      // State
      ...defaultSettings,
      isEnabled: true,
      isSpeaking: false,
      isListening: false,
      currentAudioUrl: null,

      // Actions
      setVoiceSettings: (settings) =>
        set((state) => ({
          ...state,
          ...settings,
        })),

      setEnabled: (enabled) => set({ isEnabled: enabled }),
      setSpeaking: (speaking) => set({ isSpeaking: speaking }),
      setListening: (listening) => set({ isListening: listening }),
      setCurrentAudioUrl: (url) => set({ currentAudioUrl: url }),

      resetToDefaults: () =>
        set({
          ...defaultSettings,
          isEnabled: true,
          isSpeaking: false,
          isListening: false,
          currentAudioUrl: null,
        }),
    }),
    {
      name: "voice-settings",
      partialize: (state) => ({
        voiceId: state.voiceId,
        voiceName: state.voiceName,
        speed: state.speed,
        stability: state.stability,
        similarityBoost: state.similarityBoost,
        style: state.style,
        volume: state.volume,
        autoPlay: state.autoPlay,
        isEnabled: state.isEnabled,
      }),
    }
  )
)
