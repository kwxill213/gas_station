// components/loyalty/LoyaltyCard.tsx
'use client';
import { useEffect, useState } from 'react';
import { Progress } from '../ui/progress';
import { Fuel, Star, Gift, Zap, Badge } from 'lucide-react';
import { Button } from '../ui/button';

export function LoyaltyCard() {
  const [cardInfo, setCardInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCardInfo() {
      try {
        const res = await fetch('/api/loyalty');
        const data = await res.json();
        setCardInfo(data);
      } catch (error) {
        console.error('Failed to fetch loyalty card info', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCardInfo();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Загрузка информации о карте...</div>;
  }

  if (!cardInfo) {
    return (
      <div className="text-center py-8">
        <p>У вас пока нет карты лояльности</p>
        <Button className="mt-4">Зарегистрировать карту</Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-md p-6 border border-border">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Gift className="h-6 w-6 mr-2 text-primary" />
            Карта лояльности
          </h2>
          <p className="text-muted-foreground">Номер карты: {cardInfo.cardNumber}</p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          Уровень: {cardInfo.levelName}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Ваши баллы: {cardInfo.points}</span>
          {cardInfo.pointsToNextLevel && (
            <span className="text-sm text-muted-foreground">
              До {cardInfo.nextLevelBenefits?.[0]}: {cardInfo.pointsToNextLevel}
            </span>
          )}
        </div>
        {cardInfo.pointsToNextLevel ? (
          <Progress 
            value={(cardInfo.points / (cardInfo.points + cardInfo.pointsToNextLevel)) * 100} 
            className="h-2"
          />
        ) : (
          <Progress value={100} className="h-2" />
        )}
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-3">Преимущества вашего уровня:</h3>
        <ul className="space-y-2">
          {cardInfo.levelBenefits.map((benefit: string, index: number) => (
            <li key={index} className="flex items-start">
              <Star className="h-4 w-4 mt-1 mr-2 text-primary flex-shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {cardInfo.nextLevelBenefits && (
        <div className="bg-secondary/30 p-4 rounded-lg border border-border">
          <h3 className="font-semibold mb-2 flex items-center">
            <Badge className="h-4 w-4 mr-2" />
            Следующий уровень: {cardInfo.level < 2 ? 'Серебряный' : 'Золотой'}
          </h3>
          <ul className="space-y-1 text-sm">
            {cardInfo.nextLevelBenefits.map((benefit: string, index: number) => (
              <li key={index} className="flex items-start">
                <Zap className="h-3 w-3 mt-1 mr-2 text-yellow-500 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}