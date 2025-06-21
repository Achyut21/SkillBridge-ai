"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { 
  GlassmorphismCard, 
  GradientButton, 
  NeonBorder,
  AnimatedBackground,
  FloatingElement 
} from "@/components/custom"
import { FcGoogle } from "react-icons/fc"
import { Mail, Lock, Sparkles } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground particleCount={40} interactive />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <FloatingElement duration={4} distance={10}>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple p-[2px]">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-neon-blue" />
              </div>
            </div>
          </FloatingElement>
          
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400">
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Login Form */}
        <GlassmorphismCard variant="heavy" glow="blue" className="p-8">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Email Input */}
            <NeonBorder color="gradient" rounded="lg">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-0 outline-none focus:ring-0 text-white placeholder:text-gray-500"
                  disabled={isLoading}
                />
              </div>
            </NeonBorder>

            {/* Sign In Button */}
            <GradientButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </GradientButton>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <GradientButton
            onClick={handleGoogleSignIn}
            variant="secondary"
            size="lg"
            className="w-full flex items-center justify-center gap-3"
            disabled={isLoading}
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </GradientButton>

          {/* Sign Up Link */}
          <p className="text-center mt-6 text-gray-400">
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/auth/register")}
              className="text-neon-blue hover:text-neon-purple transition-colors"
              disabled={isLoading}
            >
              Sign up
            </button>
          </p>
        </GlassmorphismCard>
      </div>
    </div>
  )
}
