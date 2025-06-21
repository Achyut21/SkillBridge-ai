"use client"

import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, ReactNode } from "react"

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "primary" | "secondary" | "accent" | "danger"
  size?: "sm" | "md" | "lg"
  glow?: boolean
  pulse?: boolean
}

export function GradientButton({
  children,
  className,
  variant = "primary",
  size = "md",
  glow = true,
  pulse = false,
  disabled,
  ...props
}: GradientButtonProps) {
  const variants = {
    primary: "from-neon-blue to-neon-purple",
    secondary: "from-neon-purple to-neon-pink",
    accent: "from-neon-cyan to-neon-blue",
    danger: "from-red-500 to-pink-500",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <button
      className={cn(
        "relative font-semibold text-white rounded-full",
        "bg-gradient-to-r transition-all duration-300",
        "transform-gpu overflow-hidden",
        variants[variant],
        sizes[size],
        glow && "shadow-lg hover:shadow-xl",
        pulse && "animate-pulse",
        !disabled && "hover:scale-110 active:scale-95",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {/* Neural network animation overlay */}
      <span className="absolute inset-0 animate-gradient bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
      
      {/* Glow effect */}
      {glow && !disabled && (
        <span className="absolute inset-0 rounded-full animate-glow blur-md opacity-50 bg-gradient-to-r from-neon-blue to-neon-purple" />
      )}
      
      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </button>
  )
}
