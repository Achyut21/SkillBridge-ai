import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getOpenAIService } from "@/services/ai/openai"
import { getRecommendationEngine } from "@/services/ai/recommendation-engine"
import { prisma } from "@/lib/prisma"
import { ChatMessage, SessionContext, SkillLevel } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { message, sessionId, includeVoice = false } = body

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Get user context
    const user = await (prisma.user.findUnique as any)({
      where: { email: session.user.email },
      include: {
        profile: true,
        userSkills: {
          include: {
            skill: true
          }
        },
        learningPaths: {
          where: { isActive: true },
          take: 1
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Build session context
    const sessionContext: SessionContext = {
      currentSkills: user.userSkills.map((us: any) => ({
        ...us.skill,
        level: us.currentLevel as SkillLevel
      })),
      learningGoals: user.profile?.learningGoals || [],
      preferredLearningStyle: user.profile?.preferredLearningStyle as any,
      timeCommitment: user.profile?.weeklyTimeCommitment || 0,
      careerObjective: user.profile?.targetRole || undefined
    }

    // Get or create chat session
    const chatSession = sessionId ? 
      await (prisma.chatSession.findUnique as any)({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            take: 10 // Last 10 messages for context
          }
        }
      }) :
      await (prisma.chatSession.create as any)({
        data: {
          userId: user.id,
          context: sessionContext as any
        },
        include: {
          messages: true
        }
      })

    if (!chatSession) {
      return NextResponse.json(
        { error: "Chat session not found" },
        { status: 404 }
      )
    }

    // Save user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: "user",
        content: message
      }
    })

    // Prepare messages for OpenAI
    const messages: ChatMessage[] = [
      ...chatSession.messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        timestamp: msg.createdAt
      })),
      {
        id: userMessage.id,
        role: "user" as const,
        content: message,
        timestamp: userMessage.createdAt
      }
    ]

    // Generate AI response
    const openAI = getOpenAIService()
    const aiResponse = await openAI.generateCoachResponse(messages, sessionContext)

    // Check if we should generate suggestions
    const shouldGenerateSuggestions = message.toLowerCase().includes("help") ||
      message.toLowerCase().includes("suggest") ||
      message.toLowerCase().includes("recommend") ||
      message.toLowerCase().includes("what should") ||
      message.toLowerCase().includes("advice")

    let suggestions: string[] = []
    if (shouldGenerateSuggestions) {
      // Generate contextual follow-up suggestions
      suggestions = [
        "What skills should I focus on next?",
        "How long will it take to reach my goal?",
        "Show me job opportunities for my target role",
        "What's the market demand for my skills?"
      ]
    }

    // Save AI response
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: "assistant",
        content: aiResponse,
        metadata: suggestions.length > 0 ? { suggestions } : undefined
      }
    })

    // Generate voice if requested
    let audioUrl: string | undefined
    if (includeVoice) {
      try {
        const voiceResponse = await fetch(
          `${request.nextUrl.origin}/api/ai/voice`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: request.headers.get("cookie") || ""
            },
            body: JSON.stringify({
              text: aiResponse,
              voiceId: user.profile?.preferredVoiceId || "rachel"
            })
          }
        )

        if (voiceResponse.ok) {
          const voiceData = await voiceResponse.json()
          if (voiceData.success && voiceData.audio) {
            // Convert base64 to data URL
            audioUrl = `data:${voiceData.mimeType};base64,${voiceData.audio}`
          }
        }
      } catch (error) {
        console.error("Failed to generate voice:", error)
      }
    }

    // Check if we should update recommendations
    const recommendationEngine = getRecommendationEngine()
    let nextAction = null
    
    if (message.toLowerCase().includes("next") || 
        message.toLowerCase().includes("what should i do")) {
      nextAction = await recommendationEngine.getNextBestAction({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role as any,
          onboardingCompleted: user.onboardingCompleted,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        currentSkills: sessionContext.currentSkills || []
      })
    }

    return NextResponse.json({
      message: {
        id: assistantMessage.id,
        role: "assistant",
        content: aiResponse,
        timestamp: assistantMessage.createdAt,
        metadata: {
          suggestions,
          audioUrl,
          voiceId: user.profile?.preferredVoiceId || "rachel"
        }
      },
      sessionId: chatSession.id,
      nextAction
    })
  } catch (error) {
    console.error("Chat API error:", error)
    
    // Return a helpful error message if OpenAI is not configured
    if (error instanceof Error && error.message.includes("API key")) {
      return NextResponse.json({
        message: {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "I'm currently unavailable as the AI service is not configured. Please add OPENAI_API_KEY to environment variables to enable AI coaching.",
          timestamp: new Date(),
          metadata: {
            isError: true
          }
        },
        sessionId: null
      })
    }
    
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    )
  }
}

// Get chat history
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get("sessionId")
    const limit = parseInt(searchParams.get("limit") || "50")

    const user = await (prisma.user.findUnique as any)({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    if (sessionId) {
      // Get specific session
      const chatSession = await (prisma.chatSession.findFirst as any)({
        where: {
          id: sessionId,
          userId: user.id
        },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            take: limit
          }
        }
      })

      if (!chatSession) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        sessionId: chatSession.id,
        messages: chatSession.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.createdAt,
          metadata: msg.metadata
        })),
        context: chatSession.context
      })
    } else {
      // Get all sessions
      const sessions = await (prisma.chatSession.findMany as any)({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        take: 10,
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1
          }
        }
      })

      return NextResponse.json({
        sessions: sessions.map((session: any) => ({
          id: session.id,
          lastMessage: session.messages[0]?.content || "New conversation",
          lastActivity: session.updatedAt,
          messageCount: session.messages.length
        }))
      })
    }
  } catch (error) {
    console.error("Get chat history error:", error)
    return NextResponse.json(
      { error: "Failed to get chat history" },
      { status: 500 }
    )
  }
}
