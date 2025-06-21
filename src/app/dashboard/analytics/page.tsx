"use client"

import { GlassmorphismCard } from "@/components/custom"
import { BarChart3, TrendingUp, Clock, Target } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Analytics
        </h1>
        <p className="text-gray-400 text-lg">
          Track your learning progress and performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassmorphismCard variant="medium" glow="blue" className="p-6">
          <BarChart3 className="w-8 h-8 text-neon-blue mb-4" />
          <h3 className="text-2xl font-bold">85%</h3>
          <p className="text-gray-400">Completion Rate</p>
        </GlassmorphismCard>

        <GlassmorphismCard variant="medium" glow="purple" className="p-6">
          <Clock className="w-8 h-8 text-neon-purple mb-4" />
          <h3 className="text-2xl font-bold">142h</h3>
          <p className="text-gray-400">Total Learning Time</p>
        </GlassmorphismCard>

        <GlassmorphismCard variant="medium" glow="pink" className="p-6">
          <Target className="w-8 h-8 text-neon-pink mb-4" />
          <h3 className="text-2xl font-bold">23</h3>
          <p className="text-gray-400">Goals Achieved</p>
        </GlassmorphismCard>

        <GlassmorphismCard variant="medium" glow="cyan" className="p-6">
          <TrendingUp className="w-8 h-8 text-neon-cyan mb-4" />
          <h3 className="text-2xl font-bold">+15%</h3>
          <p className="text-gray-400">Weekly Growth</p>
        </GlassmorphismCard>
      </div>

      <GlassmorphismCard variant="heavy" className="p-8">
        <h2 className="text-2xl font-bold mb-6">Progress Overview</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          Analytics charts will be implemented in Phase 6
        </div>
      </GlassmorphismCard>
    </div>
  )
}
