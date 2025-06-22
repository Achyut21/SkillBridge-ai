import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { 
  Skill, 
  SkillLevel,
  ApiResponse,
  PaginatedResponse 
} from '@/lib/types'

// GET /api/learning/skills - Get available skills
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const trending = searchParams.get('trending')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // Build filter conditions
    const where: any = {}

    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (trending === 'true') {
      where.trendingScore = { gte: 80 }
    }

    // Build sort conditions
    const orderBy: any = {}
    if (sortBy === 'marketDemand') {
      orderBy.marketDemand = sortOrder
    } else if (sortBy === 'trendingScore') {
      orderBy.trendingScore = sortOrder
    } else {
      orderBy[sortBy] = sortOrder
    }

    // Get total count
    const total = await prisma.skill.count({ where })

    // Get skills with pagination
    const skills = await prisma.skill.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        _count: {
          select: {
            learningPathSkills: true,
            userProgress: true
          }
        }
      }
    })

    // Calculate additional metadata
    const skillsWithMetadata = skills.map((skill: any) => ({
      ...skill,
      totalLearners: skill._count.userProgress,
      usedInPaths: skill._count.learningPathSkills
    }))

    const response: PaginatedResponse<Skill> = {
      items: skillsWithMetadata as Skill[],
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total
    }

    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch skills',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST /api/learning/skills - Create new skill (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { 
      name, 
      category, 
      description, 
      level = SkillLevel.BEGINNER,
      marketDemand = 50,
      trendingScore = 50,
      averageSalary 
    } = body

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: 'Name and category are required' },
        { status: 400 }
      )
    }

    // Check if skill already exists
    const existingSkill = await prisma.skill.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        category
      }
    })

    if (existingSkill) {
      return NextResponse.json(
        { success: false, error: 'Skill already exists in this category' },
        { status: 409 }
      )
    }

    // Create skill
    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        description,
        level,
        marketDemand: Math.max(0, Math.min(100, marketDemand)),
        trendingScore: Math.max(0, Math.min(100, trendingScore)),
        averageSalary
      }
    })

    const response: ApiResponse<Skill> = {
      success: true,
      data: skill as Skill,
      message: 'Skill created successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create skill',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT /api/learning/skills - Update skill market data (batch update)
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
    const { skillUpdates } = body

    if (!Array.isArray(skillUpdates)) {
      return NextResponse.json(
        { success: false, error: 'skillUpdates must be an array' },
        { status: 400 }
      )
    }

    // Update skills in batch
    const updatePromises = skillUpdates.map(async (update: any) => {
      const { id, marketDemand, trendingScore, averageSalary } = update
      
      return prisma.skill.update({
        where: { id },
        data: {
          ...(marketDemand !== undefined && { 
            marketDemand: Math.max(0, Math.min(100, marketDemand)) 
          }),
          ...(trendingScore !== undefined && { 
            trendingScore: Math.max(0, Math.min(100, trendingScore)) 
          }),
          ...(averageSalary !== undefined && { averageSalary }),
          updatedAt: new Date()
        }
      })
    })

    const updatedSkills = await Promise.all(updatePromises)

    const response: ApiResponse<Skill[]> = {
      success: true,
      data: updatedSkills as Skill[],
      message: `Updated ${updatedSkills.length} skills`
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating skills:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update skills',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}