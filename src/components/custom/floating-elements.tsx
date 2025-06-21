"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface FloatingElementProps {
  children: ReactNode
  className?: string
  duration?: number
  delay?: number
  distance?: number
}

export function FloatingElement({
  children,
  className,
  duration = 6,
  delay = 0,
  distance = 20,
}: FloatingElementProps) {
  return (
    <div
      className={cn("animate-float", className)}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        "--float-distance": `${distance}px`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

interface FloatingOrbitProps {
  children: ReactNode
  className?: string
  radius?: number
  duration?: number
  reverse?: boolean
}

export function FloatingOrbit({
  children,
  className,
  radius = 100,
  duration = 20,
  reverse = false,
}: FloatingOrbitProps) {
  return (
    <div className="relative">
      <div
        className={cn(
          "absolute animate-spin",
          reverse && "animation-reverse",
          className
        )}
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
        }}
      >
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
