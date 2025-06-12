'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, Edit, Save, X, User } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const { 
    id,
    name,
    email,
    phone,
    avatar,
    setUser,
    isAuthenticated
  } = useAuth();

  const [editData, setEditData] = useState({
    name: name || '',
    phone: phone || '',
  });

  const [avatarPreview, setAvatarPreview] = useState(avatar || '');

  useEffect(() => {
    setEditData({
      name: name || '',
      phone: phone || '',
    });
    setAvatarPreview(avatar || '');
  }, [name, phone, avatar]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const res = await api.patch('/auth/update', {
        ...editData,
        avatar: avatarPreview
      });
      setUser(res.data);
      setIsEditing(false);
      toast.success('Данные успешно обновлены');
    } catch (error) {
      toast.error('Ошибка при обновлении данных');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAvatarPreview(`${res.data.imageUrl}?t=${Date.now()}`);
      toast.success('Аватар успешно обновлён');
    } catch (error) {
      setAvatarPreview(avatar || '');
      toast.error('Ошибка при загрузке аватара');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: name || '',
      phone: phone || '',
    });
    setAvatarPreview(avatar || '');
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Личный кабинет</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <div className="relative group mb-4">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Аватар" 
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {isEditing && (
                  <>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {isUploading ? (
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      ) : (
                        <Edit className="h-6 w-6 text-white" />
                      )}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </>
                )}
              </div>
              
              <h2 className="text-2xl font-bold">{isEditing ? editData.name : name}</h2>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Личные данные</h3>
              {isEditing ? (
                <div className="flex space-x-2">
                  <button 
                    onClick={handleSave}
                    disabled={isLoading}
                    className="p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="p-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
                >
                  <Edit className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <p className="p-2 bg-background rounded">{email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Имя</label>
                {isEditing ? (
                  <Input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                  />
                ) : (
                  <p className="p-2 bg-background rounded">{name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Телефон</label>
                {isEditing ? (
                  <Input
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleEditChange}
                  />
                ) : (
                  <p className="p-2 bg-background rounded">{phone || 'Не указан'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}