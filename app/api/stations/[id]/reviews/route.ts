import { NextResponse } from 'next/server';
import { reviews, users } from '@/drizzle/schema';
import db from '@/drizzle';
import { eq, and, sql } from 'drizzle-orm';

// Получение отзывов для конкретной АЗС
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const stationId = parseInt((await context.params).id);

    // Получаем средний балл
    const [avgRating] = await db
      .select({
        avgRating: sql<number>`ROUND(AVG(${reviews.rating}), 1)`,
        totalReviews: sql<number>`COUNT(*)`,
      })
      .from(reviews)
      .where(eq(reviews.stationId, stationId));

    const stationReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        response: reviews.response,
        responseDate: reviews.responseDate,
        user: {
          name: users.name,
          email: users.email,
          avatar: users.avatar,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.stationId, stationId))
      .orderBy(reviews.createdAt);

    return NextResponse.json({
      reviews: stationReviews,
      stats: {
        averageRating: avgRating.avgRating || 0,
        totalReviews: avgRating.totalReviews || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении отзывов' },
      { status: 500 }
    );
  }
}

// Создание нового отзыва
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { userId, rating, comment } = body;
    const stationId = parseInt((await context.params).id);

    if (!userId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Необходимо заполнить все поля' },
        { status: 400 }
      );
    }

    // Проверяем, есть ли уже отзыв от этого пользователя
    const existingReview = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.userId, parseInt(userId)),
          eq(reviews.stationId, stationId)
        )
      )
      .limit(1);

    if (existingReview.length > 0) {
      return NextResponse.json(
        { error: 'Вы уже оставили отзыв для этой АЗС' },
        { status: 400 }
      );
    }

    // Создаем отзыв
    await db
      .insert(reviews)
      .values({
        stationId,
        userId: parseInt(userId),
        rating,
        comment,
        isVerified: false,
        createdAt: new Date(),
      })
      .execute();

    // Получаем последний созданный отзыв для этой АЗС с данными пользователя
    const [newReview] = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        response: reviews.response,
        responseDate: reviews.responseDate,
        user: {
          name: users.name,
          email: users.email,
          avatar: users.avatar,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.stationId, stationId))
      .orderBy(reviews.createdAt)
      .limit(1);

    // Получаем обновленную статистику
    const [avgRating] = await db
      .select({
        avgRating: sql<number>`ROUND(AVG(${reviews.rating}), 1)`,
        totalReviews: sql<number>`COUNT(*)`,
      })
      .from(reviews)
      .where(eq(reviews.stationId, stationId));

    return NextResponse.json({
      success: true,
      message: 'Отзыв успешно добавлен',
      review: newReview,
      stats: {
        averageRating: avgRating.avgRating || 0,
        totalReviews: avgRating.totalReviews || 0,
      },
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании отзыва' },
      { status: 500 }
    );
  }
} 