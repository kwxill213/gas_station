// lib/services/loyaltyService.ts
import db from '@/drizzle';
import { loyaltyCards } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export class LoyaltyService {
  // Создание карты лояльности для нового пользователя
  static async createLoyaltyCard(userId: number) {
    const cardNumber = `LC${Math.floor(10000 + Math.random() * 90000)}`;
    await db.insert(loyaltyCards).values({
      userId,
      cardNumber,
      points: 0,
      level: 1
    });
  }

  // Начисление баллов за покупку
  static async addPoints(userId: number, amount: number, fuelTypeId?: number) {
    const [card] = await db.select()
      .from(loyaltyCards)
      .where(eq(loyaltyCards.userId, userId));
    
    if (!card) return;

    // Базовое начисление (1 балл за каждые 10 рублей)
    let pointsToAdd = Math.floor(amount / 10);

    // Бонусы за определенное топливо
    if (fuelTypeId === 3) { // АИ-98
      pointsToAdd = Math.floor(pointsToAdd * 1.1);
    }

    // Учет уровня программы
    if (card.level === 2) {
      pointsToAdd = Math.floor(pointsToAdd * 1.15);
    } else if (card.level === 3) {
      pointsToAdd = Math.floor(pointsToAdd * 1.3);
    }

    await db.update(loyaltyCards)
      .set({ points: card.points + pointsToAdd })
      .where(eq(loyaltyCards.userId, userId));

    // Проверка на повышение уровня
    await this.checkLevelUp(userId);
  }

  // Проверка на повышение уровня
  private static async checkLevelUp(userId: number) {
    const [card] = await db.select()
      .from(loyaltyCards)
      .where(eq(loyaltyCards.userId, userId));
    
    if (!card) return;

    let newLevel = card.level;
    if (card.points >= 1500 && card.level < 3) {
      newLevel = 3;
    } else if (card.points >= 500 && card.level < 2) {
      newLevel = 2;
    }

    if (newLevel !== card.level) {
      await db.update(loyaltyCards)
        .set({ level: newLevel })
        .where(eq(loyaltyCards.userId, userId));
    }
  }

  // Использование баллов для оплаты
  static async usePoints(userId: number, pointsToUse: number) {
    const [card] = await db.select()
      .from(loyaltyCards)
      .where(eq(loyaltyCards.userId, userId));
    
    if (!card || card.points < pointsToUse) {
      throw new Error('Недостаточно баллов');
    }

    await db.update(loyaltyCards)
      .set({ points: card.points - pointsToUse })
      .where(eq(loyaltyCards.userId, userId));
  }

  // Получение информации о карте
  static async getCardInfo(userId: number) {
    const [card] = await db.select()
      .from(loyaltyCards)
      .where(eq(loyaltyCards.userId, userId));
    
    if (!card) return null;

    const levelInfo = this.getLevelInfo(card.level);
    const nextLevel = card.level < 3 ? this.getLevelInfo(card.level + 1) : null;

    return {
      ...card,
      levelName: levelInfo.name,
      levelBenefits: levelInfo.benefits,
      pointsToNextLevel: nextLevel ? nextLevel.minPoints - card.points : null,
      nextLevelBenefits: nextLevel?.benefits
    };
  }

  private static getLevelInfo(level: number) {
    const levels = {
      1: {
        name: 'Базовый',
        minPoints: 0,
        benefits: ['1 балл за каждые 10 рублей']
      },
      2: {
        name: 'Серебряный',
        minPoints: 500,
        benefits: ['+15% к начислению баллов', 'Специальные предложения']
      },
      3: {
        name: 'Золотой',
        minPoints: 1500,
        benefits: ['+30% к начислению баллов', 'Персональные предложения', 'Приоритетное обслуживание']
      }
    };

    return levels[level as keyof typeof levels];
  }
}