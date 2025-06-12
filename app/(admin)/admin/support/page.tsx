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
import { Search, MessageSquare, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { ModalForm } from '@/components/admin/modal-form';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface SupportTicket {
  id: number;
  userId: number | null;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

interface SupportResponse {
  id: number;
  ticketId: number;
  userId: number | null;
  message: string;
  isInternal: boolean;
  createdAt: string;
}

interface User {
  id: number;
  name: string;
}

export default function SupportPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: tickets = [], loading, error, fetchData, updateItem, deleteItem } = useData<SupportTicket>({ endpoint: 'supportTickets' });
  const { data: responses = [] } = useData<SupportResponse>({ endpoint: 'supportResponses' });
  const { data: users = [] } = useData<User>({ endpoint: 'users' });

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateTicket = async (formData: FormData) => {
    if (!selectedTicket) return;

    const ticketData = {
      status: formData.get('status') as string,
      priority: formData.get('priority') as string,
    };

    const success = await updateItem(selectedTicket.id, ticketData);
    if (success) {
      toast.success('Обращение успешно обновлено');
      setIsModalOpen(false);
      setSelectedTicket(null);
    } else {
      toast.error('Ошибка при обновлении обращения');
    }
  };

  const handleDeleteTicket = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить это обращение?')) {
      const success = await deleteItem(id);
      if (success) {
        toast.success('Обращение успешно удалено');
      } else {
        toast.error('Ошибка при удалении обращения');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleUpdateTicket(formData);
  };

  const getUserName = (userId: number | null) => {
    if (!userId) return 'Неизвестный пользователь';
    const user = users.find(u => u.id === userId);
    return user?.name || 'Неизвестный пользователь';
  };

  const getTicketResponses = (ticketId: number) => {
    return responses.filter(r => r.ticketId === ticketId);
  };

  const filteredTickets = tickets.filter(ticket => {
    if (!ticket) return false;
    const searchLower = searchQuery.toLowerCase();
    return (
      ticket.name.toLowerCase().includes(searchLower) ||
      ticket.email.toLowerCase().includes(searchLower) ||
      ticket.subject.toLowerCase().includes(searchLower) ||
      ticket.message.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Управление обращениями</h1>
        <p className="text-muted-foreground">
          Обработка обращений в службу поддержки
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск обращений..."
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
              <TableHead>Пользователь</TableHead>
              <TableHead>Имя</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Тема</TableHead>
              <TableHead>Сообщение</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Приоритет</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  Загрузка...
                </TableCell>
              </TableRow>
            ) : filteredTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  Обращения не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>{getUserName(ticket.userId)}</TableCell>
                  <TableCell>{ticket.name}</TableCell>
                  <TableCell>{ticket.email}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {ticket.message}
                  </TableCell>
                  <TableCell>{ticket.status}</TableCell>
                  <TableCell>{ticket.priority}</TableCell>
                  <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setIsModalOpen(true);
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeleteTicket(ticket.id)}
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
          setSelectedTicket(null);
        }}
        title="Редактирование обращения"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Статус</Label>
            <select
              id="status"
              name="status"
              defaultValue={selectedTicket?.status || 'new'}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="new">Новое</option>
              <option value="in_progress">В обработке</option>
              <option value="resolved">Решено</option>
              <option value="closed">Закрыто</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Приоритет</Label>
            <select
              id="priority"
              name="priority"
              defaultValue={selectedTicket?.priority || 'normal'}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="low">Низкий</option>
              <option value="normal">Обычный</option>
              <option value="high">Высокий</option>
              <option value="urgent">Срочный</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Сообщения</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {getTicketResponses(selectedTicket?.id || 0).map((response) => (
                <div key={response.id} className="p-2 bg-muted rounded-md">
                  <p className="text-sm">{response.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(response.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModalForm>
    </div>
  );
} 