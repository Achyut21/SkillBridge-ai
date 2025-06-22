import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's progress data
    const [
      learningPaths,
      completedMilestones,
      userSkills,
      recentProgress
    ] = await Promise.all([
      // Get learning paths with progress
      prisma.learningPath.findMany({
        where: { userId },
        include: {
          progress: true,
          skills: true,
          resources: true
        }
      }),
      
      // Get completed milestones
      prisma.milestone.count({
        where: {
          userId,
          completed: true
        }
      }),
      
      // Get user skills with proficiency
      prisma.userSkill.findMany({
        where: { userId },
        include: {
          skill: true
        }
      }),
      
      // Get recent progress updates
      prisma.progress.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 30
      })
    ]);

    // Calculate analytics
    const totalPaths = learningPaths.length;
    const completedPaths = learningPaths.filter(path => 
      path.progress.some(p => p.completionPercentage === 100)
    ).length;
    
    const totalHours = recentProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    const averageProgress = learningPaths.reduce((sum, path) => {
      const pathProgress = path.progress[0]?.completionPercentage || 0;
      return sum + pathProgress;
    }, 0) / (totalPaths || 1);

    // Calculate skill metrics
    const skillMetrics = userSkills.map(us => ({
      skillId: us.skillId,
      skillName: us.skill.name,
      proficiency: us.proficiencyLevel,
      hoursInvested: recentProgress
        .filter(p => p.learningPathId && 
          learningPaths.find(lp => 
            lp.id === p.learningPathId && 
            lp.skills.some(s => s.id === us.skillId)
          )
        )
        .reduce((sum, p) => sum + (p.timeSpent || 0), 0)
    }));

    // Calculate learning velocity (progress per day)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentProgressCount = recentProgress.filter(p => 
      new Date(p.updatedAt) > thirtyDaysAgo
    ).length;
    
    const learningVelocity = recentProgressCount / 30;

    // Time spent by category
    const timeByCategory = {
      learning: totalHours * 0.6,
      practice: totalHours * 0.3,
      assessment: totalHours * 0.1
    };

    return NextResponse.json({
      overview: {
        totalPaths,
        completedPaths,
        completionRate: totalPaths ? (completedPaths / totalPaths) * 100 : 0,
        totalHours: Math.round(totalHours),
        completedMilestones,
        averageProgress: Math.round(averageProgress),
        learningVelocity: Math.round(learningVelocity * 100) / 100
      },
      skillMetrics,
      timeByCategory,
      recentActivity: recentProgress.slice(0, 10).map(p => ({
        date: p.updatedAt,
        timeSpent: p.timeSpent,
        progressMade: p.completionPercentage
      }))
    });
  } catch (error) {
    console.error('Error fetching progress analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress analytics' },
      { status: 500 }
    );
  }
}