import { useState, useEffect } from 'react';

interface UseDataProps<T> {
  endpoint: string;
  initialData?: T[];
}

export function useData<T>({ endpoint, initialData = [] }: UseDataProps<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/data/${endpoint}`);
      if (!response.ok) throw new Error('Ошибка загрузки данных');
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const createItem = async (item: Omit<T, 'id'>) => {
    try {
      const response = await fetch(`/api/admin/data/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error('Ошибка создания записи');
      await fetchData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      return false;
    }
  };

  const updateItem = async (id: number, item: Partial<T>) => {
    try {
      const response = await fetch(`/api/admin/data/${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...item }),
      });
      if (!response.ok) throw new Error('Ошибка обновления записи');
      await fetchData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      return false;
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/data/${endpoint}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Ошибка удаления записи');
      await fetchData();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      return false;
    }
  };

  return {
    data,
    loading,
    error,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
  };
} 