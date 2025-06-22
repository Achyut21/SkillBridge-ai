import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { format = 'json', reportType = 'full' } = await req.json();

    // Fetch all analytics data
    const [user, learningPaths, skills, progress, milestones] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, createdAt: true }
      }),
      prisma.learningPath.findMany({
        where: { userId },
        include: {
          skills: true,
          resources: true,
          progress: true
        }
      }),
      prisma.userSkill.findMany({
        where: { userId },
        include: { skill: true }
      }),
      prisma.progress.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 100
      }),
      prisma.milestone.findMany({
        where: { userId },
        orderBy: { achievedAt: 'desc' }
      })
    ]);

    // Generate report data
    const reportData = {
      metadata: {
        generatedAt: new Date().toISOString(),
        user: {
          name: user?.name,
          email: user?.email,
          memberSince: user?.createdAt
        }
      },
      summary: {
        totalLearningPaths: learningPaths.length,
        completedPaths: learningPaths.filter(lp => 
          lp.progress.some(p => p.completionPercentage === 100)
        ).length,
        totalSkills: skills.length,
        averageProficiency: skills.reduce((sum, s) => sum + s.proficiencyLevel, 0) / (skills.length || 1),
        totalMilestones: milestones.length,
        completedMilestones: milestones.filter(m => m.completed).length
      },
      skillsBreakdown: skills.map(s => ({
        name: s.skill.name,
        proficiency: s.proficiencyLevel,
        lastPracticed: s.lastPracticedAt,
        category: s.skill.category
      })),
      learningPaths: learningPaths.map(lp => ({
        title: lp.title,
        description: lp.description,
        difficulty: lp.difficulty,
        estimatedDuration: lp.estimatedDuration,
        progress: lp.progress[0]?.completionPercentage || 0,
        skills: lp.skills.map(s => s.name),
        resourceCount: lp.resources.length
      })),
      recentActivity: progress.slice(0, 30).map(p => ({
        date: p.createdAt,
        completionPercentage: p.completionPercentage,
        timeSpent: p.timeSpent
      })),
      achievements: milestones.filter(m => m.completed).map(m => ({
        title: m.title,
        description: m.description,
        achievedAt: m.achievedAt,
        points: m.points
      }))
    };

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = convertToCSV(reportData);
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=skillbridge-analytics-${new Date().toISOString().split('T')[0]}.csv`
        }
      });
    }

    // Default to JSON
    return NextResponse.json(reportData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename=skillbridge-analytics-${new Date().toISOString().split('T')[0]}.json`
      }
    });
  } catch (error) {
    console.error('Error generating analytics export:', error);
    return NextResponse.json(
      { error: 'Failed to generate analytics export' },
      { status: 500 }
    );
  }
}

function convertToCSV(data: any): string {
  const sections = [];
  
  // Summary section
  sections.push('ANALYTICS SUMMARY');
  sections.push('Generated At,' + data.metadata.generatedAt);
  sections.push('User,' + data.metadata.user.name);
  sections.push('Email,' + data.metadata.user.email);
  sections.push('');
  sections.push('Total Learning Paths,' + data.summary.totalLearningPaths);
  sections.push('Completed Paths,' + data.summary.completedPaths);
  sections.push('Total Skills,' + data.summary.totalSkills);
  sections.push('Average Proficiency,' + data.summary.averageProficiency.toFixed(1) + '%');
  sections.push('');
  
  // Skills section
  sections.push('SKILLS BREAKDOWN');
  sections.push('Skill Name,Proficiency,Category,Last Practiced');
  data.skillsBreakdown.forEach((skill: any) => {
    sections.push(`${skill.name},${skill.proficiency}%,${skill.category || 'General'},${skill.lastPracticed || 'Never'}`);
  });
  sections.push('');
  
  // Learning paths section
  sections.push('LEARNING PATHS');
  sections.push('Title,Progress,Difficulty,Duration,Skills Count');
  data.learningPaths.forEach((path: any) => {
    sections.push(`"${path.title}",${path.progress}%,${path.difficulty},${path.estimatedDuration}h,${path.skills.length}`);
  });
  
  return sections.join('\n');
}