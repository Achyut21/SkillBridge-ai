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

// GET /api/learning/paths - Get user's learning paths
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
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const isActive = searchParams.get('active')

    // Build filter conditions
    const where: any = {
      user: {
        email: session.user.email
      }
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    if (difficulty) {
      where.difficulty = difficulty as Difficulty
    }

    // Get learning paths with related data
    const learningPaths = await prisma.learningPath.findMany({
      where,
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
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Filter by category if specified
    let filteredPaths = learningPaths
    if (category && category !== 'all') {
      filteredPaths = learningPaths.filter(path =>
        path.skills.some(pathSkill => 
          pathSkill.skill.category === category
        )
      )
    }

    const response: ApiResponse<LearningPath[]> = {
      success: true,
      data: filteredPaths as LearningPath[]
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching learning paths:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch learning paths',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST /api/learning/paths - Create new learning path
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
      targetRole, 
      duration, 
      difficulty, 
      skills = [],
      resources = []
    } = body

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
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

    // Create learning path with transaction
    const learningPath = await prisma.$transaction(async (tx) => {
      // Create the main learning path
      const newPath = await tx.learningPath.create({
        data: {
          title,
          description,
          targetRole,
          duration: duration || 12,
          difficulty: difficulty || Difficulty.MEDIUM,
          progress: 0,
          isActive: true,
          userId: user.id
        }
      })

      // Add skills to the path
      if (skills.length > 0) {
        await tx.learningPathSkill.createMany({
          data: skills.map((skill: {
            skillId: string;
            order?: number;
            targetLevel?: SkillLevel;
          }, index: number) => ({
            learningPathId: newPath.id,
            skillId: skill.skillId,
            order: skill.order || index,
            targetLevel: skill.targetLevel || SkillLevel.INTERMEDIATE
          }))
        })
      }

      // Add resources to the path
      if (resources.length > 0) {
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
          learningPathId: newPath.id
        }))

        await tx.resource.createMany({
          data: resourceData
        })
      }

      // Fetch the complete path with relations
      return await tx.learningPath.findUnique({
        where: { id: newPath.id },
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
      data: learningPath as LearningPath,
      message: 'Learning path created successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating learning path:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create learning path',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}