import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed skills
  const skills = [
    { name: 'JavaScript', category: 'Programming', marketDemand: 95, trendingUp: true },
    { name: 'TypeScript', category: 'Programming', marketDemand: 88, trendingUp: true },
    { name: 'React', category: 'Frontend', marketDemand: 92, trendingUp: true },
    { name: 'Next.js', category: 'Frontend', marketDemand: 85, trendingUp: true },
    { name: 'Node.js', category: 'Backend', marketDemand: 90, trendingUp: true },
    { name: 'Python', category: 'Programming', marketDemand: 94, trendingUp: true },
    { name: 'AI/ML', category: 'Emerging Tech', marketDemand: 96, trendingUp: true },
    { name: 'Cloud Computing', category: 'Infrastructure', marketDemand: 91, trendingUp: true },
    { name: 'DevOps', category: 'Infrastructure', marketDemand: 87, trendingUp: true },
    { name: 'UI/UX Design', category: 'Design', marketDemand: 83, trendingUp: false },
  ]

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
