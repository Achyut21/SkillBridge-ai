"use client"

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${20 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <main className="relative z-10 container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-7xl font-bold mb-6 gradient-text animate-gradient">
            SkillBridge AI
          </h1>
          <p className="text-2xl text-gray-300 mb-4">
            Voice-Enabled Professional Development Platform
          </p>
          <p className="text-lg text-gray-400">
            🚀 Phase 1: Foundation Complete
          </p>
        </div>

        {/* Glassmorphism Cards Demo */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Card 1 - Basic Glass */}
          <div className="glass rounded-2xl p-8 hover-glow">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold mb-2">Neural Glassmorphism</h3>
            <p className="text-gray-400">
              Cutting-edge glass effects with backdrop blur and neural aesthetics
            </p>
          </div>

          {/* Card 2 - Neon Glow */}
          <div className="glass-heavy rounded-2xl p-8 neon-glow-blue hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink mb-4 animate-float" />
            <h3 className="text-xl font-semibold mb-2">Neon Glow Effects</h3>
            <p className="text-gray-400">
              Dynamic glow effects that respond to user interactions
            </p>
          </div>

          {/* Card 3 - Heavy Glass */}
          <div className="glass-heavy rounded-2xl p-8 neon-glow-purple hover-glow">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-pink to-neon-cyan mb-4 animate-glow" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Learning</h3>
            <p className="text-gray-400">
              Personalized learning paths with voice coaching
            </p>
          </div>
        </div>

        {/* Neural Network Lines */}
        <div className="mb-20">
          <div className="neural-line mb-4" />
          <div className="neural-line mb-4" style={{ animationDelay: '1s' }} />
          <div className="neural-line" style={{ animationDelay: '2s' }} />
        </div>

        {/* Tech Stack Verification */}
        <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 gradient-text">
            Tech Stack Verified ✅
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-neon-blue">Frontend</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Next.js 14.2.30 with App Router</li>
                <li>✓ TypeScript configured</li>
                <li>✓ Tailwind CSS with glassmorphism</li>
                <li>✓ Neural network animations</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-neon-purple">Backend Ready</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Prisma ORM configured</li>
                <li>✓ PostgreSQL schema defined</li>
                <li>✓ Environment variables set</li>
                <li>✓ Docker configuration ready</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive Button Demo */}
        <div className="mt-20 text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full font-semibold text-lg hover:scale-110 transition-all duration-300 animate-glow">
            Ready for Phase 2: Authentication & Core UI
          </button>
        </div>
      </main>
    </div>
  );
}
