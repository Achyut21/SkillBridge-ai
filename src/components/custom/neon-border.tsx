"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface NeonBorderProps {
  children: ReactNode
  className?: string
  color?: "blue" | "purple" | "pink" | "cyan" | "gradient"
  animated?: boolean
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  borderWidth?: "thin" | "normal" | "thick"
}

export function NeonBorder({
  children,
  className,
  color = "blue",
  animated = true,
  rounded = "xl",
  borderWidth = "normal",
}: NeonBorderProps) {
  const colors = {
    blue: "from-neon-blue to-neon-blue",
    purple: "from-neon-purple to-neon-purple",
    pink: "from-neon-pink to-neon-pink",
    cyan: "from-neon-cyan to-neon-cyan",
    gradient: "from-neon-blue via-neon-purple to-neon-pink",
  }

  const roundedStyles = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  }

  const borderWidths = {
    thin: "p-[1px]",
    normal: "p-[2px]",
    thick: "p-[3px]",
  }

  return (
    <div className={cn("relative", className)}>
      {/* Animated glow background */}
      {animated && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r blur-xl opacity-50",
            colors[color],
            roundedStyles[rounded],
            "animate-pulse"
          )}
        />
      )}
      
      {/* Border container */}
      <div
        className={cn(
          "relative bg-gradient-to-r",
          colors[color],
          roundedStyles[rounded],
          borderWidths[borderWidth],
          animated && "animate-glow"
        )}
      >
        {/* Inner content with background */}
        <div
          className={cn(
            "bg-background h-full w-full",
            roundedStyles[rounded]
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
