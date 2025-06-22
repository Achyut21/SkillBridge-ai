import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { 
  SkillAssessmentForm, 
  SkillLevel, 
  LearningStyle,
  PathRecommendation,
  ApiResponse 
} from '@/lib/types'

// POST /api/learning/assessment - Process skill assessment
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
    const assessmentData: SkillAssessmentForm = body

    // Validate assessment data
    if (!assessmentData.currentRole || !assessmentData.targetRole) {
      return NextResponse.json(
        { success: false, error: 'Current role and target role are required' },
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

    // Generate recommendations based on assessment
    const recommendations = await generateRecommendations(assessmentData)

    // Save assessment results
    const assessment = await prisma.$transaction(async (tx: any) => {
      // Create or update user progress for assessed skills
      if (assessmentData.currentSkills && assessmentData.currentSkills.length > 0) {
        for (const skillAssessment of assessmentData.currentSkills) {
          await tx.userProgress.upsert({
            where: {
              userId_skillId: {
                userId: user.id,
                skillId: skillAssessment.skillId
              }
            },
            update: {
              currentLevel: skillAssessment.level,
              lastActivity: new Date()
            },
            create: {
              userId: user.id,
              skillId: skillAssessment.skillId,
              currentLevel: skillAssessment.level,
              targetLevel: getNextLevel(skillAssessment.level),
              progressPercentage: getLevelProgress(skillAssessment.level),
              hoursSpent: 0,
              lastActivity: new Date()
            }
          })
        }
      }

      // Update user profile with assessment data
      await tx.user.update({
        where: { id: user.id },
        data: {
          onboardingCompleted: true
        }
      })

      // Create skill assessment record
      return await tx.skillAssessment.create({
        data: {
          userId: user.id,
          currentRole: assessmentData.currentRole,
          targetRole: assessmentData.targetRole,
          yearsOfExperience: assessmentData.yearsOfExperience,
          learningGoals: assessmentData.learningGoals,
          timeCommitment: assessmentData.timeCommitment,
          preferredLearningStyle: assessmentData.preferredLearningStyle,
          budget: assessmentData.budget,
          assessmentResults: {
            recommendations,
            skillGaps: calculateSkillGaps(assessmentData),
            learningPlan: generateLearningPlan(assessmentData)
          }
        }
      })
    })

    const response: ApiResponse<{
      assessment: any
      recommendations: PathRecommendation[]
      nextSteps: string[]
    }> = {
      success: true,
      data: {
        assessment,
        recommendations,
        nextSteps: generateNextSteps(assessmentData, recommendations)
      },
      message: 'Assessment completed successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error processing assessment:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process assessment',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET /api/learning/assessment - Get user's assessment history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const assessments = await prisma.skillAssessment.findMany({
      where: {
        user: {
          email: session.user.email
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    const response: ApiResponse<any[]> = {
      success: true,
      data: assessments
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching assessments:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch assessments',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper function to generate recommendations based on assessment
async function generateRecommendations(assessment: SkillAssessmentForm): Promise<PathRecommendation[]> {
  try {
    // Get relevant skills based on target role
    const relevantSkills = await prisma.skill.findMany({
      where: {
        OR: [
          { name: { contains: 'React', mode: 'insensitive' } },
          { name: { contains: 'JavaScript', mode: 'insensitive' } },
          { name: { contains: 'Python', mode: 'insensitive' } },
          { name: { contains: 'TypeScript', mode: 'insensitive' } },
          { name: { contains: 'Node.js', mode: 'insensitive' } }
        ]
      },
      orderBy: {
        marketDemand: 'desc'
      },
      take: 10
    })

    // Generate path recommendations
    const recommendations: PathRecommendation[] = [
      {
        title: `${assessment.targetRole} Accelerated Path`,
        description: `Fast-track your journey to becoming a ${assessment.targetRole}`,
        targetRole: assessment.targetRole,
        skills: relevantSkills.slice(0, 5),
        estimatedDuration: Math.max(12, Math.min(52, assessment.timeCommitment * 4)),
        difficulty: assessment.yearsOfExperience > 3 ? 'HARD' as any : assessment.yearsOfExperience > 1 ? 'MEDIUM' as any : 'EASY' as any,
        careerOutlook: {
          averageSalary: 95000 + (assessment.yearsOfExperience * 5000),
          jobGrowth: 15,
          demandLevel: 'HIGH' as any
        }
      },
      {
        title: 'Foundation Skills Builder',
        description: 'Build strong fundamentals in core technologies',
        targetRole: assessment.targetRole,
        skills: relevantSkills.slice(0, 3),
        estimatedDuration: Math.max(8, assessment.timeCommitment * 2),
        difficulty: 'EASY' as any,
        careerOutlook: {
          averageSalary: 70000 + (assessment.yearsOfExperience * 3000),
          jobGrowth: 12,
          demandLevel: 'MEDIUM' as any
        }
      }
    ]

    return recommendations
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return []
  }
}

// Helper function to calculate skill gaps
function calculateSkillGaps(assessment: SkillAssessmentForm) {
  const currentSkills = assessment.currentSkills || []
  const skillLevels = currentSkills.reduce((acc: Record<string, SkillLevel>, skill: { skillId: string; level: SkillLevel }) => {
    acc[skill.skillId] = skill.level
    return acc
  }, {} as Record<string, SkillLevel>)

  return {
    totalSkillsAssessed: currentSkills.length,
    beginnerSkills: currentSkills.filter((s: { level: SkillLevel }) => s.level === SkillLevel.BEGINNER).length,
    intermediateSkills: currentSkills.filter((s: { level: SkillLevel }) => s.level === SkillLevel.INTERMEDIATE).length,
    advancedSkills: currentSkills.filter((s: { level: SkillLevel }) => s.level === SkillLevel.ADVANCED).length,
    expertSkills: currentSkills.filter((s: { level: SkillLevel }) => s.level === SkillLevel.EXPERT).length,
    skillLevels
  }
}

// Helper function to generate learning plan
function generateLearningPlan(assessment: SkillAssessmentForm) {
  return {
    weeklyTimeCommitment: assessment.timeCommitment,
    learningStyle: assessment.preferredLearningStyle,
    estimatedCompletion: Math.ceil((assessment.currentSkills?.length || 5) * 4 / (assessment.timeCommitment || 5)),
    prioritySkills: assessment.currentSkills?.filter((s: { level: SkillLevel }) => s.level === SkillLevel.BEGINNER).slice(0, 3).map((s: { skillId: string }) => s.skillId) || [],
    recommendedResources: getResourcesByLearningStyle(assessment.preferredLearningStyle)
  }
}

// Helper function to get next skill level
function getNextLevel(currentLevel: SkillLevel): SkillLevel {
  switch (currentLevel) {
    case SkillLevel.BEGINNER:
      return SkillLevel.INTERMEDIATE
    case SkillLevel.INTERMEDIATE:
      return SkillLevel.ADVANCED
    case SkillLevel.ADVANCED:
      return SkillLevel.EXPERT
    default:
      return SkillLevel.EXPERT
  }
}

// Helper function to get progress percentage for skill level
function getLevelProgress(level: SkillLevel): number {
  switch (level) {
    case SkillLevel.BEGINNER:
      return 25
    case SkillLevel.INTERMEDIATE:
      return 50
    case SkillLevel.ADVANCED:
      return 75
    case SkillLevel.EXPERT:
      return 100
    default:
      return 0
  }
}

// Helper function to get resources by learning style
function getResourcesByLearningStyle(style: LearningStyle): string[] {
  switch (style) {
    case LearningStyle.VISUAL:
      return ['video-courses', 'interactive-demos', 'infographics']
    case LearningStyle.AUDITORY:
      return ['podcasts', 'audio-courses', 'discussion-forums']
    case LearningStyle.READING:
      return ['documentation', 'books', 'articles']
    case LearningStyle.KINESTHETIC:
      return ['hands-on-projects', 'coding-challenges', 'workshops']
    default:
      return ['mixed-format-courses']
  }
}

// Helper function to generate next steps
function generateNextSteps(assessment: SkillAssessmentForm, recommendations: PathRecommendation[]): string[] {
  const steps = [
    'Review your personalized learning path recommendations',
    'Set up your study schedule based on your time commitment',
    'Start with foundation skills if you\'re new to the field'
  ]

  if (assessment.timeCommitment >= 10) {
    steps.push('Consider enrolling in intensive courses for faster progress')
  }

  if (recommendations.length > 0) {
    steps.push(`Begin with the "${recommendations[0].title}" path`)
  }

  steps.push('Track your progress and celebrate milestones')

  return steps
}