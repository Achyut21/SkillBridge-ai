"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { GlassmorphismCard, FloatingElement } from "@/components/custom"
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap, 
  Award,
  BookOpen,
  Mic
} from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-2xl gradient-text animate-pulse">Loading...</div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/auth/login")
    return null
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Welcome back, {session?.user?.name?.split(' ')[0] || "Learner"}! 🚀
        </h1>
        <p className="text-gray-400 text-lg">
          Ready to continue your AI-powered learning journey?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassmorphismCard variant="medium" glow="blue" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-neon-blue" />
            <span className="text-2xl font-bold">24h</span>
          </div>
          <h3 className="text-sm text-gray-400">Learning Streak</h3>
          <p className="text-lg font-semibold mt-1">5 days</p>
        </GlassmorphismCard>

        <GlassmorphismCard variant="medium" glow="purple" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Brain className="w-8 h-8 text-neon-purple" />
            <span className="text-2xl font-bold">12</span>
          </div>
          <h3 className="text-sm text-gray-400">Skills Mastered</h3>
          <p className="text-lg font-semibold mt-1">+3 this week</p>
        </GlassmorphismCard>

        <GlassmorphismCard variant="medium" glow="pink" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-neon-pink" />
            <span className="text-2xl font-bold">78%</span>
          </div>
          <h3 className="text-sm text-gray-400">Goal Progress</h3>
          <p className="text-lg font-semibold mt-1">On track!</p>
        </GlassmorphismCard>

        <GlassmorphismCard variant="medium" glow="cyan" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-neon-cyan" />
            <span className="text-2xl font-bold">15</span>
          </div>
          <h3 className="text-sm text-gray-400">Achievements</h3>
          <p className="text-lg font-semibold mt-1">2 new badges</p>
        </GlassmorphismCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Learning Path */}
        <div className="lg:col-span-2">
          <GlassmorphismCard variant="heavy" className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Current Learning Path</h2>
              <FloatingElement duration={3} distance={5}>
                <Zap className="w-6 h-6 text-yellow-500" />
              </FloatingElement>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Full-Stack AI Developer</h3>
                  <span className="text-sm text-neon-blue">65% Complete</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                  <div className="bg-gradient-to-r from-neon-blue to-neon-purple h-2 rounded-full" style={{ width: '65%' }} />
                </div>
                <p className="text-sm text-gray-400">
                  Next: Advanced Machine Learning with TensorFlow
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-neon-blue" />
                  <p className="text-sm font-medium">12 Courses</p>
                  <p className="text-xs text-gray-400">8 completed</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-neon-purple" />
                  <p className="text-sm font-medium">48 Hours</p>
                  <p className="text-xs text-gray-400">Est. remaining</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <Target className="w-8 h-8 mx-auto mb-2 text-neon-pink" />
                  <p className="text-sm font-medium">3 Projects</p>
                  <p className="text-xs text-gray-400">To complete</p>
                </div>
              </div>
            </div>
          </GlassmorphismCard>
        </div>

        {/* AI Coach & Market Insights */}
        <div className="space-y-6">
          {/* AI Voice Coach */}
          <GlassmorphismCard variant="heavy" glow="purple" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">AI Voice Coach</h3>
              <FloatingElement duration={4} distance={8}>
                <Mic className="w-6 h-6 text-neon-purple animate-pulse" />
              </FloatingElement>
            </div>
            <p className="text-gray-400 mb-4">
              Get personalized guidance and motivation
            </p>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink hover:scale-105 transition-all duration-300">
              Start Voice Session
            </button>
          </GlassmorphismCard>

          {/* Market Insights */}
          <GlassmorphismCard variant="heavy" glow="cyan" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Market Insights</h3>
              <TrendingUp className="w-6 h-6 text-neon-cyan" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">React Developer</span>
                <span className="text-sm text-green-500">+15%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Engineer</span>
                <span className="text-sm text-green-500">+28%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">DevOps</span>
                <span className="text-sm text-yellow-500">+8%</span>
              </div>
            </div>
            <button className="w-full mt-4 py-2 rounded-lg border border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all duration-300 text-sm">
              View Full Report
            </button>
          </GlassmorphismCard>
        </div>
      </div>
    </div>
  )
}
