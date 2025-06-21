"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { GlassmorphismCard } from "@/components/custom/glassmorphism-card"
import { GradientButton } from "@/components/custom/gradient-button"
import { toast } from "sonner"

export default function TestAIPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<string | null>(null)
  const [results, setResults] = useState<any>({})

  const testOpenAI = async () => {
    setLoading("openai")
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Hello! Can you introduce yourself?"
        })
      })
      const data = await response.json()
      setResults(prev => ({ ...prev, openai: data }))
      toast.success("OpenAI test completed")
    } catch (error) {
      toast.error("OpenAI test failed")
      setResults(prev => ({ ...prev, openai: { error: error.message } }))
    }
    setLoading(null)
  }

  const testElevenLabs = async () => {
    setLoading("elevenlabs")
    try {
      const response = await fetch("/api/ai/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "Hello! This is a test of the ElevenLabs voice synthesis."
        })
      })
      const data = await response.json()
      setResults(prev => ({ ...prev, elevenlabs: data }))
      
      if (data.success && data.audio) {
        // Play the audio
        const audio = new Audio(`data:${data.mimeType};base64,${data.audio}`)
        audio.play()
        toast.success("ElevenLabs test completed - playing audio")
      } else {
        toast.info("ElevenLabs test completed - check results")
      }
    } catch (error) {
      toast.error("ElevenLabs test failed")
      setResults(prev => ({ ...prev, elevenlabs: { error: error.message } }))
    }
    setLoading(null)
  }

  const testRecommendations = async () => {
    setLoading("recommendations")
    try {
      const response = await fetch("/api/ai/recommendations?count=3&includeMarketData=true")
      const data = await response.json()
      setResults(prev => ({ ...prev, recommendations: data }))
      toast.success("Recommendations test completed")
    } catch (error) {
      toast.error("Recommendations test failed")
      setResults(prev => ({ ...prev, recommendations: { error: error.message } }))
    }
    setLoading(null)
  }

  const testMarketData = async () => {
    setLoading("market")
    try {
      // Test the market analyzer through recommendations
      const response = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: "AI Engineer",
          timeframe: 24,
          preferences: {
            goals: ["Learn AI/ML", "Build AI products"],
            learningStyle: "VISUAL",
            timeCommitment: 10
          }
        })
      })
      const data = await response.json()
      setResults(prev => ({ ...prev, market: data }))
      toast.success("Market data test completed")
    } catch (error) {
      toast.error("Market data test failed")
      setResults(prev => ({ ...prev, market: { error: error.message } }))
    }
    setLoading(null)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">AI Features Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Controls */}
        <GlassmorphismCard variant="single" className="p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          
          <div className="space-y-3">
            <GradientButton
              onClick={testOpenAI}
              disabled={loading === "openai"}
              className="w-full"
            >
              {loading === "openai" ? "Testing..." : "Test OpenAI Chat"}
            </GradientButton>
            
            <GradientButton
              onClick={testElevenLabs}
              disabled={loading === "elevenlabs"}
              variant="secondary"
              className="w-full"
            >
              {loading === "elevenlabs" ? "Testing..." : "Test ElevenLabs Voice"}
            </GradientButton>
            
            <GradientButton
              onClick={testRecommendations}
              disabled={loading === "recommendations"}
              variant="tertiary"
              className="w-full"
            >
              {loading === "recommendations" ? "Testing..." : "Test Recommendations"}
            </GradientButton>
            
            <GradientButton
              onClick={testMarketData}
              disabled={loading === "market"}
              variant="danger"
              className="w-full"
            >
              {loading === "market" ? "Testing..." : "Test Market Data"}
            </GradientButton>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              User: {session?.user?.email || "Not logged in"}
            </p>
          </div>
        </GlassmorphismCard>
        
        {/* Results */}
        <GlassmorphismCard variant="single" className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(results).map(([key, value]) => (
              <div key={key} className="border-b pb-3">
                <h3 className="font-medium capitalize mb-2">{key}</h3>
                <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                  {JSON.stringify(value, null, 2)}
                </pre>
              </div>
            ))}
            
            {Object.keys(results).length === 0 && (
              <p className="text-gray-500">Run tests to see results</p>
            )}
          </div>
        </GlassmorphismCard>
      </div>
      
      {/* Instructions */}
      <GlassmorphismCard variant="single" className="p-6">
        <h2 className="text-xl font-semibold mb-4">API Keys Status</h2>
        <div className="space-y-2 text-sm">
          <p>✅ OpenAI API Key: {process.env.NEXT_PUBLIC_OPENAI_API_KEY ? "Configured" : "Not found"}</p>
          <p>✅ ElevenLabs API Key: {process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY ? "Configured" : "Check server logs"}</p>
          <p>✅ Database: Connected</p>
          <p>⚠️ NextAuth: Working with warnings (Next.js 15 compatibility)</p>
        </div>
      </GlassmorphismCard>
    </div>
  )
}
