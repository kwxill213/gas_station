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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

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
}

export default function ContentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: promotions, loading, error, fetchData, createItem, updateItem, deleteItem } = useData<Promotion>({ endpoint: 'promotions' });

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePromotion = async (formData: FormData) => {
    const promotionData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      stationId: formData.get('stationId') ? parseInt(formData.get('stationId') as string) : null,
      discountValue: formData.get('discountValue') ? parseFloat(formData.get('discountValue') as string) : null,
      isActive: formData.get('isActive') === 'on',
      imageUrl: formData.get('imageUrl') as string,
    };

    const success = await createItem(promotionData);
    if (success) {
      toast.success('Акция успешно создана');
      setIsModalOpen(false);
      fetchData();
    } else {
      toast.error('Ошибка при создании акции');
    }
  };

  const handleUpdatePromotion = async (formData: FormData) => {
    if (!selectedPromotion) return;

    const promotionData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      stationId: formData.get('stationId') ? parseInt(formData.get('stationId') as string) : null,
      discountValue: formData.get('discountValue') ? parseFloat(formData.get('discountValue') as string) : null,
      isActive: formData.get('isActive') === 'on',
      imageUrl: formData.get('imageUrl') as string,
    };

    const success = await updateItem(selectedPromotion.id, promotionData);
    if (success) {
      toast.success('Акция успешно обновлена');
      setIsModalOpen(false);
      setSelectedPromotion(null);
      fetchData();
    } else {
      toast.error('Ошибка при обновлении акции');
    }
  };

  const handleDeletePromotion = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить эту акцию?')) {
      const success = await deleteItem(id);
      if (success) {
        toast.success('Акция успешно удалена');
        fetchData();
      } else {
        toast.error('Ошибка при удалении акции');
      }
    }
  };

  const filteredPromotions = promotions?.filter(promotion =>
    promotion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promotion.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление контентом</h1>
          <p className="text-muted-foreground">
            Управление акциями и промо-предложениями
          </p>
        </div>
        <Button onClick={() => {
          setSelectedPromotion(null);
          setIsModalOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить акцию
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск акций..."
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
              <TableHead>Описание</TableHead>
              <TableHead>Период</TableHead>
              <TableHead>Скидка</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Загрузка...
                </TableCell>
              </TableRow>
            ) : filteredPromotions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Акции не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredPromotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell>{promotion.id}</TableCell>
                  <TableCell>{promotion.title}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {promotion.description}
                  </TableCell>
                  <TableCell>
                    {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {promotion.discountValue ? `${promotion.discountValue}%` : '-'}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      promotion.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {promotion.isActive ? 'Активна' : 'Неактивна'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPromotion(promotion);
                          setIsModalOpen(true);
                        }}
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeletePromotion(promotion.id)}
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
          setSelectedPromotion(null);
        }}
        title={selectedPromotion ? 'Редактирование акции' : 'Добавление акции'}
        onSubmit={(e) => {
          const formData = new FormData(e.target as HTMLFormElement);
          if (selectedPromotion) {
            handleUpdatePromotion(formData);
          } else {
            handleCreatePromotion(formData);
          }
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название</Label>
            <Input
              id="title"
              name="title"
              defaultValue={selectedPromotion?.title}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={selectedPromotion?.description}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Дата начала</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={selectedPromotion?.startDate.split('T')[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Дата окончания</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={selectedPromotion?.endDate.split('T')[0]}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountValue">Скидка (%)</Label>
            <Input
              id="discountValue"
              name="discountValue"
              type="number"
              min="0"
              max="100"
              step="0.01"
              defaultValue={selectedPromotion?.discountValue || ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL изображения</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              defaultValue={selectedPromotion?.imageUrl || ''}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              name="isActive"
              defaultChecked={selectedPromotion?.isActive}
            />
            <Label htmlFor="isActive">Активна</Label>
          </div>
        </div>
      </ModalForm>
    </div>
  );
} 