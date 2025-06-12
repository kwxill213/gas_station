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
import { Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { ModalForm } from '@/components/admin/modal-form';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Station {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  workingHours: string;
  amenities: string[];
  isActive: boolean;
  createdAt: string;
}

export default function StationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: stations = [], loading, error, fetchData, createItem, updateItem, deleteItem } = useData<Station>({ endpoint: 'gasStations' });

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateStation = async (formData: FormData) => {
    const stationData = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      latitude: parseFloat(formData.get('latitude') as string),
      longitude: parseFloat(formData.get('longitude') as string),
      workingHours: formData.get('workingHours') as string,
      amenities: (formData.get('amenities') as string).split(',').map(item => item.trim()),
      isActive: formData.get('isActive') === 'true',
    };

    const stationDataWithCreatedAt = {
      ...stationData,
      createdAt: new Date().toISOString()
    };

    const success = await createItem(stationDataWithCreatedAt);
    if (success) {
      toast.success('АЗС успешно создана');
      setIsModalOpen(false);
      fetchData();
    } else {
      toast.error('Ошибка при создании АЗС');
    }
  };

  const handleUpdateStation = async (formData: FormData) => {
    if (!selectedStation) return;

    const stationData = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      latitude: parseFloat(formData.get('latitude') as string),
      longitude: parseFloat(formData.get('longitude') as string),
      workingHours: formData.get('workingHours') as string,
      amenities: (formData.get('amenities') as string).split(',').map(item => item.trim()),
      isActive: formData.get('isActive') === 'true',
    };

    const success = await updateItem(selectedStation.id, stationData);
    if (success) {
      toast.success('АЗС успешно обновлена');
      setIsModalOpen(false);
      setSelectedStation(null);
    } else {
      toast.error('Ошибка при обновлении АЗС');
    }
  };

  const handleDeleteStation = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить эту АЗС?')) {
      const success = await deleteItem(id);
      if (success) {
        toast.success('АЗС успешно удалена');
      } else {
        toast.error('Ошибка при удалении АЗС');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (selectedStation) {
      handleUpdateStation(formData);
    } else {
      handleCreateStation(formData);
    }
  };

  const filteredStations = stations.filter(station => {
    if (!station) return false;
    const searchLower = searchQuery.toLowerCase();
    return (
      (station.name?.toLowerCase() || '').includes(searchLower) ||
      (station.address?.toLowerCase() || '').includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление АЗС</h1>
          <p className="text-muted-foreground">
            Управление автозаправочными станциями
          </p>
        </div>
        <Button onClick={() => {
          setSelectedStation(null);
          setIsModalOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить АЗС
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск АЗС..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
              <TableHead>ID</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Адрес</TableHead>
              <TableHead>Режим работы</TableHead>
              <TableHead>Удобства</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата создания</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Загрузка...
                </TableCell>
              </TableRow>
            ) : filteredStations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  АЗС не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredStations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell>{station.id}</TableCell>
                  <TableCell>{station.name || '-'}</TableCell>
                  <TableCell>{station.address || '-'}</TableCell>
                  <TableCell>{station.workingHours || '-'}</TableCell>
                  <TableCell>{(station.amenities || []).join(', ') || '-'}</TableCell>
                  <TableCell>{station.isActive ? 'Активна' : 'Неактивна'}</TableCell>
                  <TableCell>{new Date(station.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedStation(station);
                          setIsModalOpen(true);
                        }}
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeleteStation(station.id)}
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
          setSelectedStation(null);
        }}
        title={selectedStation ? 'Редактирование АЗС' : 'Добавление АЗС'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              name="name"
              defaultValue={selectedStation?.name || ''}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Адрес</Label>
            <Input
              id="address"
              name="address"
              defaultValue={selectedStation?.address || ''}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="latitude">Широта</Label>
            <Input
              id="latitude"
              name="latitude"
              type="number"
              step="0.0000000000000001"
              defaultValue={selectedStation?.latitude || ''}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Долгота</Label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              step="0.0000000000000001"
              defaultValue={selectedStation?.longitude || ''}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workingHours">Режим работы</Label>
            <Input
              id="workingHours"
              name="workingHours"
              defaultValue={selectedStation?.workingHours || ''}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amenities">Удобства (через запятую)</Label>
            <Input
              id="amenities"
              name="amenities"
              defaultValue={(selectedStation?.amenities || []).join(', ')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="isActive">Статус</Label>
            <select
              id="isActive"
              name="isActive"
              defaultValue={selectedStation?.isActive ? 'true' : 'false'}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="true">Активна</option>
              <option value="false">Неактивна</option>
            </select>
          </div>
        </div>
      </ModalForm>
    </div>
  );
} 