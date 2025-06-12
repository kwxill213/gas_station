'use client';

import { useEffect, useState } from 'react';
import { Fuel } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@radix-ui/react-select';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';

type FuelPrice = {
  fuelTypeId: number;
  fuelTypeName: string;
  price: string;
  stationName: string;
};

export default function FuelPricesSection() {
  const [prices, setPrices] = useState<FuelPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFuelType, setSelectedFuelType] = useState<string>('all');

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/stations');
        if (!response.ok) throw new Error('Failed to fetch prices');
        const data = await response.json();
        
        // Преобразуем данные в плоский массив цен
        const allPrices = data.flatMap((station: any) =>
          station.fuelPrices.map((price: any) => ({
            ...price,
            stationName: station.name
          }))
        );
        
        setPrices(allPrices);
      } catch (err) {
        setError('Failed to load prices');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  // Фильтрация цен
  const filteredPrices = prices.filter(price => {
    const matchesSearch = price.stationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFuelType = selectedFuelType === 'all' || price.fuelTypeId.toString() === selectedFuelType;
    return matchesSearch && matchesFuelType;
  });

  // Получаем уникальные типы топлива
  const fuelTypes = Array.from(new Set(prices.map(price => price.fuelTypeId)))
    .map(id => prices.find(price => price.fuelTypeId === id))
    .filter(Boolean);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Поиск по названию АЗС..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Тип топлива" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            {fuelTypes.map((fuel) => (
              <SelectItem key={fuel?.fuelTypeId} value={fuel?.fuelTypeId.toString() || ''}>
                {fuel?.fuelTypeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrices.map((price) => (
          <Card key={`${price.stationName}-${price.fuelTypeId}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Fuel className="h-5 w-5 mr-2 text-primary" />
                {price.stationName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {Number(price.price).toFixed(2)} ₽/л
              </p>
              <p className="text-sm text-muted-foreground">
                {price.fuelTypeName}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 