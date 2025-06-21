import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Simple health check for voice integration
    const checks = {
      timestamp: new Date().toISOString(),
      environment: {
        openaiKey: !!process.env.OPENAI_API_KEY,
        elevenLabsKey: !!process.env.ELEVENLABS_API_KEY,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        nodeEnv: process.env.NODE_ENV
      },
      services: {
        openai: {
          configured: !!process.env.OPENAI_API_KEY,
          keyPrefix: process.env.OPENAI_API_KEY?.substring(0, 7) + "..."
        },
        elevenlabs: {
          configured: !!process.env.ELEVENLABS_API_KEY,
          keyPrefix: process.env.ELEVENLABS_API_KEY?.substring(0, 7) + "..."
        }
      }
    }

    return NextResponse.json({
      status: "ok",
      message: "Voice integration health check",
      checks
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Health check failed",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { test } = await request.json()
    
    if (test === "voice") {
      // Test voice generation without auth
      const voiceResponse = await fetch(
        `${request.nextUrl.origin}/api/ai/voice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: request.headers.get("cookie") || ""
          },
          body: JSON.stringify({
            text: "This is a test of the voice synthesis system.",
            voiceId: "rachel"
          })
        }
      )

      const voiceData = await voiceResponse.json()
      
      return NextResponse.json({
        status: voiceResponse.ok ? "success" : "failed",
        voiceEndpoint: {
          status: voiceResponse.status,
          data: voiceData
        }
      })
    }

    return NextResponse.json({
      message: "Test endpoint ready",
      availableTests: ["voice"]
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Test failed",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
