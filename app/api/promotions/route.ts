import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { promotions, gasStations } from '@/drizzle/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stationId = searchParams.get('stationId');
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    let promotionsQuery = db
      .select({
        id: promotions.id,
        title: promotions.title,
        description: promotions.description,
        startDate: promotions.startDate,
        endDate: promotions.endDate,
        stationId: promotions.stationId,
        stationName: gasStations.name,
        discountValue: promotions.discountValue,
        isActive: promotions.isActive,
        imageUrl: promotions.imageUrl
      })
      .from(promotions)
      .leftJoin(gasStations, eq(promotions.stationId, gasStations.id));

    // Фильтры
    if (activeOnly) {
      const now = new Date();
      promotionsQuery = promotionsQuery.where(
        and(
          eq(promotions.isActive, true),
          lte(promotions.startDate, now),
          gte(promotions.endDate, now)
        )
      );
    }

    if (stationId) {
      promotionsQuery = promotionsQuery.where(eq(promotions.stationId, Number(stationId)));
    }

    const promotionsList = await promotionsQuery;

    return NextResponse.json(promotionsList);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    );
  }
} 