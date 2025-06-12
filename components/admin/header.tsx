"use client"

import { User } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function AdminHeader() {
  const router = useRouter();
  const { name, avatar, email, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.refresh();
  };

  return (
    <header className="h-16 border-b border-border bg-card">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Панель администратора</h1>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Avatar className="w-9 h-9 border border-primary/20 overflow-hidden rounded-full">
              {avatar ? (
                <AvatarImage src={avatar} alt={name || 'Профиль'} className="w-full h-full object-cover" />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary flex items-center justify-center w-full h-full rounded-full text-base font-semibold text-white border border-primary/20 border-white">
                  {name ? name.charAt(0).toUpperCase() : 'А'}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="text-sm text-left">
              <p className="font-medium">{name || 'Администратор'}</p>
              <p className="text-xs text-muted-foreground">{email || 'admin@example.com'}</p>
            </div>
          </button>

          {menuOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card border border-border text-card-foreground z-50">
              <div className="py-1" role="none">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium truncate">{name || 'Администратор'}</p>
                  <p className="text-xs text-muted-foreground">Администратор</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  Выйти
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 