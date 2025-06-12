'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', { 
        email: form.email, 
        password: form.password, 
        name: form.name, 
        phone: form.phone 
      });

      const data = res.data;
      if (res.status !== 200 && res.status !== 201) {
        throw new Error(data.error || 'Ошибка регистрации');
      }
      window.location.assign('/profile');
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-card rounded-lg shadow-lg border border-border">
      <h1 className="text-2xl font-bold mb-6 text-center text-foreground">Регистрация</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-destructive/20 text-destructive rounded-lg text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Имя</label>
          <input
            type="text"
            placeholder="Иван Иванов"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 bg-background border border-input rounded-lg text-foreground"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 bg-background border border-input rounded-lg text-foreground"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Телефон</label>
          <input
            type="tel"
            placeholder="+7 (999) 123-45-67"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full p-3 bg-background border border-input rounded-lg text-foreground"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Пароль</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 bg-background border border-input rounded-lg text-foreground"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex justify-center items-center"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Зарегистрироваться'}
        </button>
      </form>

      <p className="mt-6 text-center text-muted-foreground">
        Уже есть аккаунт?{' '}
        <Link 
          href="/login" 
          className="text-primary hover:underline font-medium"
        >
          Войти
        </Link>
      </p>
    </div>
  );
}