"use client"

import { useState, useEffect } from "react"
import { GlassmorphismCard, GradientButton } from "@/components/custom"
import { VoicePlayer } from "@/components/voice/voice-player"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Volume2, Loader2, AlertCircle, CheckCircle, Info, Play } from "lucide-react"
import { testVoiceGeneration, checkAudioSupport, createAudioFromBase64 } from "@/lib/voice-diagnostic"

export default function VoiceDiagnosticPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [testAudio, setTestAudio] = useState<HTMLAudioElement | null>(null)
  const [diagnosticResults, setDiagnosticResults] = useState<{
    apiKey: boolean | null
    voiceGeneration: boolean | null
    audioPlayback: boolean | null
    browserSupport: boolean | null
    error?: string
    details?: any
  }>({
    apiKey: null,
    voiceGeneration: null,
    audioPlayback: null,
    browserSupport: null
  })

  // Check browser support on mount
  useEffect(() => {
    const formats = checkAudioSupport()
    setDiagnosticResults(prev => ({
      ...prev,
      browserSupport: formats.mp3 !== '',
      details: { audioFormats: formats }
    }))
  }, [])

  const runDiagnostics = async () => {
    if (!session) {
      toast.error("Please sign in to run diagnostics")
      return
    }

    setIsLoading(true)
    setAudioUrl(null)
    setTestAudio(null)
    const results = { ...diagnosticResults }

    try {
      // Test 1: Check if voice API is accessible
      const voiceListResponse = await fetch("/api/ai/voice")
      results.apiKey = voiceListResponse.ok

      if (!voiceListResponse.ok) {
        const errorData = await voiceListResponse.json()
        throw new Error(errorData.error || "Voice API is not accessible")
      }

      // Test 2: Generate test audio with detailed logging
      const testText = "Hello! This is a voice diagnostic test. If you can hear this message, the voice integration is working correctly."
      
    // console.log("Generating voice with ElevenLabs...")
      const voiceResponse = await fetch("/api/ai/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: testText,
          voiceId: "rachel" // Using a known voice ID
        })
      })

      const voiceData = await voiceResponse.json()
    // console.log("Voice API response:", voiceData)
      
      if (!voiceResponse.ok || !voiceData.success) {
        results.voiceGeneration = false
        throw new Error(voiceData.error || "Failed to generate voice")
      }

      results.voiceGeneration = true

      // Test 3: Create audio using enhanced method
      if (voiceData.audio) {
    // console.log("Creating audio from base64...")
        const audio = createAudioFromBase64(voiceData.audio, voiceData.mimeType)
        
        // Wait for audio to load
        await new Promise((resolve, reject) => {
          audio.onloadeddata = () => {
    // console.log("Audio loaded successfully, duration:", audio.duration)
            resolve(true)
          }
          audio.onerror = (e) => {
            console.error("Audio load error:", e)
            reject(e)
          }
          // Timeout after 5 seconds
          setTimeout(() => reject(new Error("Audio load timeout")), 5000)
        })

        // Create data URL for VoicePlayer component
        const dataUrl = `data:${voiceData.mimeType};base64,${voiceData.audio}`
        setAudioUrl(dataUrl)
        setTestAudio(audio)
        results.audioPlayback = true
        results.details = {
          ...results.details,
          audioDataSize: voiceData.audio.length,
          mimeType: voiceData.mimeType
        }
      } else {
        results.audioPlayback = false
        throw new Error("No audio data received")
      }

      toast.success("Diagnostic complete! Check the results below.")
    } catch (error) {
      results.error = error instanceof Error ? error.message : "Unknown error"
      console.error("Diagnostic error:", error)
      toast.error(`Diagnostic failed: ${results.error}`)
    } finally {
      setDiagnosticResults(results)
      setIsLoading(false)
    }
  }

  const manualPlayTest = async () => {
    if (!testAudio) {
      toast.error("No test audio available. Run diagnostics first.")
      return
    }

    try {
      await testAudio.play()
      toast.success("Audio playing! Check your speakers.")
    } catch (error) {
      console.error("Manual play error:", error)
      toast.error("Failed to play audio. Check browser console for details.")
    }
  }

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <AlertCircle className="w-5 h-5 text-gray-400" />
    if (status) return <CheckCircle className="w-5 h-5 text-green-500" />
    return <AlertCircle className="w-5 h-5 text-red-500" />
  }

  const getStatusText = (status: boolean | null) => {
    if (status === null) return "Not tested"
    if (status) return "Working"
    return "Failed"
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Voice Integration Diagnostic
      </h1>

      <div className="space-y-6">
        {/* Diagnostic Controls */}
        <GlassmorphismCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Run Voice Tests</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This will test your ElevenLabs integration and voice playback functionality.
          </p>
          
          <div className="flex gap-4">
            <GradientButton
              onClick={runDiagnostics}
              disabled={isLoading || !session}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Run Voice Diagnostic
                </>
              )}
            </GradientButton>

            {testAudio && (
              <GradientButton
                onClick={manualPlayTest}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <Play className="w-4 h-4 mr-2" />
                Manual Play Test
              </GradientButton>
            )}
          </div>
        </GlassmorphismCard>

        {/* Test Results */}
        <GlassmorphismCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          
          <div className="space-y-4">
            {/* Browser Support */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                {getStatusIcon(diagnosticResults.browserSupport)}
                <div>
                  <p className="font-medium">Browser Audio Support</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Checking MP3 playback capability
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium">
                {getStatusText(diagnosticResults.browserSupport)}
              </span>
            </div>

            {/* API Key Test */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                {getStatusIcon(diagnosticResults.apiKey)}
                <div>
                  <p className="font-medium">Voice API Access</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Checking if ElevenLabs API is configured
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium">
                {getStatusText(diagnosticResults.apiKey)}
              </span>
            </div>

            {/* Voice Generation Test */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                {getStatusIcon(diagnosticResults.voiceGeneration)}
                <div>
                  <p className="font-medium">Voice Generation</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Testing text-to-speech conversion
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium">
                {getStatusText(diagnosticResults.voiceGeneration)}
              </span>
            </div>

            {/* Audio Playback Test */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                {getStatusIcon(diagnosticResults.audioPlayback)}
                <div>
                  <p className="font-medium">Audio Playback</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Testing browser audio playback
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium">
                {getStatusText(diagnosticResults.audioPlayback)}
              </span>
            </div>

            {/* Error Message */}
            {diagnosticResults.error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>Error:</strong> {diagnosticResults.error}
                </p>
              </div>
            )}

            {/* Technical Details */}
            {diagnosticResults.details && (
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Technical Details:
                </p>
                <pre className="text-xs text-blue-700 dark:text-blue-300 overflow-auto">
                  {JSON.stringify(diagnosticResults.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </GlassmorphismCard>

        {/* Audio Player */}
        {audioUrl && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Audio Player</h3>
            <VoicePlayer 
              audioUrl={audioUrl}
              onEnded={() => toast.info("Audio playback completed")}
            />
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <Info className="inline w-4 h-4 mr-1" />
                If audio doesn't auto-play, click the play button above or use "Manual Play Test"
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <GlassmorphismCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting Guide</h2>
          
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>If tests are failing, check the following:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ensure you're logged in with Google OAuth</li>
              <li>Verify ELEVENLABS_API_KEY is set in .env.local</li>
              <li>Check browser console (F12) for detailed error messages</li>
              <li>Ensure your browser allows audio playback (check site settings)</li>
              <li>Try Chrome or Edge browsers for best compatibility</li>
              <li>Make sure your system volume is not muted</li>
              <li>Try clicking anywhere on the page before running tests (autoplay policy)</li>
            </ul>
            
            <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Browser Autoplay Policy:</strong> Modern browsers prevent autoplay of audio without user interaction. 
                If voice doesn't play automatically in the Voice Coach, try:
              </p>
              <ol className="list-decimal list-inside mt-2 ml-4">
                <li>Click anywhere on the page first</li>
                <li>Use the manual play button</li>
                <li>Check browser site settings for audio permissions</li>
              </ol>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <p className="text-green-800 dark:text-green-200">
                <strong>Console Commands:</strong> Open browser console (F12) and run:
              </p>
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
{`// Test voice generation
import { testVoiceGeneration } from '@/lib/voice-diagnostic'
await testVoiceGeneration("Test message")

// Check audio support
import { checkAudioSupport } from '@/lib/voice-diagnostic'
checkAudioSupport()`}
              </pre>
            </div>
          </div>
        </GlassmorphismCard>
      </div>
    </div>
  )
}
