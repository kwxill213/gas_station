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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface FuelType {
  id: number;
  name: string;
  description: string | null;
  octaneNumber: number | null;
}

export default function FuelTypesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: fuelTypes = [], loading, error, fetchData, createItem, updateItem, deleteItem } = useData<FuelType>({ endpoint: 'fuelTypes' });

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateFuelType = async (formData: FormData) => {
    const fuelTypeData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      octaneNumber: formData.get('octaneNumber') ? parseInt(formData.get('octaneNumber') as string) : null,
    };

    const success = await createItem(fuelTypeData);
    if (success) {
      toast.success('Тип топлива успешно создан');
      setIsModalOpen(false);
    } else {
      toast.error('Ошибка при создании типа топлива');
    }
  };

  const handleUpdateFuelType = async (formData: FormData) => {
    if (!selectedFuelType) return;

    const fuelTypeData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      octaneNumber: formData.get('octaneNumber') ? parseInt(formData.get('octaneNumber') as string) : null,
    };

    const success = await updateItem(selectedFuelType.id, fuelTypeData);
    if (success) {
      toast.success('Тип топлива успешно обновлен');
      setIsModalOpen(false);
      setSelectedFuelType(null);
    } else {
      toast.error('Ошибка при обновлении типа топлива');
    }
  };

  const handleDeleteFuelType = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этот тип топлива?')) {
      const success = await deleteItem(id);
      if (success) {
        toast.success('Тип топлива успешно удален');
      } else {
        toast.error('Ошибка при удалении типа топлива');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (selectedFuelType) {
      handleUpdateFuelType(formData);
    } else {
      handleCreateFuelType(formData);
    }
  };

  const filteredFuelTypes = fuelTypes.filter(fuelType => {
    if (!fuelType) return false;
    const searchLower = searchQuery.toLowerCase();
    return (
      fuelType.name.toLowerCase().includes(searchLower) ||
      (fuelType.description?.toLowerCase() || '').includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Управление типами топлива</h1>
        <p className="text-muted-foreground">
          Создание и редактирование типов топлива
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск типов топлива..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            setSelectedFuelType(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить тип
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
              <TableHead>ID</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead>Октановое число</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Загрузка...
                </TableCell>
              </TableRow>
            ) : filteredFuelTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Типы топлива не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredFuelTypes.map((fuelType) => (
                <TableRow key={fuelType.id}>
                  <TableCell>{fuelType.id}</TableCell>
                  <TableCell>{fuelType.name}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {fuelType.description || '-'}
                  </TableCell>
                  <TableCell>{fuelType.octaneNumber || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedFuelType(fuelType);
                          setIsModalOpen(true);
                        }}
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeleteFuelType(fuelType.id)}
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
          setSelectedFuelType(null);
        }}
        title={selectedFuelType ? 'Редактирование типа топлива' : 'Добавление типа топлива'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              name="name"
              defaultValue={selectedFuelType?.name || ''}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={selectedFuelType?.description || ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="octaneNumber">Октановое число</Label>
            <Input
              id="octaneNumber"
              name="octaneNumber"
              type="number"
              defaultValue={selectedFuelType?.octaneNumber || ''}
            />
          </div>
        </div>
      </ModalForm>
    </div>
  );
} 