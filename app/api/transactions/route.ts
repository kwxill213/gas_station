// app/api/transactions/route.ts
import { NextResponse } from 'next/server';
import { LoyaltyService } from '@/lib/services/loyaltyService';
import db from '@/drizzle';
import { getAuth } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getAuth(request);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { stationId, fuelTypeId, volume, price, pointsUsed } = await request.json();
  const total = volume * price;

  try {
    // Создаем транзакцию
    const [transaction] = await db.insert(transactions).values({
      userId: session.user.id,
      stationId,
      fuelTypeId,
      volume,
      price,
      total,
      pointsUsed
    }).$returningId();

    // Начисляем баллы (минус использованные)
    const pointsEarned = Math.floor((total - (pointsUsed || 0)) / 10);
    await LoyaltyService.addPoints(session.user.id, pointsEarned, fuelTypeId);

    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}