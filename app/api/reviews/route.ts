import { NextResponse } from 'next/server';
import db from '@/drizzle';
import { reviews, users, gasStations } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stationId = searchParams.get('stationId');
    const userId = searchParams.get('userId');

    let reviewsQuery = db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        userId: reviews.userId,
        userName: users.name,
        userAvatar: users.avatar,
        stationId: reviews.stationId,
        stationName: gasStations.name
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .leftJoin(gasStations, eq(reviews.stationId, gasStations.id));

    if (stationId) {
      // @ts-ignore
      reviewsQuery = reviewsQuery.where(eq(reviews.stationId, Number(stationId)));
    }

    if (userId) {
      // @ts-ignore
      reviewsQuery = reviewsQuery.where(eq(reviews.userId, Number(userId)));
    }

    const reviewsList = await reviewsQuery;

    return NextResponse.json(reviewsList);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getAuth(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { stationId, rating, comment } = await request.json();

    const existingReview = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.userId, session.user.id),
          eq(reviews.stationId, stationId)
        )
      );

    if (existingReview.length > 0) {
      return NextResponse.json(
        { error: 'You have already reviewed this station' },
        { status: 400 }
      );
    }

    const [review] = await db
      .insert(reviews)
      .values({
        userId: session.user.id,
        stationId,
        rating,
        comment
      })
      .$returningId();

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
} 