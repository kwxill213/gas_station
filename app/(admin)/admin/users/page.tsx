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
import { Search, UserPlus, Trash2 } from 'lucide-react';
import { useEffect, useState, FormEvent } from 'react';
import { useData } from '@/lib/hooks/useData';
import { ModalForm } from '@/components/admin/modal-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface User {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  roleId: number;
  avatar: string | null;
  createdAt: string;
}

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: users, loading, error, fetchData, createItem, updateItem, deleteItem } = useData<User>({ endpoint: 'users' });

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (formData: FormData) => {
    const userData = {
      email: formData.get('email') as string,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      roleId: parseInt(formData.get('roleId') as string),
      password: formData.get('password') as string,
    };

    const userDataWithDefaults = {
      ...userData,
      avatar: null,
      createdAt: new Date().toISOString()
    };

    const success = await createItem(userDataWithDefaults);
    if (success) {
      toast.success('Пользователь успешно создан');
      setIsModalOpen(false);
      fetchData();
    } else {
      toast.error('Ошибка при создании пользователя');
    }
  };

  const handleUpdateUser = async (formData: FormData) => {
    if (!selectedUser) return;

    const userData = {
      email: formData.get('email') as string,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      roleId: parseInt(formData.get('roleId') as string),
    };

    const success = await updateItem(selectedUser.id, userData);
    if (success) {
      toast.success('Пользователь успешно обновлен');
      setIsModalOpen(false);
      setSelectedUser(null);
    } else {
      toast.error('Ошибка при обновлении пользователя');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      const success = await deleteItem(id);
      if (success) {
        toast.success('Пользователь успешно удален');
      } else {
        toast.error('Ошибка при удалении пользователя');
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (selectedUser) {
      handleUpdateUser(formData);
    } else {
      handleCreateUser(formData);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.phone && user.phone.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление пользователями</h1>
          <p className="text-muted-foreground">
            Управление пользователями системы
          </p>
        </div>
        <Button onClick={() => {
          setSelectedUser(null);
          setIsModalOpen(true);
        }}>
          <UserPlus className="mr-2 h-4 w-4" />
          Добавить пользователя
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск пользователей..."
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
              <TableHead>Имя</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Дата регистрации</TableHead>
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
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Пользователи не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || '-'}</TableCell>
                  <TableCell>{user.roleId === 1 ? 'Пользователь' : 'Администратор'}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsModalOpen(true);
                        }}
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeleteUser(user.id)}
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
          setSelectedUser(null);
        }}
        title={selectedUser ? 'Редактирование пользователя' : 'Добавление пользователя'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              name="name"
              defaultValue={selectedUser?.name}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={selectedUser?.email}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={selectedUser?.phone || ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roleId">Роль</Label>
            <Select name="roleId" defaultValue={selectedUser?.roleId.toString() || '1'}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Пользователь</SelectItem>
                <SelectItem value="2">Администратор</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!selectedUser && (
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>
          )}
        </div>
      </ModalForm>
    </div>
  );
} 