import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Mock market data - in production, this would come from real market APIs
const generateMarketData = (skills: any[]) => {
  const baseData: Record<string, any> = {
    'React/Next.js': { avgSalary: 135000, demand: 92, growth: 28, openings: 4500 },
    'TypeScript': { avgSalary: 125000, demand: 88, growth: 25, openings: 3800 },
    'Node.js': { avgSalary: 120000, demand: 85, growth: 22, openings: 3200 },
    'Python': { avgSalary: 130000, demand: 90, growth: 30, openings: 5200 },
    'AI/ML': { avgSalary: 155000, demand: 95, growth: 35, openings: 2800 },
    'Cloud (AWS)': { avgSalary: 140000, demand: 90, growth: 32, openings: 3500 },
    'DevOps': { avgSalary: 135000, demand: 87, growth: 26, openings: 2900 },
    'Database': { avgSalary: 115000, demand: 82, growth: 18, openings: 2400 }
  };

  return skills.map(skill => ({
    skillId: skill.id,
    skillName: skill.name,
    marketData: baseData[skill.name] || {
      avgSalary: 110000 + Math.random() * 40000,
      demand: 70 + Math.random() * 25,
      growth: 15 + Math.random() * 20,
      openings: 1500 + Math.floor(Math.random() * 2000)
    }
  }));
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's skills
    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true }
    });

    // Get all skills for market comparison
    const allSkills = await prisma.skill.findMany({
      take: 20,
      orderBy: { name: 'asc' }
    });

    // Generate market data
    const marketData = generateMarketData(allSkills);
    
    // Calculate user's market position
    const userSkillIds = userSkills.map((us: any) => us.skillId);
    const userMarketData = marketData.filter(md => 
      userSkillIds.includes(md.skillId)
    );

    // Calculate average market value
    const avgSalary = userMarketData.length > 0
      ? userMarketData.reduce((sum, md) => sum + md.marketData.avgSalary, 0) / userMarketData.length
      : 0;

    const avgDemand = userMarketData.length > 0
      ? userMarketData.reduce((sum, md) => sum + md.marketData.demand, 0) / userMarketData.length
      : 0;

    // Generate trend data (last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const trendData = months.map((month, index) => ({
      month,
      demand: Math.round(avgDemand * (0.85 + index * 0.03)),
      supply: Math.round(50 + index * 2 + Math.random() * 10),
      salary: Math.round(avgSalary * (0.92 + index * 0.015)),
      growth: Math.round(12 + index * 2.5 + Math.random() * 5)
    }));

    // Get competitive analysis
    const totalCandidates = 8500;
    const userRank = Math.floor(totalCandidates * (1 - avgDemand / 100));
    const percentile = Math.round((1 - userRank / totalCandidates) * 100);

    return NextResponse.json({
      insights: {
        averageSalary: Math.round(avgSalary),
        salaryChange: 8.5,
        jobOpenings: userMarketData.reduce((sum, md) => sum + md.marketData.openings, 0),
        openingsChange: 12.3,
        demandIndex: Math.round(avgDemand),
        demandChange: 5.2,
        candidatePool: totalCandidates,
        poolChange: -3.1
      },
      trendData,
      skillMarketData: marketData.slice(0, 10),
      competitivePosition: {
        rank: userRank,
        total: totalCandidates,
        percentile,
        topSkills: userMarketData
          .sort((a, b) => b.marketData.demand - a.marketData.demand)
          .slice(0, 3)
          .map(md => ({
            skill: md.skillName,
            demand: md.marketData.demand
          }))
      },
      salaryRanges: [
        { 
          role: 'Senior Frontend Developer', 
          min: 110000, 
          median: 135000, 
          max: 165000, 
          location: 'San Francisco',
          experience: '5+ years'
        },
        { 
          role: 'Full Stack Developer', 
          min: 95000, 
          median: 120000, 
          max: 145000, 
          location: 'New York',
          experience: '3-5 years'
        },
        { 
          role: 'AI/ML Engineer', 
          min: 125000, 
          median: 155000, 
          max: 195000, 
          location: 'Remote',
          experience: '4+ years'
        },
        { 
          role: 'DevOps Engineer', 
          min: 105000, 
          median: 130000, 
          max: 160000, 
          location: 'Austin',
          experience: '3-5 years'
        }
      ],
      marketAlert: {
        type: 'opportunity',
        title: 'Market Trend Alert',
        message: 'AI/ML skills showing 35% YoY growth in demand. Consider adding these to your learning path for maximum market value.'
      }
    });
  } catch (error) {
    console.error('Error fetching market insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market insights' },
      { status: 500 }
    );
  }
}