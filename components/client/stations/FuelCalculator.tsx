'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';

type FuelType = {
  id: number;
  name: string;
  price: string;
};

type Station = {
  id: number;
  name: string;
  address: string;
};

export default function FuelCalculator() {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null);
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
  const [selectedFuel, setSelectedFuel] = useState<FuelType | null>(null);
  const [liters, setLiters] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await api.get('/stations');
        setStations(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stations:', err);
        setError('Не удалось загрузить список АЗС');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStations();
  }, []);

  useEffect(() => {
    const fetchFuelTypes = async () => {
      if (!selectedStationId) {
        setFuelTypes([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.get(`/fuel-types?stationId=${selectedStationId}`);
        setFuelTypes(response.data);
        setSelectedFuel(null);
        setLiters('');
        setAmount('');
        setError(null);
      } catch (err) {
        console.error('Error fetching fuel types:', err);
        setError('Не удалось загрузить типы топлива');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFuelTypes();
  }, [selectedStationId]);

  const calculateLiters = (amount: string) => {
    if (!selectedFuel || !amount) return '';
    const price = Number(selectedFuel.price);
    if (isNaN(price)) return '';
    const result = Number(amount) / price;
    return result.toFixed(2);
  };

  const calculateAmount = (liters: string) => {
    if (!selectedFuel || !liters) return '';
    const price = Number(selectedFuel.price);
    if (isNaN(price)) return '';
    const result = Number(liters) * price;
    return result.toFixed(2);
  };

  const handleLitersChange = (value: string) => {
    setLiters(value);
    setAmount(calculateAmount(value));
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setLiters(calculateLiters(value));
  };

  if (isLoading && !stations.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Калькулятор стоимости топлива</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Загрузка списка АЗС...</p>
        </CardContent>
      </Card>
    );
  }

  if (error && !stations.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Калькулятор стоимости топлива</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Калькулятор стоимости топлива</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="station">АЗС</Label>
          <Select
            value={selectedStationId?.toString()}
            onValueChange={(value) => {
              setSelectedStationId(Number(value));
              setSelectedFuel(null);
              setLiters('');
              setAmount('');
            }}
          >
            <SelectTrigger id="station">
              <SelectValue placeholder="Выберите АЗС" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((station) => (
                <SelectItem key={station.id} value={station.id.toString()}>
                  {station.name} - {station.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedStationId && (
          <div className="space-y-2">
            <Label htmlFor="fuel-type">Тип топлива</Label>
            <Select
              value={selectedFuel?.id.toString()}
              onValueChange={(value) => {
                const fuel = fuelTypes.find(f => f.id.toString() === value);
                setSelectedFuel(fuel || null);
                if (liters) {
                  setAmount(calculateAmount(liters));
                } else if (amount) {
                  setLiters(calculateLiters(amount));
                }
              }}
            >
              <SelectTrigger id="fuel-type">
                <SelectValue placeholder="Выберите тип топлива" />
              </SelectTrigger>
              <SelectContent>
                {fuelTypes.map((fuel) => (
                  <SelectItem key={fuel.id} value={fuel.id.toString()}>
                    {fuel.name} - {Number(fuel.price).toFixed(2)} ₽/л
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedFuel && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liters">Литры</Label>
              <Input
                id="liters"
                type="number"
                placeholder="Введите количество литров"
                value={liters}
                onChange={(e) => handleLitersChange(e.target.value)}
                min="0"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Сумма (₽)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Введите сумму"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                min="0"
                step="0.1"
              />
            </div>
          </div>
        )}

        {selectedFuel && (liters || amount) && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              {liters && `Количество: ${liters} л`}
              {amount && ` • Сумма: ${amount} ₽`}
              {` • Цена: ${Number(selectedFuel.price).toFixed(2)} ₽/л`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 