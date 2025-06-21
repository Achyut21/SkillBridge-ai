import { NextResponse } from "next/server"

export async function GET() {
  const configs = {
    google: {
      clientId: !!process.env.GOOGLE_CLIENT_ID,
      clientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    },
    nextAuth: {
      secret: !!process.env.NEXTAUTH_SECRET,
      url: process.env.NEXTAUTH_URL || "Not set",
    },
    openai: {
      apiKey: !!process.env.OPENAI_API_KEY,
    },
    elevenlabs: {
      apiKey: !!process.env.ELEVENLABS_API_KEY,
      voiceId: process.env.ELEVENLABS_VOICE_ID || "Not set",
    },
    database: {
      url: !!process.env.DATABASE_URL,
    },
    uclone: {
      serverUrl: process.env.UCLONE_MCP_SERVER_URL || "Not set",
      apiKey: !!process.env.UCLONE_MCP_API_KEY,
    },
    redis: {
      url: process.env.REDIS_URL || "Not set",
    },
  }

  return NextResponse.json({
    status: "Configuration Check",
    configs,
    note: "Values shown as boolean for security. Check console for details.",
  })
}
