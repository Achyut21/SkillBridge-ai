"use client"

import { useState, useEffect } from "react"
import { Mic, Sparkles, Brain } from "lucide-react"
import { cn } from "@/lib/utils"

interface AICoachAvatarProps {
  isListening?: boolean
  isSpeaking?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function AICoachAvatar({ 
  isListening = false, 
  isSpeaking = false, 
  size = "md",
  className 
}: AICoachAvatarProps) {
  const [pulseStep, setPulseStep] = useState(0)

  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setPulseStep((prev) => (prev + 1) % 4)
      }, 200)
      return () => clearInterval(interval)
    } else {
      setPulseStep(0)
    }
  }, [isSpeaking])

  const pulseIntensity = isSpeaking ? 0.5 + (pulseStep * 0.125) : 0

  const sizes = {
    sm: "w-full h-full",
    md: "w-32 h-32",
    lg: "w-48 h-48"
  }

  const iconSizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24"
  }

  return (
    <div className={cn("relative flex items-center justify-center", sizes[size], className)}>
      {/* Speaking animation circles */}
      {isSpeaking && (
        <>
          <div className="absolute inset-0 rounded-full bg-brand-600/20 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-brand-600/10 animate-ping animation-delay-200" />
          <div className="absolute inset-0 rounded-full bg-brand-600/5 animate-ping animation-delay-400" />
        </>
      )}

      {/* Listening pulse */}
      {isListening && (
        <div className="absolute inset-0 rounded-full bg-brand-600/20 animate-pulse" />
      )}

      {/* Center icon */}
      <div className="relative z-10">
        {isListening ? (
          <Mic className={cn(iconSizes[size], "text-brand-600 animate-pulse")} />
        ) : isSpeaking ? (
          <div className="relative">
            <Sparkles className={cn(iconSizes[size], "text-brand-600 animate-pulse")} />
          </div>
        ) : (
          <Brain className={cn(iconSizes[size], "text-brand-600/70")} />
        )}
      </div>
    </div>
  )
}
