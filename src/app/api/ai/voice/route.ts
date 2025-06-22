import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getElevenLabsService, VOICE_IDS } from "@/services/ai/elevenlabs"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { text, voiceId, voiceSettings } = body

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      )
    }

    // Use default voice if not specified or if the provided voice ID is invalid
    const selectedVoiceId = voiceId && Object.values(VOICE_IDS).includes(voiceId) 
      ? voiceId 
      : VOICE_IDS.rachel

    try {
    // console.log(`Generating voice with ElevenLabs - Voice ID: ${selectedVoiceId}, Text length: ${text.length}`)
      
      const elevenLabs = getElevenLabsService()
      const audioBuffer = await elevenLabs.textToSpeech({
        text,
        voiceId: selectedVoiceId,
        voiceSettings
      })

    // console.log(`Voice generated successfully - Buffer size: ${audioBuffer.byteLength} bytes`)

      // Return audio as base64
      const base64Audio = Buffer.from(audioBuffer).toString("base64")
      
      return NextResponse.json({
        success: true,
        audio: base64Audio,
        mimeType: "audio/mpeg",
        voiceId: selectedVoiceId
      })
    } catch (error) {
      // If ElevenLabs fails, return a detailed error message
      console.error("ElevenLabs error:", error)
      
      let errorMessage = "Text-to-speech service error"
      let statusCode = 500
      
      if (error instanceof Error) {
        if (error.message.includes("401") || error.message.includes("Unauthorized")) {
          errorMessage = "Invalid ElevenLabs API key. Please check your ELEVENLABS_API_KEY in .env.local"
          statusCode = 401
        } else if (error.message.includes("quota") || error.message.includes("limit")) {
          errorMessage = "ElevenLabs API quota exceeded. Please check your plan limits."
          statusCode = 429
        } else if (error.message.includes("voice")) {
          errorMessage = `Invalid voice ID. Please use one of: ${Object.keys(VOICE_IDS).join(", ")}`
          statusCode = 400
        } else {
          errorMessage = error.message
        }
      }
      
      return NextResponse.json({
        success: false,
        error: errorMessage,
        fallbackText: text,
        availableVoices: Object.keys(VOICE_IDS)
      }, { status: statusCode })
    }
  } catch (error) {
    console.error("Voice API error:", error)
    return NextResponse.json(
      { error: "Failed to generate voice" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Return available voices
    const voices = Object.entries(VOICE_IDS).map(([key, id]) => ({
      id,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      description: getVoiceDescription(key)
    }))

    return NextResponse.json({
      voices,
      defaultVoice: VOICE_IDS.rachel
    })
  } catch (error) {
    console.error("Voice list error:", error)
    return NextResponse.json(
      { error: "Failed to get voice list" },
      { status: 500 }
    )
  }
}

function getVoiceDescription(voiceKey: string): string {
  const descriptions: Record<string, string> = {
    rachel: "Calm and professional female voice",
    domi: "Energetic and enthusiastic female voice",
    bella: "Soft and gentle female voice",
    josh: "Conversational and friendly male voice",
    arnold: "Strong and confident male voice",
    adam: "Deep and authoritative male voice",
    antoni: "Well-rounded and versatile male voice",
    elli: "Young and vibrant female voice",
    sam: "Raspy and distinctive male voice"
  }
  
  return descriptions[voiceKey] || "AI voice"
}
