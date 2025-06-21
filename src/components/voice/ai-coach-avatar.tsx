"use client"

import { useState, useEffect } from "react"
import { Mic, MicOff, Sparkles } from "lucide-react"
import { FloatingElement, FloatingOrbit } from "@/components/custom"
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
  const [pulseIntensity, setPulseIntensity] = useState(0)

  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setPulseIntensity(Math.random() * 0.5 + 0.5)
      }, 200)
      return () => clearInterval(interval)
    } else {
      setPulseIntensity(0)
    }
  }, [isSpeaking])

  const sizes = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-48 h-48"
  }

  const iconSizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24"
  }

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Orbiting particles */}
      {(isListening || isSpeaking) && (
        <>
          <FloatingOrbit radius={80} duration={15}>
            <div className="w-2 h-2 bg-neon-blue rounded-full shadow-[0_0_10px_rgba(0,217,255,0.8)]" />
          </FloatingOrbit>
          <FloatingOrbit radius={100} duration={20} reverse>
            <div className="w-3 h-3 bg-neon-purple rounded-full shadow-[0_0_15px_rgba(124,58,237,0.8)]" />
          </FloatingOrbit>
          <FloatingOrbit radius={120} duration={25}>
            <div className="w-2 h-2 bg-neon-pink rounded-full shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
          </FloatingOrbit>
        </>
      )}

      {/* Main avatar */}
      <FloatingElement duration={6} distance={10}>
        <div className={cn("relative", sizes[size])}>
          {/* Glow effect */}
          {isSpeaking && (
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple blur-xl animate-pulse"
              style={{
                opacity: pulseIntensity,
                transform: `scale(${1 + pulseIntensity * 0.2})`
              }}
            />
          )}

          {/* Avatar circle */}
          <div className={cn(
            "relative rounded-full bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink p-[2px]",
            "transition-all duration-300",
            isListening && "animate-pulse",
            isSpeaking && "animate-glow"
          )}>
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              {/* Center icon */}
              {isListening ? (
                <Mic className={cn(iconSizes[size], "text-neon-blue animate-pulse")} />
              ) : isSpeaking ? (
                <div className="relative">
                  <Sparkles className={cn(iconSizes[size], "text-neon-purple")} />
                  {/* Speaking waves */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-full h-full rounded-full border border-neon-purple/30"
                        style={{
                          animation: `ping ${2 + i * 0.5}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                          animationDelay: `${i * 0.3}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <Sparkles className={cn(iconSizes[size], "text-gray-400")} />
              )}
            </div>
          </div>

          {/* Status indicator */}
          <div className={cn(
            "absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-background",
            "transition-all duration-300",
            isListening && "bg-neon-blue animate-pulse",
            isSpeaking && "bg-neon-purple animate-pulse",
            !isListening && !isSpeaking && "bg-gray-500"
          )} />
        </div>
      </FloatingElement>

      {/* Status text */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <p className={cn(
          "text-sm font-medium transition-all duration-300",
          isListening && "text-neon-blue",
          isSpeaking && "text-neon-purple",
          !isListening && !isSpeaking && "text-gray-400"
        )}>
          {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Ready"}
        </p>
      </div>
    </div>
  )
}
