import { NextResponse } from 'next/server';
import db from '@/drizzle';
import * as schema from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  context: { params: Promise<{ table: string }> }
) {
  const params = await context.params; 
  try {
    // @ts-ignore - динамический доступ к таблицам
    const table = schema[`${params.table}Table`] || schema[params.table];
    if (!table) {
      return NextResponse.json(
        { error: 'Таблица не найдена' },
        { status: 404 }
      );
    }

    const data = await db.select().from(table);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Data fetch error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при получении данных' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ table: string }> }
) {
  const params = await context.params;
  try {
    // @ts-ignore - динамический доступ к таблицам
    const table = schema[`${params.table}Table`] || schema[params.table];
    if (!table) {
      return NextResponse.json(
        { error: 'Таблица не найдена' },
        { status: 404 }
      );
    }

    let updatedData = await request.json();

    // Убедимся, что updatedData является массивом
    if (!Array.isArray(updatedData)) {
      updatedData = [updatedData];
    }

    console.log('Updated data received:', updatedData);

    updatedData = updatedData.map((item: any) => {
      const newItem = { ...item };
      for (const key in newItem) {
        if (
          typeof newItem[key] === 'string' &&
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(newItem[key])
        ) {
          newItem[key] = new Date(newItem[key]);
        }
      }
      return newItem;
    });

    await Promise.all(
      updatedData.map(async (item: any) => {
        await db
          .update(table)
          // @ts-ignore - динамическое обновление
          .set(item)
          .where(eq(table.id, item.id));
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Data update error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при обновлении данных' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ table: string }> }
) {
  const params = await context.params;
  try {
    // @ts-ignore
    const table = schema[`${params.table}Table`] || schema[params.table];
    if (!table) {
      return NextResponse.json({ error: 'Таблица не найдена' }, { status: 404 });
    }
    const newItem = await request.json();
    if (!newItem.id) delete newItem.id;
    await db.insert(table).values(newItem);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Data create error:', error);
    return NextResponse.json({ error: 'Ошибка сервера при добавлении данных' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ table: string }> }
) {
  const params = await context.params;
  try {
    // @ts-ignore
    const table = schema[`${params.table}Table`] || schema[params.table];
    if (!table) {
      return NextResponse.json({ error: 'Таблица не найдена' }, { status: 404 });
    }
    const { id } = await request.json();
    await db.delete(table).where(eq(table.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Data delete error:', error);
    return NextResponse.json({ error: 'Ошибка сервера при удалении данных' }, { status: 500 });
  }
}