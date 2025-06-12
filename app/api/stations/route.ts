import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { gasStations, fuelPrices, fuelTypes } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Получаем все активные станции
    const stations = await db
      .select({
        id: gasStations.id,
        name: gasStations.name,
        address: gasStations.address,
        latitude: gasStations.latitude,
        longitude: gasStations.longitude,
        workingHours: gasStations.workingHours,
        amenities: gasStations.amenities,
        isActive: gasStations.isActive,
      })
      .from(gasStations)
      .where(eq(gasStations.isActive, true));

    // Получаем цены на топливо для всех станций
    const prices = await db
      .select({
        stationId: fuelPrices.stationId,
        fuelTypeId: fuelPrices.fuelTypeId,
        fuelTypeName: fuelTypes.name,
        price: fuelPrices.price,
      })
      .from(fuelPrices)
      .innerJoin(fuelTypes, eq(fuelPrices.fuelTypeId, fuelTypes.id));

    // Объединяем данные
    const stationsWithPrices = stations.map(station => ({
      ...station,
      fuelPrices: prices.filter(price => price.stationId === station.id)
    }));

    return NextResponse.json(stationsWithPrices);
  } catch (error) {
    console.error('Error fetching stations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stations' },
      { status: 500 }
    );
  }
} 