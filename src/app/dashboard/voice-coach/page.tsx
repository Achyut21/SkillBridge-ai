"use client"

import { useState, useEffect } from "react"
import { GlassmorphismCard } from "@/components/custom/glassmorphism-card"
import { AICoachAvatar } from "@/components/voice/ai-coach-avatar"
import { ChatInterface } from "@/components/ai/chat-interface"
import { SmartSuggestions } from "@/components/ai/smart-suggestions"
import { VoicePlayer } from "@/components/voice/voice-player"
import { useAIChat } from "@/hooks/use-ai-chat"
import { useVoiceStore } from "@/stores/voice-store"
import { useSession } from "next-auth/react"
import { 
  Settings, 
  Volume2, 
  VolumeX,
  Sparkles,
  Loader2,
  RefreshCw,
  MessageSquare
} from "lucide-react"
import { toast } from "sonner"

const suggestedPrompts = [
  "What skills should I focus on for AI engineering?",
  "Create a learning plan for becoming a full-stack developer",
  "How can I improve my JavaScript skills?",
  "What are the most in-demand skills in 2025?",
  "Help me prepare for technical interviews",
  "Suggest resources for learning React and TypeScript"
]

const WELCOME_MESSAGE = "👋 Hi! I&apos;m your AI voice coach. Enable voice mode using the button above to hear my responses. I can help you with career guidance, skill recommendations, and personalized learning paths. What would you like to explore today?"

export default function VoiceCoachPage() {
  const { data: session } = useSession()
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<any>({
    skills: [],
    paths: [],
    nextAction: null
  })
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  
  const {
    isEnabled,
    isSpeaking,
    currentAudioUrl,
    selectedVoiceId,
    setEnabled,
    setSpeaking,
    setCurrentAudioUrl
  } = useVoiceStore()

  const {
    messages,
    sessionId,
    isLoading,
    sendMessage,
    playAudio: hookPlayAudio,
    stopAudio: hookStopAudio,
    isPlaying
  } = useAIChat({
    sessionId: selectedSessionId || undefined,
    enableVoice: isEnabled,
    onNewMessage: (message) => {
      // Handle new message with voice
      if (message.metadata?.audioUrl && isEnabled) {
        // Set the audio URL for VoicePlayer to handle
        setCurrentAudioUrl(message.metadata.audioUrl)
        setSpeaking(true)
      }
    }
  })

  // Override the hook's audio functions to prevent double-playing
  const playAudio = (url: string) => {
    setCurrentAudioUrl(url)
    setSpeaking(true)
  }

  const stopAudio = () => {
    setCurrentAudioUrl(null)
    setSpeaking(false)
    hookStopAudio()
  }

  // Update selected session when a new one is created
  useEffect(() => {
    if (sessionId && !selectedSessionId) {
      setSelectedSessionId(sessionId)
    }
  }, [sessionId, selectedSessionId])

  // Load recommendations only on user action, not on mount
  useEffect(() => {
    // Don't auto-load recommendations
    // if (session?.user) {
    //   loadRecommendations()
    // }
  }, [session])

  const loadRecommendations = async () => {
    if (!session?.user) return
    
    setIsLoadingRecommendations(true)
    try {
      const response = await fetch("/api/ai/recommendations?count=5&includeMarketData=true")
      if (response.ok) {
        const data = await response.json()
        setRecommendations({
          skills: data,
          paths: [], // TODO: Load path recommendations
          nextAction: null // TODO: Load next action
        })
      }
    } catch (error) {
      console.error("Failed to load recommendations:", error)
      toast.error("Failed to load recommendations")
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  const handleSendMessage = async (content: string) => {
    setSpeaking(false)
    stopAudio()
    await sendMessage(content)
  }

  const handleVoiceToggle = () => {
    setEnabled(!isEnabled)
    if (!isEnabled) {
      toast.success("Voice enabled - I'll speak my responses", {
        description: "You'll hear my voice after each message",
        icon: <Volume2 className="w-4 h-4" />
      })
    } else {
      stopAudio()
      setSpeaking(false)
      toast.info("Voice disabled - Text only mode", {
        icon: <VolumeX className="w-4 h-4" />
      })
    }
  }

  return (
    <div className="voice-coach-container h-full">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Voice Coach
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get personalized guidance and motivation through AI-powered coaching
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Voice Toggle */}
          <button
            onClick={handleVoiceToggle}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-brand-600" />
                <span className="text-sm font-medium">Voice On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Voice Off</span>
              </>
            )}
          </button>
          
          {/* Settings Button */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          {/* Left Sidebar - Coach Info */}
          <div className="lg:col-span-3 space-y-4 overflow-y-auto">
            <GlassmorphismCard variant="single" className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 p-1">
                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                      <AICoachAvatar
                        isSpeaking={isSpeaking}
                        isListening={false}
                        size="sm"
                      />
                    </div>
                  </div>
                  <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${
                    isSpeaking ? "bg-green-500" : isLoading ? "bg-yellow-500" : "bg-gray-400"
                  }`} />
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Alex - Your AI Coach
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isSpeaking ? "Speaking..." : isLoading ? "Thinking..." : "Ready to help"}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">{messages.length} messages</span>
                  </div>
                </div>
              </div>
            </GlassmorphismCard>

            {/* Voice Player */}
            {currentAudioUrl && (
              <VoicePlayer
                audioUrl={currentAudioUrl}
                onEnded={() => {
                  setSpeaking(false)
                  setCurrentAudioUrl(null)
                }}
              />
            )}

            {/* Session Stats */}
            <GlassmorphismCard className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Session Time</span>
                  <span className="text-sm font-medium">{Math.floor(messages.length * 1.5)} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Topics</span>
                  <span className="text-sm font-medium">{Math.ceil(messages.length / 3)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Insights</span>
                  <span className="text-sm font-medium">{recommendations.skills.length}</span>
                </div>
              </div>
            </GlassmorphismCard>
          </div>

          {/* Center - Chat Interface */}
          <div className="lg:col-span-6 min-h-0">
            <GlassmorphismCard variant="single" className="h-full flex flex-col p-0 overflow-hidden">
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                suggestedPrompts={messages.length === 0 ? suggestedPrompts : []}
                enableVoice={isEnabled}
                className="h-full"
              />
            </GlassmorphismCard>
          </div>

          {/* Right Sidebar - Smart Suggestions */}
          <div className="lg:col-span-3 min-h-0 overflow-y-auto">
            <SmartSuggestions
              skillRecommendations={recommendations.skills}
              pathRecommendations={recommendations.paths}
              nextAction={recommendations.nextAction}
              isLoading={isLoadingRecommendations}
              onRefresh={loadRecommendations}
              onSelectSkill={(skill) => {
                const prompt = `Tell me more about learning ${skill.skill.name} and why it&apos;s important for my career`
                handleSendMessage(prompt)
              }}
              onSelectPath={(path) => {
                const prompt = `Create a detailed study plan for: ${path.title}`
                handleSendMessage(prompt)
              }}
            />
          </div>
        </div>
    </div>
  )
}
