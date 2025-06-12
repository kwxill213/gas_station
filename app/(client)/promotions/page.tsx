'use client';

import { useData } from '@/lib/hooks/useData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Percent } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Promotion {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  stationId: number | null;
  discountValue: number | null;
  isActive: boolean;
  imageUrl: string | null;
  station?: {
    name: string;
    address: string;
  };
}

export default function PromotionsPage() {
  const { data: promotions, loading, error } = useData<Promotion>({ endpoint: 'promotions' });

  if (loading) return <div className="container mx-auto px-4 py-8">Загрузка акций...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">Ошибка при загрузке акций: {error}</div>;

  const activePromotions = promotions?.filter(promo => promo.isActive) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Акции и специальные предложения</h1>
      
      {activePromotions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">В данный момент нет активных акций</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePromotions.map((promo) => (
            <Card key={promo.id} className="overflow-hidden">
              {promo.imageUrl && (
                <div className="relative h-48 w-full">
                  <Image
                    src={promo.imageUrl}
                    alt={promo.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{promo.title}</CardTitle>
                <CardDescription>
                  {promo.discountValue && (
                    <span className="text-primary font-semibold">
                      Скидка <Percent className="h-4 w-4" /> {promo.discountValue}%
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{promo.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                  </span>
                </div>
                {promo.station && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{promo.station.name}</span>
                  </div>
                )}
              </CardContent>
              {promo.station && (
                <CardFooter>
                  <Link href={`/stations/${promo.stationId}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      Перейти к АЗС
                    </Button>
                  </Link>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 