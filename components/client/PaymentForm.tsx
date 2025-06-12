// components/payment/PaymentForm.tsx
'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function PaymentForm({ total, maxPoints }: { total: number; maxPoints: number }) {
  const [usePoints, setUsePoints] = useState(false);
  const [pointsAmount, setPointsAmount] = useState(0);

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total - (usePoints ? pointsAmount : 0),
          pointsUsed: usePoints ? pointsAmount : 0
        })
      });
      
      // Обработка ответа
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="usePoints"
          checked={usePoints}
          onChange={(e) => setUsePoints(e.target.checked)}
        />
        <Label htmlFor="usePoints">Использовать бонусные баллы</Label>
      </div>

      {usePoints && (
        <div>
          <Label>Количество баллов (макс. {Math.min(maxPoints, total / 2)})</Label>
          <Input
            type="number"
            min="0"
            max={Math.min(maxPoints, total / 2)}
            value={pointsAmount}
            onChange={(e) => setPointsAmount(Number(e.target.value))}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Можно использовать до 50% от суммы ({Math.floor(total / 2)} баллов)
          </p>
        </div>
      )}

      <div className="border-t pt-4">
        <p className="font-semibold text-lg">
          Итого к оплате: {total - (usePoints ? pointsAmount : 0)} ₽
        </p>
        {usePoints && (
          <p className="text-sm text-muted-foreground">
            Использовано баллов: {pointsAmount} (списано {pointsAmount} ₽)
          </p>
        )}
      </div>

      <Button className="w-full" onClick={handleSubmit}>
        Оплатить
      </Button>
    </div>
  );
}