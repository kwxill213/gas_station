'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await api.post('/auth/login', { email, password });

      if (res.status === 200) {
        window.location.assign(callbackUrl);
      } else {
        const errorMessage = res.data?.message || 'Неверные учетные данные';
        setError(errorMessage);
      }
    } catch (err: any) {
      if (err.response) {
        const errorMessage = err.response.data?.message || 
                         err.response.data?.error || 
                         'Произошла ошибка при авторизации';
        setError(errorMessage);
      } else if (err.request) {
        setError('Ошибка соединения с сервером');
      } else {
        setError('Ошибка при отправке запроса');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-card rounded-lg shadow-lg border border-border">
      <h1 className="text-2xl font-bold mb-6 text-center text-foreground">Вход в аккаунт</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-destructive/20 text-destructive rounded-lg text-center">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-background border border-input rounded-lg text-foreground"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-foreground">Пароль</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-background border border-input rounded-lg text-foreground"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex justify-center items-center"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Войти'}
        </button>
      </form>
      
      <p className="mt-6 text-center text-muted-foreground">
        Нет аккаунта?{' '}
        <Link 
          href="/register" 
          className="text-primary hover:underline font-medium"
        >
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}