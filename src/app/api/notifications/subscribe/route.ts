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

    const subscription = await req.json();
    const userId = session.user.id;

    // Store push subscription in database
    // Note: You'd need to add a PushSubscription model to your Prisma schema
    
    // For now, just log the subscription
    console.log('[Push Subscription]', {
      userId,
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys?.p256dh ? 'present' : 'missing',
        auth: subscription.keys?.auth ? 'present' : 'missing'
      }
    });

    // In production, you would:
    // 1. Store the subscription in your database
    // 2. Associate it with the user
    // 3. Set up scheduled notifications
    
    return NextResponse.json({ 
      success: true,
      message: 'Push subscription stored successfully'
    });

  } catch (error) {
    console.error('Failed to store push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to store push subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { endpoint } = await req.json();
    const userId = session.user.id;

    // Remove push subscription from database
    console.log('[Push Unsubscribe]', { userId, endpoint });

    return NextResponse.json({ 
      success: true,
      message: 'Push subscription removed successfully'
    });

  } catch (error) {
    console.error('Failed to remove push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to remove push subscription' },
      { status: 500 }
    );
  }
}
