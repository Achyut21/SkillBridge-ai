"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  GlassmorphismCard, 
  GradientButton, 
  NeonBorder,
  AnimatedBackground,
  FloatingElement 
} from "@/components/custom"
import { FcGoogle } from "react-icons/fc"
import { Mail, Lock, User, Sparkles } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Sign up error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground particleCount={40} interactive />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <FloatingElement duration={4} distance={10}>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink p-[2px]">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-neon-purple" />
              </div>
            </div>
          </FloatingElement>
          
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Join SkillBridge AI
          </h1>
          <p className="text-gray-400">
            Start your AI-powered learning journey today
          </p>
        </div>

        {/* Register Form */}
        <GlassmorphismCard variant="heavy" glow="purple" className="p-8">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Name Input */}
            <NeonBorder color="gradient" rounded="lg">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-0 outline-none focus:ring-0 text-white placeholder:text-gray-500"
                  disabled={isLoading}
                />
              </div>
            </NeonBorder>

            {/* Email Input */}
            <NeonBorder color="gradient" rounded="lg">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-0 outline-none focus:ring-0 text-white placeholder:text-gray-500"
                  disabled={isLoading}
                />
              </div>
            </NeonBorder>

            {/* Password Input */}
            <NeonBorder color="gradient" rounded="lg">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-0 outline-none focus:ring-0 text-white placeholder:text-gray-500"
                  disabled={isLoading}
                />
              </div>
            </NeonBorder>

            {/* Confirm Password Input */}
            <NeonBorder color="gradient" rounded="lg">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-0 outline-none focus:ring-0 text-white placeholder:text-gray-500"
                  disabled={isLoading}
                />
              </div>
            </NeonBorder>

            {/* Sign Up Button */}
            <GradientButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading || !formData.email || !formData.password || formData.password !== formData.confirmPassword}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </GradientButton>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-gray-400">
                Or sign up with
              </span>
            </div>
          </div>

          {/* Google Sign Up */}
          <GradientButton
            onClick={handleGoogleSignUp}
            variant="secondary"
            size="lg"
            className="w-full flex items-center justify-center gap-3"
            disabled={isLoading}
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </GradientButton>

          {/* Sign In Link */}
          <p className="text-center mt-6 text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="text-neon-purple hover:text-neon-blue transition-colors"
              disabled={isLoading}
            >
              Sign in
            </button>
          </p>
        </GlassmorphismCard>

        {/* Terms and Privacy */}
        <p className="text-center mt-4 text-xs text-gray-500">
          By signing up, you agree to our{" "}
          <a href="#" className="text-neon-blue hover:underline">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-neon-blue hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}
