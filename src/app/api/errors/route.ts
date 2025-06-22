import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface ErrorReport {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  userId?: string;
  context?: Record<string, any>;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const errorData: ErrorReport = await req.json();

    // Add user context if available
    const enrichedError = {
      ...errorData,
      userId: session?.user?.id,
      sessionId: session?.user?.email ? 'authenticated' : 'anonymous',
      timestamp: new Date().toISOString()
    };

    // In production, you would:
    // 1. Send to error monitoring service (Sentry, Bugsnag, etc.)
    // 2. Store in database for analysis  
    // 3. Alert development team for critical errors

    // For now, log the error
    console.error('[Error Report]', {
      ...enrichedError,
      severity: getSeverityLevel(errorData.message)
    });

    // Mock response - in production, return tracking ID
    return NextResponse.json({ 
      success: true,
      errorId: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: 'Error reported successfully'
    });

  } catch (error) {
    console.error('Failed to process error report:', error);
    return NextResponse.json(
      { error: 'Failed to process error report' },
      { status: 500 }
    );
  }
}

function getSeverityLevel(message: string): 'low' | 'medium' | 'high' | 'critical' {
  const criticalKeywords = ['crash', 'fatal', 'cannot', 'failed to load'];
  const highKeywords = ['error', 'exception', 'failed'];
  const mediumKeywords = ['warning', 'deprecated'];

  const lowerMessage = message.toLowerCase();

  if (criticalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'critical';
  }
  if (highKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'high';
  }
  if (mediumKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'medium';
  }
  
  return 'low';
}
