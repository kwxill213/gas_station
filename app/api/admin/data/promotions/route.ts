import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { promotions } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allPromotions = await db.select().from(promotions);
    return NextResponse.json(allPromotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json({ error: 'Failed to fetch promotions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const [result] = await db.insert(promotions).values(data);
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();

    const updateData = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isActive: data.isActive === true || data.isActive === 'true' || data.isActive === 'on',
      discountValue: data.discountValue ? parseFloat(data.discountValue) : null,
      stationId: data.stationId ? parseInt(data.stationId) : null
    };

    await db.update(promotions)
      .set(updateData)
      .where(eq(promotions.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating promotion:', error);
    return NextResponse.json({ error: 'Failed to update promotion' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await db.delete(promotions).where(eq(promotions.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return NextResponse.json({ error: 'Failed to delete promotion' }, { status: 500 });
  }
} 