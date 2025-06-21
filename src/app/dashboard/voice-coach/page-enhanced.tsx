"use client"

import { useState } from "react"
import { 
  GradientButton
} from "@/components/custom"
import { GlassmorphismCard } from "@/components/custom/glassmorphism-card-enhanced"
import { VoicePlayer } from "@/components/voice/voice-player"
import { VoiceWaveform } from "@/components/voice/voice-waveform"
import { AICoachAvatar } from "@/components/voice/ai-coach-avatar"
import { useVoiceStore } from "@/stores/voice-store"
import { 
  Mic, 
  MicOff, 
  Settings, 
  MessageSquare,
  Brain,
  Target,
  Zap,
  Sparkles,
  Volume2
} from "lucide-react"

const coachingPrompts = [
  {
    icon: Brain,
    title: "Daily Motivation",
    prompt: "Give me a motivational message for learning",
    color: "from-brand-400 to-brand-600"
  },
  {
    icon: Target,
    title: "Goal Setting",    prompt: "Help me set learning goals for this week",
    color: "from-brand-500 to-brand-700"
  },
  {
    icon: MessageSquare,
    title: "Career Advice",
    prompt: "What skills should I focus on for career growth?",
    color: "from-brand-600 to-brand-800"
  },
  {
    icon: Zap,
    title: "Quick Tips",
    prompt: "Give me a quick learning tip",
    color: "from-brand-400 to-brand-600"
  }
]

export default function VoiceCoachPageEnhanced() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null)
  const { selectedVoice } = useVoiceStore()

  const handleStartListening = () => {
    setIsListening(!isListening)
    // Voice recognition logic here
  }

  const handlePromptClick = (index: number) => {
    setSelectedPrompt(index)
    setIsSpeaking(true)    // Simulate speaking
    setTimeout(() => setIsSpeaking(false), 3000)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">
          AI Voice <span className="gradient-text-animated">Coach</span>
        </h1>
        <p className="text-gray-600 dark:text-neutral-400">
          Your personal AI assistant for learning and career guidance
        </p>
      </div>

      {/* Main Coach Interface */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Coach Avatar Section */}
        <div className="lg:col-span-2">
          <GlassmorphismCard variant="medium" depth="triple" glow>
            <div className="text-center space-y-6">
              {/* Avatar with enhanced effects */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                <AICoachAvatar 
                  isListening={isListening} 
                  isSpeaking={isSpeaking}
                  className="relative z-10"
                />
              </div>              
              {/* Voice Status */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  {isSpeaking ? "Coach is speaking..." : isListening ? "Listening..." : "Ready to help"}
                </h3>
                
                {/* Waveform visualization */}
                <VoiceWaveform isActive={isSpeaking || isListening} />
                
                {/* Voice controls */}
                <div className="flex justify-center gap-4">
                  <GradientButton
                    variant={isListening ? "primary" : "outline"}
                    size="lg"
                    onClick={handleStartListening}
                    className={`flex items-center gap-2 ${isListening ? 'animate-glow-pulse' : ''}`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="h-5 w-5" />
                        Stop Listening
                      </>
                    ) : (
                      <>
                        <Mic className="h-5 w-5" />
                        Start Listening
                      </>
                    )}
                  </GradientButton>
                  
                  <GradientButton variant="ghost" size="lg" className="group">                    <Settings className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                    Settings
                  </GradientButton>
                </div>
              </div>

              {/* Current voice info */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
                <Volume2 className="h-4 w-4" />
                <span>Voice: {selectedVoice || 'Sophia'}</span>
              </div>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Quick Prompts */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-500" />
            Quick Prompts
          </h2>
          
          <div className="space-y-3">
            {coachingPrompts.map((prompt, index) => (
              <GlassmorphismCard
                key={index}
                variant="light"
                hover
                className={`cursor-pointer group ${selectedPrompt === index ? 'ring-2 ring-brand-500' : ''}`}
                onClick={() => handlePromptClick(index)}
              >                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${prompt.color} group-hover:scale-110 transition-transform`}>
                    <prompt.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{prompt.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      {prompt.prompt}
                    </p>
                  </div>
                </div>
              </GlassmorphismCard>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      <GlassmorphismCard variant="medium" depth="double">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-brand-500" />
          Recent Conversations
        </h2>
        
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm">
                A
              </div>              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Learning Path Guidance</p>
                <p className="text-xs text-gray-600 dark:text-neutral-400">
                  Asked about React and Next.js learning resources • 2 hours ago
                </p>
              </div>
              <button className="text-brand-500 hover:text-brand-600 text-sm">
                Play
              </button>
            </div>
          ))}
        </div>
      </GlassmorphismCard>
    </div>
  )
}