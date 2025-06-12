import { NextResponse } from 'next/server';
import { generateToken, getAuth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import db from '@/drizzle';
import { users } from '@/drizzle/schema';

export async function PATCH(request: Request) {
  const auth = await getAuth(request);
  if (!auth) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const updateCount = await db
      .update(users)
      .set({
        name: body.name,
        phone: body.phone,
        avatar: body.avatar,
      })
      .where(eq(users.id, auth.user.id));
    // @ts-ignore
    if (updateCount === 0) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, auth.user.id))
      .limit(1)
      .then((res) => res[0]);

      
    await generateToken({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      roleId: updatedUser.roleId,
      avatar: updatedUser.avatar ?? undefined,
      phone: updatedUser.phone ?? undefined,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
