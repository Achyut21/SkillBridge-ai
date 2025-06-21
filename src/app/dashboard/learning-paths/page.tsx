"use client"

import { GlassmorphismCard } from "@/components/custom"
import { BookOpen, Plus, TrendingUp } from "lucide-react"

export default function LearningPathsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Learning Paths
          </h1>
          <p className="text-gray-400 text-lg">
            Discover and create personalized learning journeys
          </p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full font-semibold hover:scale-105 transition-all duration-300 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Path
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <GlassmorphismCard key={i} variant="medium" glow="blue" className="p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
            <BookOpen className="w-8 h-8 text-neon-blue mb-4" />
            <h3 className="text-xl font-semibold mb-2">Learning Path {i}</h3>
            <p className="text-gray-400 text-sm mb-4">
              Comprehensive curriculum for mastering modern development
            </p>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">High Demand</span>
            </div>
          </GlassmorphismCard>
        ))}
      </div>
    </div>
  )
}
