"use client"

import { useEffect, useState } from "react"
import { GlassmorphismCard, NeonBorder } from "@/components/custom"
import { Check, X, AlertCircle } from "lucide-react"

interface ConfigStatus {
  google: { clientId: boolean; clientSecret: boolean }
  nextAuth: { secret: boolean; url: string }
  openai: { apiKey: boolean }
  elevenlabs: { apiKey: boolean; voiceId: string }
  database: { url: boolean }
  uclone: { serverUrl: string; apiKey: boolean }
  redis: { url: string }
}

export function ConfigCheck() {
  const [config, setConfig] = useState<ConfigStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/config-check")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data.configs)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="animate-pulse">Checking configuration...</div>

  if (!config) return <div>Failed to load configuration</div>

  const StatusIcon = ({ status }: { status: boolean | string }) => {
    if (typeof status === "boolean") {
      return status ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-5 h-5 text-red-500" />
      )
    }
    return status !== "Not set" ? (
      <Check className="w-5 h-5 text-green-500" />
    ) : (
      <AlertCircle className="w-5 h-5 text-yellow-500" />
    )
  }

  return (
    <GlassmorphismCard variant="medium" className="p-6">
      <h2 className="text-2xl font-bold mb-6 gradient-text">Configuration Status</h2>
      
      <div className="space-y-4">
        <NeonBorder color="gradient" rounded="lg">
          <div className="p-4">
            <h3 className="font-semibold mb-2 text-neon-blue">Google OAuth</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <StatusIcon status={config.google.clientId} />
                <span>Client ID</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={config.google.clientSecret} />
                <span>Client Secret</span>
              </div>
            </div>
          </div>
        </NeonBorder>

        <NeonBorder color="gradient" rounded="lg">
          <div className="p-4">
            <h3 className="font-semibold mb-2 text-neon-purple">Core Services</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <StatusIcon status={config.nextAuth.secret} />
                <span>NextAuth Secret</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={config.openai.apiKey} />
                <span>OpenAI API Key</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={config.elevenlabs.apiKey} />
                <span>ElevenLabs API Key</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={config.database.url} />
                <span>Database Connection</span>
              </div>
            </div>
          </div>
        </NeonBorder>

        <NeonBorder color="gradient" rounded="lg">
          <div className="p-4">
            <h3 className="font-semibold mb-2 text-neon-pink">Optional Services</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <StatusIcon status={config.uclone.apiKey} />
                <span>Uclone MCP Server</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={config.redis.url} />
                <span>Redis Cache</span>
              </div>
            </div>
          </div>
        </NeonBorder>
      </div>
    </GlassmorphismCard>
  )
}
