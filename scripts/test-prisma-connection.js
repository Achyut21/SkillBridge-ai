// Test script for Prisma Accelerate connection
const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient()
  
  console.log('🔍 Testing Prisma Accelerate connection...')
  console.log('=====================================')
  
  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Successfully connected to Prisma Accelerate!')
    
    // Try to count users
    try {
      const userCount = await prisma.user.count()
      console.log(`✅ Users table exists! Current count: ${userCount}`)
    } catch (error) {
      console.log('❌ Users table not found - Schema needs to be deployed')
      console.log('   Please deploy your schema through Prisma Data Platform')
    }
    
    // Try to count accounts
    try {
      const accountCount = await prisma.account.count()
      console.log(`✅ Account table exists! Current count: ${accountCount}`)
    } catch (error) {
      console.log('❌ Account table not found - Schema needs to be deployed')
    }
    
    // Try to count sessions
    try {
      const sessionCount = await prisma.session.count()
      console.log(`✅ Session table exists! Current count: ${sessionCount}`)
    } catch (error) {
      console.log('❌ Session table not found - Schema needs to be deployed')
    }
    
  } catch (error) {
    console.error('❌ Connection failed!')
    console.error('Error:', error.message)
    console.error('\nPlease check:')
    console.error('1. Your DATABASE_URL is correct in .env')
    console.error('2. You ran: npx prisma generate --data-proxy')
    console.error('3. Your Prisma Accelerate project is active')
  } finally {
    await prisma.$disconnect()
    console.log('\n=====================================')
    console.log('Test complete!')
  }
}

testConnection()
