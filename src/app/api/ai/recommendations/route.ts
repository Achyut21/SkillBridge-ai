import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getRecommendationEngine } from "@/services/ai/recommendation-engine"
import { prisma } from "@/lib/prisma"
import { SkillLevel } from "@/lib/types"

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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const count = parseInt(searchParams.get("count") || "5")
    const includeMarketData = searchParams.get("includeMarketData") === "true"

    // Fetch user data with their skills
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        userSkills: {
          include: {
            skill: true
          }
        },
        profile: true,
        learningPaths: {
          where: { isActive: true },
          include: {
            skills: {
              include: {
                skill: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Prepare context for recommendation engine
    const currentSkills = user.userSkills.map(us => ({
      ...us.skill,
      level: us.currentLevel as SkillLevel
    }))

    const targetRole = user.profile?.targetRole || undefined

    // Get recommendations
    const recommendationEngine = getRecommendationEngine()
    const recommendations = await recommendationEngine.generateSkillRecommendations(
      {
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
        currentSkills,
        targetRole
      },
      {
        count,
        includeMarketData
      }
    )

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    )
  }
}

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
    const { targetRole, timeframe, preferences } = body

    // Update user profile with new preferences
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Update or create profile
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        targetRole,
        learningGoals: preferences?.goals || [],
        preferredLearningStyle: preferences?.learningStyle,
        weeklyTimeCommitment: preferences?.timeCommitment
      },
      create: {
        userId: user.id,
        targetRole,
        learningGoals: preferences?.goals || [],
        preferredLearningStyle: preferences?.learningStyle,
        weeklyTimeCommitment: preferences?.timeCommitment
      }
    })

    // Generate new recommendations based on updated preferences
    const recommendationEngine = getRecommendationEngine()
    const recommendations = await recommendationEngine.generateSkillRecommendations(
      {
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
        currentSkills: [],
        targetRole
      },
      {
        count: 10,
        includeMarketData: true,
        timeframe
      }
    )

    return NextResponse.json({
      success: true,
      recommendations
    })
  } catch (error) {
    console.error("Error updating recommendations:", error)
    return NextResponse.json(
      { error: "Failed to update recommendations" },
      { status: 500 }
    )
  }
}
