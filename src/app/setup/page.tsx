"use client"

import { useState } from "react"
import { ConfigCheck } from "@/components/config-check"
import { 
  GlassmorphismCard, 
  GradientButton, 
  NeonBorder,
  AnimatedBackground 
} from "@/components/custom"
import { Copy, ExternalLink, CheckCircle } from "lucide-react"

export default function SetupPage() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(item)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  const redirectUris = [
    "http://localhost:3000/api/auth/callback/google",
    "http://localhost:3001/api/auth/callback/google",
    "http://localhost:3002/api/auth/callback/google",
  ]

  return (
    <div className="min-h-screen bg-background p-8">
      <AnimatedBackground />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-5xl font-bold gradient-text mb-8 text-center">
          SkillBridge AI Setup Guide
        </h1>

        {/* Configuration Status */}
        <div className="mb-12">
          <ConfigCheck />
        </div>

        {/* Setup Instructions */}
        <div className="space-y-8">
          {/* Quick Start */}
          <GlassmorphismCard variant="heavy" glow="blue" className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-neon-blue">🚀 Quick Start</h2>
            <div className="space-y-4">
              <p className="text-gray-300">Run this command to generate your NextAuth secret:</p>
              <NeonBorder color="gradient" rounded="lg">
                <div className="p-4 flex items-center justify-between">
                  <code className="text-sm">./scripts/quick-setup.sh</code>
                  <GradientButton
                    variant="accent"
                    size="sm"
                    onClick={() => copyToClipboard("./scripts/quick-setup.sh", "quickstart")}
                  >
                    {copiedItem === "quickstart" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </GradientButton>
                </div>
              </NeonBorder>
            </div>
          </GlassmorphismCard>

          {/* Google OAuth Setup */}
          <GlassmorphismCard variant="heavy" glow="purple" className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-neon-purple">1️⃣ Google OAuth Setup</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span>Visit Google Cloud Console</span>
                <a 
                  href="https://console.cloud.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neon-blue hover:text-neon-purple transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              <div>
                <p className="mb-2 text-gray-300">Add these redirect URIs:</p>
                <div className="space-y-2">
                  {redirectUris.map((uri, index) => (
                    <NeonBorder key={index} color="gradient" rounded="md">
                      <div className="p-3 flex items-center justify-between">
                        <code className="text-xs">{uri}</code>
                        <GradientButton
                          variant="accent"
                          size="sm"
                          onClick={() => copyToClipboard(uri, `uri-${index}`)}
                        >
                          {copiedItem === `uri-${index}` ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </GradientButton>
                      </div>
                    </NeonBorder>
                  ))}
                </div>
              </div>
            </div>
          </GlassmorphismCard>

          {/* API Keys */}
          <GlassmorphismCard variant="heavy" glow="pink" className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-neon-pink">2️⃣ API Keys</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  OpenAI API Key
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neon-blue hover:text-neon-purple transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </h3>
                <p className="text-gray-400 text-sm">Get your API key from OpenAI Platform</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  ElevenLabs API Key
                  <a 
                    href="https://elevenlabs.io/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neon-blue hover:text-neon-purple transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </h3>
                <p className="text-gray-400 text-sm">Sign up and get your API key from Profile settings</p>
                <p className="text-gray-500 text-xs mt-1">Popular Voice ID: Rachel (21m00Tcm4TlvDq8ikWAM)</p>
              </div>
            </div>
          </GlassmorphismCard>

          {/* Database Setup */}
          <GlassmorphismCard variant="heavy" glow="cyan" className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-neon-cyan">3️⃣ Database Setup</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Option A: Local PostgreSQL</h3>
                <NeonBorder color="gradient" rounded="lg">
                  <div className="p-4 space-y-2">
                    <code className="text-sm block">docker-compose up -d postgres</code>
                    <p className="text-xs text-gray-400">
                      Connection string: postgresql://skillbridge:skillbridge_dev_password@localhost:5432/skillbridge_ai
                    </p>
                  </div>
                </NeonBorder>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Option B: Cloud Databases</h3>
                <div className="grid grid-cols-3 gap-2">
                  <a 
                    href="https://vercel.com/storage/postgres" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-center p-2 border border-white/20 rounded-lg hover:border-neon-blue transition-colors"
                  >
                    Vercel
                  </a>
                  <a 
                    href="https://supabase.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-center p-2 border border-white/20 rounded-lg hover:border-neon-purple transition-colors"
                  >
                    Supabase
                  </a>
                  <a 
                    href="https://neon.tech/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-center p-2 border border-white/20 rounded-lg hover:border-neon-pink transition-colors"
                  >
                    Neon
                  </a>
                </div>
              </div>
            </div>
          </GlassmorphismCard>

          {/* Final Steps */}
          <GlassmorphismCard variant="heavy" glow="blue" className="p-8">
            <h2 className="text-2xl font-bold mb-4 gradient-text">4️⃣ Final Steps</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center text-sm">1</div>
                <span>Add all keys to your <code className="text-neon-blue">.env.local</code> file</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center text-sm">2</div>
                <span>Run <code className="text-neon-purple">npm run db:push</code> to setup database</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-pink/20 flex items-center justify-center text-sm">3</div>
                <span>Run <code className="text-neon-pink">npm run dev</code> to start development</span>
              </div>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <GradientButton
            variant="primary"
            size="lg"
            onClick={() => window.location.href = "/"}
          >
            Back to Home
          </GradientButton>
        </div>
      </div>
    </div>
  )
}
