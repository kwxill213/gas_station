'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    avatar: string | null;
  };
  response?: string;
  responseDate?: string;
}

interface ReviewsStats {
  averageRating: number;
  totalReviews: number;
}

interface ReviewsSectionProps {
  stationId: string;
  stationName?: string;
}

export default function ReviewsSection({ stationId, stationName }: ReviewsSectionProps) {
  const { id } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewsStats>({ averageRating: 0, totalReviews: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [stationId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/stations/${stationId}/reviews`);
      if (!response.ok) throw new Error('Ошибка при загрузке отзывов');
      const data = await response.json();
      setReviews(data.reviews);
      setStats(data.stats);
    } catch (error) {
      toast.error('Не удалось загрузить отзывы');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      toast.error('Необходимо авторизоваться для оставления отзыва');
      return;
    }

    try {
      const response = await fetch(`/api/stations/${stationId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: id,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при отправке отзыва');
      }

      toast.success('Отзыв успешно добавлен');
      setNewReview({ rating: 0, comment: '' });
      
      // Обновляем отзывы и статистику
      setReviews(prev => [data.review, ...prev]);
      setStats(data.stats);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Не удалось отправить отзыв');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
          <CardTitle>
              {stationName ? `Отзывы на ${stationName}` : 'Отзывы'}
            </CardTitle>
            <div className="flex items-center gap-2">
              {renderStars(Math.round(Number(stats.averageRating) || 0))}
              <span className="text-sm text-muted-foreground">
                {(Number(stats.averageRating) || 0).toFixed(1)} ({stats.totalReviews || 0})
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {id && (
            <form onSubmit={handleSubmitReview} className="space-y-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Оценка</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                      onMouseEnter={() => setHoveredRating(rating)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          rating <= (hoveredRating || newReview.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Комментарий</label>
                <Textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Опишите ваш опыт..."
                  required
                  className="min-h-[100px]"
                />
              </div>

              <Button type="submit" disabled={!newReview.rating || !newReview.comment}>
                Оставить отзыв
              </Button>
            </form>
          )}

          {isLoading ? (
            <div className="text-center py-4">Загрузка отзывов...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Пока нет отзывов. Будьте первым!
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {review.user.avatar ? (
                          <AvatarImage 
                            src={review.user.avatar} 
                            alt={review.user.name}
                            className="object-cover"
                          />
                        ) : (
                          <AvatarFallback>{getInitials(review.user.name)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.user.name}</span>
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-2">{review.comment}</p>
                  {review.response && (
                    <div className="bg-muted p-3 rounded-md mt-2">
                      <div className="font-medium mb-1">Ответ АЗС:</div>
                      <p className="text-sm text-muted-foreground">{review.response}</p>
                      {review.responseDate && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDate(review.responseDate)}
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
    </div>
  );
} 