import { users, roles } from '@/drizzle/schema';
import { InferSelectModel } from 'drizzle-orm';

// Пользователи
export type User = InferSelectModel<typeof users>;

// Роли
export type Role = InferSelectModel<typeof roles>;

// // Производители запчастей
// export type PartManufacturer = InferSelectModel<typeof partManufacturers>;

// // Категории запчастей
// export type PartCategory = InferSelectModel<typeof partCategories>;

// // Запчасти
// export type Part = InferSelectModel<typeof parts>;

// // Использованные запчасти
// export type UsedPart = InferSelectModel<typeof usedParts>;



export interface TokenPayload {
  id: number;
  email: string;
  name: string;
  roleId: number;
  avatar?: string | null;
  phone?: string | null;
}