// Simple test for Prisma Accelerate
require('dotenv').config({ path: '.env.local' })

async function testPrismaAccelerate() {
  console.log('🔍 Testing Prisma Accelerate Setup')
  console.log('==================================')
  
  // Check environment variable
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('❌ DATABASE_URL not found in environment')
    return
  }
  
  if (!dbUrl.startsWith('prisma+postgres://')) {
    console.error('❌ DATABASE_URL should start with prisma+postgres://')
    return
  }
  
  console.log('✅ DATABASE_URL format is correct')
  console.log('✅ Using Prisma Accelerate')
  
  // Try to import Prisma Client
  try {
    const { PrismaClient } = require('@prisma/client')
    console.log('✅ Prisma Client imported successfully')
    
    // Try to create instance
    const prisma = new PrismaClient()
    console.log('✅ Prisma Client instance created')
    
    // Try a simple query
    try {
      await prisma.$queryRaw`SELECT 1`
      console.log('✅ Database connection successful!')
    } catch (error) {
      console.log('❌ Database query failed')
      console.log('   This likely means the schema hasn\'t been deployed yet')
      console.log('')
      console.log('📝 Next Steps:')
      console.log('1. Go to https://cloud.prisma.io/')
      console.log('2. Find your project')
      console.log('3. Deploy the schema through their interface')
      console.log('4. Once deployed, authentication will work!')
    }
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Failed to load Prisma Client')
    console.error('   Error:', error.message)
    console.log('')
    console.log('   Try running: npx prisma generate --data-proxy')
  }
}

testPrismaAccelerate()
