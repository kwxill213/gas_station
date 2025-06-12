// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { generateToken } from '@/lib/auth';
import db from '@/drizzle';
import { users, roles } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { email, password, name, phone } = await req.json();

    if (!email || !password || !name || !phone) {
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Некорректный email' },
        { status: 400 }
      );
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }

    const [clientRole] = await db
      .select()
      .from(roles)
      .where(eq(roles.name, 'client'));

    if (!clientRole) {
      return NextResponse.json(
        { error: 'Ошибка системы: роль клиента не найдена' },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
      phone,
      roleId: clientRole.id,
    });

    const [newUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    await generateToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      roleId: newUser.roleId,
      phone: newUser.phone ?? undefined,
    });

    return NextResponse.json(
      { 
        user: { 
          id: newUser.id, 
          email: newUser.email, 
          name: newUser.name,
          roleId: newUser.roleId 
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}