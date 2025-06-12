// app/api/loyalty/route.ts
import { NextResponse } from 'next/server';
import { LoyaltyService } from '@/lib/services/loyaltyService';
import { getAuth } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getAuth(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cardInfo = await LoyaltyService.getCardInfo(session.user.id);
    return NextResponse.json(cardInfo);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get loyalty card info' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getAuth(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { points } = await request.json();

  try {
    await LoyaltyService.usePoints(session.user.id, points);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to use points' },
      { status: 400 }
    );
  }
}