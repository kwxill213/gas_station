'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { ModalForm } from '@/components/admin/modal-form';
import { Label } from '@/components/ui/label';

interface FuelPrice {
  id: number;
  stationId: number;
  fuelTypeId: number;
  price: number;
  updatedAt: string;
}

interface Station {
  id: number;
  name: string;
}

interface FuelType {
  id: number;
  name: string;
}

export default function FuelPricesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<FuelPrice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    data: fuelPrices = [],
    loading: pricesLoading,
    error: pricesError,
    fetchData: fetchPrices
  } = useData<FuelPrice>({ endpoint: 'fuelPrices' });

  const {
    data: stations = [],
    loading: stationsLoading,
    error: stationsError,
    fetchData: fetchStations
  } = useData<Station>({ endpoint: 'gasStations' });

  const {
    data: fuelTypes = [],
    loading: typesLoading,
    error: typesError,
    fetchData: fetchTypes
  } = useData<FuelType>({ endpoint: 'fuelTypes' });

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchPrices(),
        fetchStations(),
        fetchTypes()
      ]);
    };
    fetchAllData();
  }, []);

  const handleCreate = async (formData: FormData) => {
    try {
      const priceData = {
        stationId: parseInt(formData.get('stationId') as string),
        fuelTypeId: parseInt(formData.get('fuelTypeId') as string),
        price: parseFloat(formData.get('price') as string),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch('/api/admin/data/fuelPrices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(priceData),
      });

      if (!response.ok) {
        throw new Error('Failed to create price');
      }

      await fetchPrices();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating price:', error);
    }
  };

  const handleUpdate = async (id: number, priceData: Partial<FuelPrice>) => {
    try {
      const response = await fetch(`/api/admin/data/fuelPrices`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...priceData }),
      });

      if (!response.ok) {
        throw new Error('Failed to update price');
      }

      await fetchPrices();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/data/fuelPrices`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete price');
      }

      await fetchPrices();
    } catch (error) {
      console.error('Error deleting price:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (selectedPrice) {
      handleUpdate(selectedPrice.id, {
        stationId: parseInt(formData.get('stationId') as string),
        fuelTypeId: parseInt(formData.get('fuelTypeId') as string),
        price: parseFloat(formData.get('price') as string),
        updatedAt: new Date().toISOString()
      });
    } else {
      handleCreate(formData);
    }
  };

  const getStationName = (stationId: number) => {
    return stations.find(station => station.id === stationId)?.name || 'Неизвестная АЗС';
  };

  const getFuelTypeName = (fuelTypeId: number) => {
    return fuelTypes.find(type => type.id === fuelTypeId)?.name || 'Неизвестный тип топлива';
  };

  const filteredPrices = fuelPrices.filter(price => {
    if (!price) return false;
    const searchLower = searchQuery.toLowerCase();
    const stationName = getStationName(price.stationId).toLowerCase();
    const fuelTypeName = getFuelTypeName(price.fuelTypeId).toLowerCase();
    return (
      stationName.includes(searchLower) ||
      fuelTypeName.includes(searchLower) ||
      price.price.toString().includes(searchLower)
    );
  });

  const isLoading = pricesLoading || stationsLoading || typesLoading;
  const error = pricesError || stationsError || typesError;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Управление ценами на топливо</h1>
        <p className="text-muted-foreground">
          Установка и редактирование цен на топливо для АЗС
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по АЗС или типу топлива..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            setSelectedPrice(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить цену
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>АЗС</TableHead>
              <TableHead>Тип топлива</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Последнее обновление</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Загрузка...
                </TableCell>
              </TableRow>
            ) : filteredPrices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Цены на топливо не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredPrices.map((price) => (
                <TableRow key={price.id}>
                  <TableCell>{getStationName(price.stationId)}</TableCell>
                  <TableCell>{getFuelTypeName(price.fuelTypeId)}</TableCell>
                  <TableCell>{Number(price.price).toFixed(2)} ₽/л</TableCell>
                  <TableCell>{new Date(price.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPrice(price);
                          setIsModalOpen(true);
                        }}
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete(price.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPrice(null);
        }}
        title={selectedPrice ? 'Редактирование цены на топливо' : 'Добавление цены на топливо'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stationId">АЗС</Label>
            <select
              id="stationId"
              name="stationId"
              defaultValue={selectedPrice?.stationId || ''}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="">Выберите АЗС</option>
              {stations.map(station => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fuelTypeId">Тип топлива</Label>
            <select
              id="fuelTypeId"
              name="fuelTypeId"
              defaultValue={selectedPrice?.fuelTypeId || ''}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="">Выберите тип топлива</option>
              {fuelTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Цена (₽/л)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={selectedPrice?.price || ''}
              required
            />
          </div>
        </div>
      </ModalForm>
    </div>
  );
} 