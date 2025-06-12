import db from '@/drizzle';
import { NextResponse } from 'next/server';
import { fuelPrices, gasStations, fuelTypes } from '@/drizzle/schema';


export async function GET() {
  try {
    const [fuelPrice, stations, fuelType] = await Promise.all([
      db.select().from(fuelPrices),
      db.select().from(gasStations),
      db.select().from(fuelTypes),
    ]);

    return NextResponse.json({
      fuelPrice, stations, fuelType
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 