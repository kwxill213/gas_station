// useAuth.ts (client-side hook)
"use client";
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from '../types';

interface AuthData {
  id: number | null;
  email: string | null;
  name: string | null;
  roleId: number | null;
  avatar: string | null;
  phone: string | null;
  isAuthenticated: boolean;
  logout: () => void;
  setUser: (user: { 
    id: number; 
    email: string; 
    name: string; 
    roleId: number;
    avatar?: string;
    phone?: string;
  } | null) => void;
}

function getCookie(name: string): string | null {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }
  return null;
}

function deleteCookie(name: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=; Max-Age=0; path=/;`;
  }
}

export const useAuth = (): AuthData => {
  const [id, setId] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = getCookie('token');
        if (token) {
          const decoded = jwtDecode<TokenPayload>(token);
          setId(decoded.id);
          setEmail(decoded.email);
          setName(decoded.name);
          setRoleId(decoded.roleId);
          setAvatar(decoded.avatar || null);
          setPhone(decoded.phone || null);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    deleteCookie('token');
    setId(null);
    setEmail(null);
    setName(null);
    setRoleId(null);
    setAvatar(null);
    setPhone(null);
    setIsAuthenticated(false);
  };

  const setUser = (user: { 
    id: number; 
    email: string; 
    name: string; 
    roleId: number;
    avatar?: string;
    phone?: string;
  } | null) => {
    if (user) {
      setId(user.id);
      setEmail(user.email);
      setName(user.name);
      setRoleId(user.roleId);
      setAvatar(user.avatar || null);
      setPhone(user.phone || null);
      setIsAuthenticated(true);
    } else {
      setId(null);
      setEmail(null);
      setName(null);
      setRoleId(null);
      setAvatar(null);
      setPhone(null);
      setIsAuthenticated(false);
    }
  };

  return {
    id,
    email,
    name,
    roleId,
    avatar,
    phone,
    isAuthenticated,
    logout,
    setUser,
  };
};