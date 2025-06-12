// lib/auth.ts
import { cookies, headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { TokenPayload } from './types';

const SECRET = process.env.JWT_SECRET!;

export const generateToken = async (user: { id: number; email: string; name: string; roleId: number; avatar?: string; phone?: string }) => {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    roleId: user.roleId,
    avatar: user.avatar || null,
    phone: user.phone || null,
  };
  
  const token = jwt.sign(payload, SECRET, { expiresIn: '10h' });
  (await cookies()).set('token', token);
  return token;
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, SECRET) as TokenPayload;
};

export const clearToken = async () => {
  (await cookies()).delete('token');
};

export async function getAuth(req: Request) {
  let token = req.headers.get('authorization')?.split(' ')[1] || 
              (await headers()).get('authorization')?.split(' ')[1];

  if (!token) {
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/token=([^;]+)/);
      if (match) token = match[1];
    }
    if (!token) {
      token = (await cookies()).get('token')?.value || undefined;
    }
  }

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      name: string;
      roleId: number;
      avatar?: string;
      phone?: string;
    };
    return { user: decoded };
  } catch (err) {
    return null;
  }
}