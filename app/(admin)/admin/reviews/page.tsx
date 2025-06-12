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
import { Search, Star, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { ModalForm } from '@/components/admin/modal-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Review {
  id: number;
  userId: number;
  stationId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  response: string | null;
  responseDate: string | null;
}

interface User {
  id: number;
  name: string;
}

interface Station {
  id: number;
  name: string;
}

export default function ReviewsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: reviews = [], loading: reviewsLoading, error: reviewsError, fetchData: fetchReviews, updateItem, deleteItem } = useData<Review>({ endpoint: 'reviews' });
  const { data: users = [], loading: usersLoading, error: usersError, fetchData: fetchUsers } = useData<User>({ endpoint: 'users' });
  const { data: stations = [], loading: stationsLoading, error: stationsError, fetchData: fetchStations } = useData<Station>({ endpoint: 'gasStations' });

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchReviews(),
        fetchUsers(),
        fetchStations()
      ]);
    };
    loadData();
  }, []);

  const handleUpdateReview = async (formData: FormData) => {
    if (!selectedReview) return;

    const reviewData = {
      isVerified: formData.get('isVerified') === 'true',
      response: formData.get('response') as string,
      responseDate: formData.get('response') ? new Date().toISOString() : null,
    };

    const success = await updateItem(selectedReview.id, reviewData);
    if (success) {
      toast.success('Отзыв успешно обновлен');
      setIsModalOpen(false);
      setSelectedReview(null);
    } else {
      toast.error('Ошибка при обновлении отзыва');
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      const success = await deleteItem(id);
      if (success) {
        toast.success('Отзыв успешно удален');
      } else {
        toast.error('Ошибка при удалении отзыва');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleUpdateReview(formData);
  };

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Неизвестный пользователь';
  };

  const getStationName = (stationId: number) => {
    const station = stations.find(s => s.id === stationId);
    return station?.name || 'Неизвестная АЗС';
  };

  const filteredReviews = reviews.filter(review => {
    if (!review) return false;
    const searchLower = searchQuery.toLowerCase();
    const userName = getUserName(review.userId).toLowerCase();
    const stationName = getStationName(review.stationId).toLowerCase();
    return (
      userName.includes(searchLower) ||
      stationName.includes(searchLower) ||
      (review.comment?.toLowerCase() || '').includes(searchLower)
    );
  });

  const isLoading = reviewsLoading || usersLoading || stationsLoading;
  const error = reviewsError || usersError || stationsError;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Управление отзывами</h1>
        <p className="text-muted-foreground">
          Модерация и управление отзывами пользователей
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск отзывов..."
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
              <TableHead>Автор</TableHead>
              <TableHead>АЗС</TableHead>
              <TableHead>Оценка</TableHead>
              <TableHead>Комментарий</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Ответ</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  Загрузка...
                </TableCell>
              </TableRow>
            ) : filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  Отзывы не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.id}</TableCell>
                  <TableCell>{getUserName(review.userId)}</TableCell>
                  <TableCell>{getStationName(review.stationId)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {review.rating}
                      <Star className="ml-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {review.comment || '-'}
                  </TableCell>
                  <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{review.isVerified ? 'Проверен' : 'На проверке'}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {review.response || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedReview(review);
                          setIsModalOpen(true);
                        }}
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeleteReview(review.id)}
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
          setSelectedReview(null);
        }}
        title="Редактирование отзыва"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="isVerified">Статус проверки</Label>
            <select
              id="isVerified"
              name="isVerified"
              defaultValue={selectedReview?.isVerified ? 'true' : 'false'}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="true">Проверен</option>
              <option value="false">На проверке</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="response">Ответ на отзыв</Label>
            <Textarea
              id="response"
              name="response"
              defaultValue={selectedReview?.response || ''}
            />
          </div>
        </div>
      </ModalForm>
    </div>
  );
} 