import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { 
  Milestone,
  ApiResponse,
  PaginatedResponse 
} from '@/lib/types'

// GET /api/learning/milestones - Get user's milestones
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
    const achieved = searchParams.get('achieved')
    const skillId = searchParams.get('skillId')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')

    // Build filter conditions
    const where: any = {
      userProgress: {
        user: {
          email: session.user.email
        }
      }
    }

    if (achieved === 'true') {
      where.achievedAt = { not: null }
    } else if (achieved === 'false') {
      where.achievedAt = null
    }

    if (skillId) {
      where.userProgress = {
        ...where.userProgress,
        skillId
      }
    }

    // Get total count
    const total = await prisma.milestone.count({ where })

    // Get milestones with pagination
    const milestones = await prisma.milestone.findMany({
      where,
      include: {
        userProgress: {
          include: {
            skill: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: [
        { achievedAt: { sort: 'desc', nulls: 'last' } },
        { createdAt: 'desc' }
      ],
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    const response: PaginatedResponse<Milestone> = {
      items: milestones as Milestone[],
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total
    }

    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error('Error fetching milestones:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch milestones',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST /api/learning/milestones - Create milestone
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
      title, 
      description, 
      points = 10,
      badge,
      skillId,
      autoAchieve = false 
    } = body

    // Validate required fields
    if (!title || !description || !skillId) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and skillId are required' },
        { status: 400 }
      )
    }

    // Get user progress for the skill
    const userProgress = await prisma.userProgress.findFirst({
      where: {
        skillId,
        user: {
          email: session.user.email
        }
      },
      include: {
        user: true,
        skill: true
      }
    })

    if (!userProgress) {
      return NextResponse.json(
        { success: false, error: 'User progress not found for this skill' },
        { status: 404 }
      )
    }

    // Create milestone
    const milestone = await prisma.milestone.create({
      data: {
        title,
        description,
        points: Math.max(1, Math.min(1000, points)), // Clamp between 1-1000
        badge,
        achievedAt: autoAchieve ? new Date() : null,
        userProgressId: userProgress.id
      },
      include: {
        userProgress: {
          include: {
            skill: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    // If auto-achieved, update user's total points
    if (autoAchieve) {
      await updateUserPoints(userProgress.userId, points)
    }

    const response: ApiResponse<Milestone> = {
      success: true,
      data: milestone as Milestone,
      message: 'Milestone created successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating milestone:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create milestone',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT /api/learning/milestones - Mark milestone as achieved
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { milestoneId, achieved = true } = body

    if (!milestoneId) {
      return NextResponse.json(
        { success: false, error: 'milestoneId is required' },
        { status: 400 }
      )
    }

    // Verify milestone belongs to user
    const milestone = await prisma.milestone.findFirst({
      where: {
        id: milestoneId,
        userProgress: {
          user: {
            email: session.user.email
          }
        }
      },
      include: {
        userProgress: {
          include: {
            user: true
          }
        }
      }
    })

    if (!milestone) {
      return NextResponse.json(
        { success: false, error: 'Milestone not found' },
        { status: 404 }
      )
    }

    // Update milestone achievement status
    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        achievedAt: achieved ? new Date() : null
      },
      include: {
        userProgress: {
          include: {
            skill: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    // Update user points if newly achieved
    if (achieved && !milestone.achievedAt) {
      await updateUserPoints(milestone.userProgress.userId, milestone.points)
    } else if (!achieved && milestone.achievedAt) {
      // Subtract points if un-achieved
      await updateUserPoints(milestone.userProgress.userId, -milestone.points)
    }

    const response: ApiResponse<Milestone> = {
      success: true,
      data: updatedMilestone as Milestone,
      message: `Milestone ${achieved ? 'achieved' : 'reset'} successfully`
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating milestone:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update milestone',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/learning/milestones - Delete milestone
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const milestoneId = searchParams.get('id')

    if (!milestoneId) {
      return NextResponse.json(
        { success: false, error: 'milestoneId is required' },
        { status: 400 }
      )
    }

    // Verify milestone belongs to user
    const milestone = await prisma.milestone.findFirst({
      where: {
        id: milestoneId,
        userProgress: {
          user: {
            email: session.user.email
          }
        }
      },
      include: {
        userProgress: {
          include: {
            user: true
          }
        }
      }
    })

    if (!milestone) {
      return NextResponse.json(
        { success: false, error: 'Milestone not found' },
        { status: 404 }
      )
    }

    // Remove points if milestone was achieved
    if (milestone.achievedAt) {
      await updateUserPoints(milestone.userProgress.userId, -milestone.points)
    }

    // Delete milestone
    await prisma.milestone.delete({
      where: { id: milestoneId }
    })

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Milestone deleted successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error deleting milestone:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete milestone',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper function to update user points
async function updateUserPoints(userId: string, pointsDelta: number) {
  try {
    await prisma.learningAnalytics.upsert({
      where: { userId },
      update: {
        // Add a totalPoints field to track user points
        // This would need to be added to the Prisma schema
        updatedAt: new Date()
      },
      create: {
        userId,
        totalHoursLearned: 0,
        skillsAcquired: 0,
        currentStreak: 0,
        longestStreak: 0,
        completionRate: 0,
        averageSessionDuration: 0,
        topSkillCategories: []
      }
    })
  } catch (error) {
    console.error('Error updating user points:', error)
  }
}