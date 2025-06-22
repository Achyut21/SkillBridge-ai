import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { 
  LearningPath, 
  Difficulty, 
  SkillLevel,
  ApiResponse 
} from '@/lib/types'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/learning/paths/[id] - Get specific learning path
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    const learningPath = await prisma.learningPath.findFirst({
      where: {
        id,
        user: {
          email: session.user.email
        }
      },
      include: {
        skills: {
          include: {
            skill: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        resources: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!learningPath) {
      return NextResponse.json(
        { success: false, error: 'Learning path not found' },
        { status: 404 }
      )
    }

    const response: ApiResponse<LearningPath> = {
      success: true,
      data: learningPath as LearningPath
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching learning path:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch learning path',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT /api/learning/paths/[id] - Update learning path
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { 
      title, 
      description, 
      targetRole, 
      duration, 
      difficulty, 
      progress,
      isActive,
      skills = [],
      resources = []
    } = body

    // Verify ownership
    const existingPath = await prisma.learningPath.findFirst({
      where: {
        id,
        user: {
          email: session.user.email
        }
      }
    })

    if (!existingPath) {
      return NextResponse.json(
        { success: false, error: 'Learning path not found' },
        { status: 404 }
      )
    }

    // Update learning path with transaction
    const updatedPath = await prisma.$transaction(async (tx: any) => {
      // Update the main learning path
      const updated = await tx.learningPath.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(targetRole && { targetRole }),
          ...(duration !== undefined && { duration }),
          ...(difficulty && { difficulty }),
          ...(progress !== undefined && { progress }),
          ...(isActive !== undefined && { isActive }),
          updatedAt: new Date()
        }
      })

      // Update skills if provided
      if (skills.length > 0) {
        // Remove existing skills
        await tx.learningPathSkill.deleteMany({
          where: { learningPathId: id }
        })

        // Add new skills
        await tx.learningPathSkill.createMany({
          data: skills.map((skill: {
            skillId: string;
            order?: number;
            targetLevel?: any;
          }, index: number) => ({
            learningPathId: id,
            skillId: skill.skillId,
            order: skill.order || index,
            targetLevel: skill.targetLevel || SkillLevel.INTERMEDIATE
          }))
        })
      }

      // Update resources if provided
      if (resources.length > 0) {
        // Remove existing resources
        await tx.resource.deleteMany({
          where: { learningPathId: id }
        })

        // Add new resources
        const resourceData = resources.map((resource: {
          title: string;
          type: string;
          url: string;
          provider?: string;
          duration?: number;
          difficulty?: string;
          rating?: number;
          price?: number;
          isFree?: boolean;
        }) => ({
          title: resource.title,
          type: resource.type,
          url: resource.url,
          provider: resource.provider,
          duration: resource.duration,
          difficulty: resource.difficulty,
          rating: resource.rating,
          price: resource.price,
          isFree: resource.isFree || false,
          learningPathId: id
        }))

        await tx.resource.createMany({
          data: resourceData
        })
      }

      // Fetch the complete updated path
      return await tx.learningPath.findUnique({
        where: { id },
        include: {
          skills: {
            include: {
              skill: true
            },
            orderBy: {
              order: 'asc'
            }
          },
          resources: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
    })

    const response: ApiResponse<LearningPath> = {
      success: true,
      data: updatedPath as LearningPath,
      message: 'Learning path updated successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating learning path:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update learning path',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/learning/paths/[id] - Delete learning path
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    // Verify ownership
    const existingPath = await prisma.learningPath.findFirst({
      where: {
        id,
        user: {
          email: session.user.email
        }
      }
    })

    if (!existingPath) {
      return NextResponse.json(
        { success: false, error: 'Learning path not found' },
        { status: 404 }
      )
    }

    // Delete learning path and related data
    await prisma.$transaction(async (tx: any) => {
      // Delete related skills
      await tx.learningPathSkill.deleteMany({
        where: { learningPathId: id }
      })

      // Delete related resources
      await tx.resource.deleteMany({
        where: { learningPathId: id }
      })

      // Delete the learning path
      await tx.learningPath.delete({
        where: { id }
      })
    })

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Learning path deleted successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error deleting learning path:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete learning path',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}