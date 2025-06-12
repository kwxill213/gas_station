import db from '@/drizzle';
import { fuelTypes, fuelPrices, gasStations } from '@/drizzle/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stationId = searchParams.get('stationId');

    if (!stationId) {
      return NextResponse.json(
        { error: 'Station ID is required' },
        { status: 400 }
      );
    }

    const prices = await db
      .select({
        id: fuelTypes.id,
        name: fuelTypes.name,
        price: fuelPrices.price,
      })
      .from(fuelPrices)
      .innerJoin(fuelTypes, eq(fuelPrices.fuelTypeId, fuelTypes.id))
      .where(eq(fuelPrices.stationId, parseInt(stationId)));

    return NextResponse.json(prices);
  } catch (error) {
    console.error('Error fetching fuel types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fuel types' },
      { status: 500 }
    );
  }
} 