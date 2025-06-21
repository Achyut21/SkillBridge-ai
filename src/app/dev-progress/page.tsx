"use client"

import { GlassmorphismCard, NeonBorder } from "@/components/custom"
import { Check, Clock, AlertCircle } from "lucide-react"

const phases = [
  {
    number: 1,
    title: "Foundation & Setup",
    status: "complete",
    items: [
      "Next.js 14+ with TypeScript",
      "Neural glassmorphism theme",
      "Prisma database schema",
      "Docker configuration"
    ]
  },
  {
    number: 2,
    title: "Authentication & Core UI",
    status: "complete",
    items: [
      "Google OAuth integration",
      "5 glassmorphism components",
      "Auth pages with animations",
      "Protected routes"
    ]
  },
  {
    number: 3,
    title: "Dashboard & Voice",
    status: "complete",
    items: [
      "Dashboard layout system",
      "Voice player & avatar",
      "5 dashboard pages",
      "ElevenLabs integration ready"
    ]
  },
  {
    number: 4,
    title: "AI & Market Data",
    status: "pending",
    items: [
      "OpenAI integration",
      "Market data analysis",
      "AI recommendations",
      "Chat interface"
    ]
  },
  {
    number: 5,
    title: "Learning Paths",
    status: "pending",
    items: [
      "Skill assessment",
      "Path builder",
      "Progress tracking",
      "Milestone celebrations"
    ]
  },
  {
    number: 6,
    title: "Analytics",
    status: "pending",
    items: [
      "Progress charts",
      "Market insights",
      "Performance metrics",
      "Real-time updates"
    ]
  },
  {
    number: 7,
    title: "Polish",
    status: "pending",
    items: [
      "PWA capabilities",
      "Advanced animations",
      "Performance optimization",
      "Accessibility"
    ]
  },
  {
    number: 8,
    title: "Deployment",
    status: "pending",
    items: [
      "Production deployment",
      "Demo preparation",
      "Documentation",
      "Testing"
    ]
  }
]

export default function DevProgressPage() {
  const completedPhases = phases.filter(p => p.status === "complete").length
  const totalPhases = phases.length
  const progressPercentage = (completedPhases / totalPhases) * 100

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold gradient-text mb-8 text-center">
          SkillBridge AI Development Progress
        </h1>

        {/* Overall Progress */}
        <GlassmorphismCard variant="heavy" glow="blue" className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Overall Progress</h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Phases Completed</span>
              <span>{completedPhases} / {totalPhases}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-neon-blue to-neon-purple h-4 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-neon-blue">30+</p>
              <p className="text-sm text-gray-400">Files Created</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-neon-purple">17</p>
              <p className="text-sm text-gray-400">Components</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-neon-pink">3000+</p>
              <p className="text-sm text-gray-400">Lines of Code</p>
            </div>
          </div>
        </GlassmorphismCard>

        {/* Phase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {phases.map((phase) => (
            <GlassmorphismCard
              key={phase.number}
              variant="medium"
              glow={phase.status === "complete" ? "cyan" : "none"}
              className="p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Phase {phase.number}</h3>
                {phase.status === "complete" ? (
                  <Check className="w-6 h-6 text-green-500" />
                ) : phase.status === "in-progress" ? (
                  <Clock className="w-6 h-6 text-yellow-500 animate-pulse" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <h4 className="font-semibold mb-3">{phase.title}</h4>
              <ul className="space-y-2">
                {phase.items.map((item, index) => (
                  <li key={index} className="text-sm text-gray-400 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </GlassmorphismCard>
          ))}
        </div>

        {/* Technical Stack */}
        <GlassmorphismCard variant="heavy" className="p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Technical Implementation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NeonBorder color="gradient" rounded="lg">
              <div className="p-4">
                <h3 className="font-semibold mb-3 text-neon-blue">Frontend</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Next.js 14.2.30</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• Framer Motion</li>
                </ul>
              </div>
            </NeonBorder>
            <NeonBorder color="gradient" rounded="lg">
              <div className="p-4">
                <h3 className="font-semibold mb-3 text-neon-purple">Backend</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Prisma ORM</li>
                  <li>• PostgreSQL</li>
                  <li>• NextAuth.js</li>
                  <li>• API Routes</li>
                </ul>
              </div>
            </NeonBorder>
            <NeonBorder color="gradient" rounded="lg">
              <div className="p-4">
                <h3 className="font-semibold mb-3 text-neon-pink">Integrations</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Google OAuth ✓</li>
                  <li>• ElevenLabs (Ready)</li>
                  <li>• OpenAI (Pending)</li>
                  <li>• Uclone MCP (Pending)</li>
                </ul>
              </div>
            </NeonBorder>
          </div>
        </GlassmorphismCard>

        {/* Next Steps */}
        <GlassmorphismCard variant="medium" glow="purple" className="p-8 mt-8">
          <h2 className="text-2xl font-bold mb-4">Next Steps: Phase 4</h2>
          <p className="text-gray-400 mb-4">
            Ready to implement AI integration and market data features:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-blue rounded-full" />
              <span>Set up OpenAI service for GPT-4 integration</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-purple rounded-full" />
              <span>Build AI recommendation engine</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-pink rounded-full" />
              <span>Implement market data analysis</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-cyan rounded-full" />
              <span>Create chat interface with streaming responses</span>
            </li>
          </ul>
        </GlassmorphismCard>
      </div>
    </div>
  )
}
