"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface GlassmorphismCardProps {
  children: ReactNode
  className?: string
  variant?: "light" | "medium" | "heavy"
  glow?: "blue" | "purple" | "pink" | "cyan" | "none"
  hover?: boolean
}

export function GlassmorphismCard({
  children,
  className,
  variant = "medium",
  glow = "none",
  hover = true,
}: GlassmorphismCardProps) {
  const variants = {
    light: "backdrop-blur-md bg-white/5 border-white/10",
    medium: "backdrop-blur-xl bg-white/10 border-white/20",
    heavy: "backdrop-blur-2xl bg-white/20 border-white/30",
  }

  const glowStyles = {
    blue: "shadow-[0_0_30px_rgba(0,217,255,0.5)] border-neon-blue/50",
    purple: "shadow-[0_0_30px_rgba(124,58,237,0.5)] border-neon-purple/50",
    pink: "shadow-[0_0_30px_rgba(236,72,153,0.5)] border-neon-pink/50",
    cyan: "shadow-[0_0_30px_rgba(6,182,212,0.5)] border-neon-cyan/50",
    none: "",
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl border transition-all duration-300",
        variants[variant],
        glow !== "none" && glowStyles[glow],
        hover && "hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,217,255,0.3)]",
        className
      )}
    >
      {/* Neural network effect overlay */}
      <div className="absolute inset-0 rounded-2xl opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-transparent to-neon-purple/10" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
