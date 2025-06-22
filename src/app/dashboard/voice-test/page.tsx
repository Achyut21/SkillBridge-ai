"use client"

import { useState } from "react"
import { GlassmorphismCard } from "@/components/custom/glassmorphism-card"
import { GradientButton } from "@/components/custom/gradient-button"
import { toast } from "sonner"

export default function VoiceTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runHealthCheck = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-voice")
      const data = await response.json()
      setResults(data)
      
      if (data.checks?.services?.openai?.configured && data.checks?.services?.elevenlabs?.configured) {
        toast.success("All services configured correctly!")
      } else {
        toast.warning("Some services are not configured")
      }
    } catch (error) {
      toast.error("Health check failed")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const testVoiceGeneration = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: "voice" })
      })
      const data = await response.json()
      setResults(data)
      
      if (data.status === "success") {
        toast.success("Voice generation test passed!")
      } else {
        toast.error("Voice generation test failed")
      }
    } catch (error) {
      toast.error("Voice test failed")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const testChatWithVoice = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Hello, this is a test message",
          includeVoice: true
        })
      })
      const data = await response.json()
      setResults(data)
      
      if (data.message?.metadata?.audioUrl) {
        toast.success("Chat with voice working! Audio URL generated.")
        
        // Try to play the audio
        const audio = new Audio(data.message.metadata.audioUrl)
        audio.play().catch(e => console.error("Audio play failed:", e))
      } else {
        toast.error("No audio URL in response")
      }
    } catch (error) {
      toast.error("Chat test failed")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Voice Integration Test</h1>
      
      <div className="space-y-4">
        <GlassmorphismCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          
          <div className="flex flex-wrap gap-4">
            <GradientButton
              onClick={runHealthCheck}
              disabled={isLoading}
              variant="primary"
            >
              Run Health Check
            </GradientButton>
            
            <GradientButton
              onClick={testVoiceGeneration}
              disabled={isLoading}
              variant="secondary"
            >
              Test Voice Generation
            </GradientButton>
            
            <GradientButton
              onClick={testChatWithVoice}
              disabled={isLoading}
              variant="tertiary"
            >
              Test Chat with Voice
            </GradientButton>
          </div>
        </GlassmorphismCard>

        {results && (
          <GlassmorphismCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(results, null, 2)}
            </pre>
          </GlassmorphismCard>
        )}

        <GlassmorphismCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Make sure you&apos;re logged in (check the header)</li>
            <li>Run Health Check to verify API keys are configured</li>
            <li>Test Voice Generation to check ElevenLabs directly</li>
            <li>Test Chat with Voice to verify full integration</li>
            <li>Check browser console for detailed errors</li>
          </ol>
        </GlassmorphismCard>
      </div>
    </div>
  )
}
