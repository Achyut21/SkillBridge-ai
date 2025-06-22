import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserSkill, Skill } from '@prisma/client';

type UserSkillWithSkill = UserSkill & {
  skill: Skill;
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's skills with proficiency levels
    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true }
    });

    // Generate competitive analysis data
    const skillComparisons = userSkills.map((us: UserSkillWithSkill) => {
      // Mock market averages - in production, this would come from real data
      const marketAvg = 65 + Math.random() * 10;
      const topPerformers = 85 + Math.random() * 10;
      
      return {
        skill: us.skill.name,
        yourLevel: us.proficiencyLevel,
        marketAverage: Math.round(marketAvg),
        topPerformers: Math.round(topPerformers),
        demandScore: Math.round(80 + Math.random() * 20),
        gap: us.proficiencyLevel - marketAvg
      };
    });

    // Calculate overall market position
    const avgProficiency = userSkills.length > 0
      ? userSkills.reduce((sum: number, us: UserSkillWithSkill) => sum + us.proficiencyLevel, 0) / userSkills.length
      : 0;

    // Generate competitor scatter data
    const competitorData = Array.from({ length: 50 }, () => ({
      skillLevel: 40 + Math.random() * 50,
      marketValue: 80000 + Math.random() * 80000,
      experience: 1 + Math.random() * 10
    }));

    // Add user's position
    competitorData.push({
      skillLevel: avgProficiency,
      marketValue: 125000 + (avgProficiency - 70) * 2000,
      experience: 5
    });

    // Market position rankings
    const rankings = [
      {
        category: 'Overall Ranking',
        position: Math.floor(8500 * (1 - avgProficiency / 100)),
        total: 8500,
        percentile: Math.round(avgProficiency * 0.9),
        trend: 'up'
      },
      {
        category: 'Frontend Skills',
        position: Math.floor(6200 * (1 - (userSkills.find((us: UserSkillWithSkill) => 
          us.skill.name.includes('React') || us.skill.name.includes('Frontend')
        )?.proficiencyLevel || 70) / 100)),
        total: 6200,
        percentile: 86,
        trend: 'up'
      },
      {
        category: 'Experience Level',
        position: 2100,
        total: 12000,
        percentile: 83,
        trend: 'stable'
      },
      {
        category: 'Market Readiness',
        position: 1050,
        total: 7800,
        percentile: 87,
        trend: 'up'
      }
    ];

    // Define the skill comparison type
    type SkillComparison = typeof skillComparisons[0];

    // Generate recommendations based on analysis
    const recommendations: Array<{
      type: string;
      icon: string;
      message: string;
    }> = [];
    
    // Check for skills above market average
    const strongSkills = skillComparisons.filter((sc: SkillComparison) => sc.gap > 5);
    if (strongSkills.length > 0) {
      recommendations.push({
        type: 'strength',
        icon: 'check-circle',
        message: `Your ${strongSkills[0].skill} skills are above market average - leverage this strength`
      });
    }

    // Check for high-demand skills below average
    const improvementAreas = skillComparisons.filter((sc: SkillComparison) => 
      sc.gap < -5 && sc.demandScore > 85
    );
    if (improvementAreas.length > 0) {
      recommendations.push({
        type: 'improvement',
        icon: 'alert-triangle',
        message: `${improvementAreas[0].skill} skills are below market average but in high demand - prioritize learning`
      });
    }

    // Overall position recommendation
    if (avgProficiency > 80) {
      recommendations.push({
        type: 'achievement',
        icon: 'trending-up',
        message: `You're in the top ${100 - Math.round(avgProficiency * 0.9)}% overall - aim for top 10% to unlock premium opportunities`
      });
    }

    return NextResponse.json({
      skillComparisons,
      competitorData,
      rankings,
      recommendations,
      summary: {
        averageProficiency: Math.round(avgProficiency),
        strongestSkill: skillComparisons.length > 0 
          ? skillComparisons.reduce((max: SkillComparison, sc: SkillComparison) => 
              sc.yourLevel > max.yourLevel ? sc : max, 
              skillComparisons[0]
            )
          : null,
        biggestGap: skillComparisons.length > 0
          ? skillComparisons.reduce((max: SkillComparison, sc: SkillComparison) => 
              Math.abs(sc.gap) > Math.abs(max.gap) ? sc : max, 
              skillComparisons[0]
            )
          : null,
        marketPosition: rankings[0].percentile,
        totalSkills: userSkills.length
      }
    });
  } catch (error) {
    console.error('Error fetching competitive analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competitive analysis' },
      { status: 500 }
    );
  }
}