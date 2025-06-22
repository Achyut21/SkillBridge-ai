import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { 
  UserProgress, 
  SkillLevel,
  ApiResponse 
} from '@/lib/types'

// GET /api/learning/progress - Get user's learning progress
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const skillId = searchParams.get('skillId')
    const pathId = searchParams.get('pathId')

    // Build filter conditions
    const where: any = {
      user: {
        email: session.user.email
      }
    }

    if (skillId) {
      where.skillId = skillId
    }

    if (pathId) {
      where.skill = {
        learningPathSkills: {
          some: {
            learningPathId: pathId
          }
        }
      }
    }

    // Get user progress
    const progress = await prisma.userProgress.findMany({
      where,
      include: {
        skill: true,
        milestones: {
          orderBy: {
            achievedAt: 'desc'
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        lastActivity: 'desc'
      }
    })

    const response: ApiResponse<UserProgress[]> = {
      success: true,
      data: progress as UserProgress[]
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch progress',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST /api/learning/progress - Create or update progress
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      skillId, 
      currentLevel, 
      targetLevel, 
      progressPercentage, 
      hoursSpent,
      sessionDuration,
      milestoneAchieved 
    } = body

    // Validate required fields
    if (!skillId) {
      return NextResponse.json(
        { success: false, error: 'skillId is required' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify skill exists
    const skill = await prisma.skill.findUnique({
      where: { id: skillId }
    })

    if (!skill) {
      return NextResponse.json(
        { success: false, error: 'Skill not found' },
        { status: 404 }
      )
    }

    // Update or create progress
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_skillId: {
          userId: user.id,
          skillId
        }
      },
      update: {
        ...(currentLevel && { currentLevel }),
        ...(targetLevel && { targetLevel }),
        ...(progressPercentage !== undefined && { progressPercentage }),
        ...(hoursSpent !== undefined && { hoursSpent }),
        lastActivity: new Date()
      },
      create: {
        userId: user.id,
        skillId,
        currentLevel: currentLevel || SkillLevel.BEGINNER,
        targetLevel: targetLevel || SkillLevel.INTERMEDIATE,
        progressPercentage: progressPercentage || 0,
        hoursSpent: hoursSpent || 0,
        lastActivity: new Date()
      },
      include: {
        skill: true,
        milestones: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Add milestone if achieved
    if (milestoneAchieved) {
      await prisma.milestone.create({
        data: {
          title: milestoneAchieved.title,
          description: milestoneAchieved.description,
          points: milestoneAchieved.points || 10,
          badge: milestoneAchieved.badge,
          achievedAt: new Date(),
          userProgressId: progress.id
        }
      })
    }

    // Update learning analytics
    if (sessionDuration) {
      await updateLearningAnalytics(user.id, sessionDuration)
    }

    // Check for level progression and create milestone
    if (currentLevel && progress.currentLevel !== currentLevel) {
      await createLevelProgressionMilestone(progress.id, currentLevel)
    }

    const response: ApiResponse<UserProgress> = {
      success: true,
      data: progress as UserProgress,
      message: 'Progress updated successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update progress',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper function to update learning analytics
async function updateLearningAnalytics(userId: string, sessionDuration: number) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await prisma.learningAnalytics.upsert({
      where: { userId },
      update: {
        totalHoursLearned: { increment: sessionDuration / 60 },
        averageSessionDuration: sessionDuration,
        updatedAt: new Date()
      },
      create: {
        userId,
        totalHoursLearned: sessionDuration / 60,
        skillsAcquired: 0,
        currentStreak: 1,
        longestStreak: 1,
        completionRate: 0,
        averageSessionDuration: sessionDuration,
        topSkillCategories: []
      }
    })
  } catch (error) {
    console.error('Error updating learning analytics:', error)
  }
}

// Helper function to create level progression milestone
async function createLevelProgressionMilestone(progressId: string, newLevel: SkillLevel) {
  try {
    const levelPoints = {
      [SkillLevel.BEGINNER]: 10,
      [SkillLevel.INTERMEDIATE]: 25,
      [SkillLevel.ADVANCED]: 50,
      [SkillLevel.EXPERT]: 100
    }

    await prisma.milestone.create({
      data: {
        title: `${newLevel} Level Achieved`,
        description: `Congratulations on reaching ${newLevel} level!`,
        points: levelPoints[newLevel],
        achievedAt: new Date(),
        userProgressId: progressId
      }
    })
  } catch (error) {
    console.error('Error creating level progression milestone:', error)
  }
}