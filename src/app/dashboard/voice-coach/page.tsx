"use client"

import { useState } from "react"
import { 
  GlassmorphismCard, 
  GradientButton, 
  NeonBorder,
  FloatingElement 
} from "@/components/custom"
import { VoicePlayer } from "@/components/voice/voice-player"
import { AICoachAvatar } from "@/components/voice/ai-coach-avatar"
import { useVoiceStore } from "@/stores/voice-store"
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Settings, 
  MessageSquare,
  Brain,
  Target,
  Zap
} from "lucide-react"

const coachingPrompts = [
  {
    icon: Brain,
    title: "Daily Motivation",
    prompt: "Give me a motivational message for learning",
    color: "text-neon-blue"
  },
  {
    icon: Target,
    title: "Goal Setting",
    prompt: "Help me set learning goals for this week",
    color: "text-neon-purple"
  },
  {
    icon: MessageSquare,
    title: "Career Advice",
    prompt: "What skills should I focus on for career growth?",
    color: "text-neon-pink"
  },
  {
    icon: Zap,
    title: "Quick Tips",
    prompt: "Give me a quick learning tip",
    color: "text-neon-cyan"
  }
]

export default function VoiceCoachPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<string>("")
  const [isRecording, setIsRecording] = useState(false)
  const {
    isEnabled,
    isSpeaking,
    currentAudioUrl,
    setEnabled,
    setSpeaking,
    setCurrentAudioUrl
  } = useVoiceStore()

  const handlePromptSelect = async (prompt: string) => {
    setSelectedPrompt(prompt)
    
    // TODO: Call API to generate voice response
    // For now, just show the prompt
    console.log("Selected prompt:", prompt)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // TODO: Implement voice recording
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">
          AI Voice Coach
        </h1>
        <p className="text-gray-400 text-lg">
          Get personalized guidance and motivation through voice interaction
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coach Avatar & Controls */}
        <div className="lg:col-span-1">
          <GlassmorphismCard variant="heavy" glow="purple" className="p-8">
            <div className="flex flex-col items-center space-y-8">
              {/* Avatar */}
              <AICoachAvatar
                isSpeaking={isSpeaking}
                isListening={isRecording}
                size="lg"
              />

              {/* Voice Toggle */}
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Voice Assistant</h3>
                <label className="flex items-center justify-center gap-3">
                  <span className="text-sm text-gray-400">
                    {isEnabled ? "Enabled" : "Disabled"}
                  </span>
                  <button
                    onClick={() => setEnabled(!isEnabled)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      isEnabled ? "bg-neon-purple" : "bg-gray-600"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        isEnabled ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>
              </div>

              {/* Record Button */}
              <NeonBorder color="gradient" rounded="full">
                <button
                  onClick={toggleRecording}
                  className={cn(
                    "p-6 rounded-full transition-all duration-300",
                    isRecording 
                      ? "bg-red-500/20 hover:bg-red-500/30" 
                      : "bg-background hover:bg-white/5"
                  )}
                >
                  {isRecording ? (
                    <Mic className="w-8 h-8 text-red-500 animate-pulse" />
                  ) : (
                    <MicOff className="w-8 h-8" />
                  )}
                </button>
              </NeonBorder>

              <p className="text-sm text-gray-400 text-center">
                {isRecording 
                  ? "Listening... Click to stop" 
                  : "Click to start voice input"
                }
              </p>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Conversation & Prompts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Prompts */}
          <GlassmorphismCard variant="medium" className="p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {coachingPrompts.map((prompt) => (
                <button
                  key={prompt.title}
                  onClick={() => handlePromptSelect(prompt.prompt)}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 text-left group"
                >
                  <prompt.icon className={cn("w-6 h-6 mb-2", prompt.color)} />
                  <h4 className="font-medium mb-1">{prompt.title}</h4>
                  <p className="text-xs text-gray-400">
                    {prompt.prompt}
                  </p>
                </button>
              ))}
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

          {/* Conversation History */}
          <GlassmorphismCard variant="heavy" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Conversation</h3>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-all">
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Sample conversation */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple p-[1px] flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <span className="text-xs">You</span>
                  </div>
                </div>
                <div className="flex-1 p-3 rounded-lg bg-white/5">
                  <p className="text-sm">
                    What skills should I focus on for AI engineering?
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink flex-shrink-0 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 p-3 rounded-lg bg-gradient-to-r from-neon-purple/10 to-neon-pink/10 border border-white/10">
                  <p className="text-sm">
                    For AI engineering, I recommend focusing on these key areas:
                    Python programming, machine learning fundamentals, deep learning
                    frameworks like TensorFlow or PyTorch, and understanding of
                    natural language processing...
                  </p>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="mt-4">
              <NeonBorder color="gradient" rounded="lg">
                <div className="flex items-center gap-3 p-3">
                  <input
                    type="text"
                    placeholder="Type a message or use voice input..."
                    className="flex-1 bg-transparent outline-none text-sm"
                    value={selectedPrompt}
                    onChange={(e) => setSelectedPrompt(e.target.value)}
                  />
                  <GradientButton size="sm" variant="primary">
                    Send
                  </GradientButton>
                </div>
              </NeonBorder>
            </div>
          </GlassmorphismCard>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
