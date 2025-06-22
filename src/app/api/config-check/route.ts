import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection with type casting
    const userCount = await (prisma.user.count as any)()
    
    return NextResponse.json({
      status: 'success',
      database: 'connected',
      userCount,
      environment: {
        nodeVersion: process.version,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        googleConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        prismaAccelerate: true
      }
    })
  } catch (error) {
    // console.error('Configuration check error:', error)
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        nodeVersion: process.version,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        googleConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      }
    }, { status: 500 })
  }
}
