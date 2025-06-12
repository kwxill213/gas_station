import { NextResponse } from 'next/server';
import { supportTickets } from '@/drizzle/schema';
import db from '@/drizzle';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Пожалуйста, заполните все обязательные поля' },
        { status: 400 }
      );
    }

    const [ticket] = await db.insert(supportTickets).values({
      name,
      email,
      phone: phone || null,
      subject,
      message,
      status: 'new',
      priority: 'normal',
      createdAt: new Date(),
    }).$returningId();

    return NextResponse.json({
      success: true,
      message: 'Ваше сообщение успешно отправлено',
      ticketId: ticket.id
    });

  } catch (error) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при отправке сообщения' },
      { status: 500 }
    );
  }
} 