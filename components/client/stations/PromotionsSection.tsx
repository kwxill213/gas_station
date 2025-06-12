'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift } from 'lucide-react';
import Image from 'next/image';

type Promotion = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  stationId: number;
  stationName: string;
  discountValue: number;
  isActive: boolean;
  imageUrl: string | null;
};

export default function PromotionsSection() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('/api/promotions');
        if (!response.ok) throw new Error('Failed to fetch promotions');
        const data = await response.json();
        setPromotions(data);
      } catch (err) {
        setError('Failed to load promotions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (promotions.length === 0) {
    return (
      <div className="text-center py-8">
        <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium">Нет активных акций</p>
        <p className="text-muted-foreground">Следите за обновлениями</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {promotions.map((promotion) => (
        <Card key={promotion.id} className="overflow-hidden">
          {promotion.imageUrl && (
            <div className="relative h-48">
              <Image
                src={promotion.imageUrl}
                alt={promotion.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{promotion.title}</CardTitle>
              <Badge variant="secondary">
                {promotion.discountValue}% скидка
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {promotion.stationName}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{promotion.description}</p>
            <div className="text-sm text-muted-foreground">
              <p>Действует с {formatDate(promotion.startDate)}</p>
              <p>до {formatDate(promotion.endDate)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 