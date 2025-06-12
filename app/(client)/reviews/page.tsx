import db from '@/drizzle';
import { gasStations, reviews } from '@/drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default async function ReviewsPage() {
  // Получаем все АЗС с их отзывами и статистикой
  const stations = await db
    .select({
      id: gasStations.id,
      name: gasStations.name,
      address: gasStations.address,
      reviews: reviews,
      stats: {
        averageRating: sql<number>`ROUND(AVG(${reviews.rating}), 1)`,
        totalReviews: sql<number>`COUNT(*)`,
      },
    })
    .from(gasStations)
    .leftJoin(reviews, eq(gasStations.id, reviews.stationId))
    .groupBy(gasStations.id, gasStations.name, gasStations.address, reviews.id, reviews.rating, reviews.comment, reviews.createdAt, reviews.response, reviews.responseDate)
    .orderBy(gasStations.name);

  // Группируем отзывы по АЗС
  const stationsWithReviews = stations.reduce((acc, curr) => {
    const existingStation = acc.find(s => s.id === curr.id);
    if (existingStation) {
      if (curr.reviews) {
        existingStation.reviews.push(curr.reviews);
      }
    } else {
      acc.push({
        id: curr.id,
        name: curr.name,
        address: curr.address,
        reviews: curr.reviews ? [curr.reviews] : [],
        stats: curr.stats,
      });
    }
    return acc;
  }, [] as Array<{
    id: number;
    name: string;
    address: string;
    reviews: typeof reviews.$inferSelect[];
    stats: {
      averageRating: number;
      totalReviews: number;
    };
  }>);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Отзывы о АЗС</h1>

      <div className="grid gap-6">
        {stationsWithReviews.map((station) => (
          <Card key={station.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">
                    <Link 
                      href={`/stations/${station.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {station.name}
                    </Link>
                  </CardTitle>
                  <p className="text-muted-foreground">{station.address}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {renderStars(Math.round(Number(station.stats.averageRating) || 0))}
                    <span className="text-sm text-muted-foreground">
                      {(Number(station.stats.averageRating) || 0).toFixed(1)} ({station.stats.totalReviews || 0})
                    </span>
                  </div>
                </div>
                <Link
                  href={`/stations/${station.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  Оставить отзыв
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {station.reviews.length === 0 ? (
                <p className="text-muted-foreground">Пока нет отзывов</p>
              ) : (
                <div className="space-y-4">
                  {station.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground">
                          {typeof review.createdAt === 'string' 
                            ? new Date(review.createdAt).toLocaleDateString('ru-RU', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            : review.createdAt?.toLocaleDateString('ru-RU', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }) || ''
                          }
                        </span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                      {review.response && (
                        <div className="bg-muted p-3 rounded-md mt-2">
                          <div className="font-medium mb-1">Ответ АЗС:</div>
                          <p className="text-sm text-muted-foreground">
                            {review.response}
                          </p>
                          {review.responseDate && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {typeof review.responseDate === 'string'
                                ? new Date(review.responseDate).toLocaleDateString('ru-RU', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })
                                : review.responseDate?.toLocaleDateString('ru-RU', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  }) || ''
                              }
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 