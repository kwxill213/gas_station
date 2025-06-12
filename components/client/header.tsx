"use client"
import Link from 'next/link';
import { Button } from '../ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { Wrench, Fuel, User, MapPin, Star, Info, Phone, Percent } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, name, avatar, roleId, logout } = useAuth();
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

  const navLinks = [
    { href: "/stations", icon: <Fuel className="h-5 w-5 mr-2" />, text: "АЗС и цены" },
    { href: "/promotions", icon: <Percent className="h-5 w-5 mr-2" />, text: "Акции" },
    { href: "/reviews", icon: <Star className="h-5 w-5 mr-2" />, text: "Отзывы" },
    { href: "/about", icon: <Info className="h-5 w-5 mr-2" />, text: "О нас" },
    { href: "/contacts", icon: <Phone className="h-5 w-5 mr-2" />, text: "Контакты" },
  ];

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center">
          <Fuel className="h-6 w-6 mr-2" />
          АЗС Сеть
        </Link>
        
        <nav className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors"
            >
              {link.icon}
              {link.text}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="relative ml-2" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <span className="sr-only">Открыть меню пользователя</span>
                <Avatar className="w-9 h-9 border border-primary/20 overflow-hidden rounded-full">
                  {avatar ? (
                    <AvatarImage src={avatar} alt={name || 'Профиль'} className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary flex items-center justify-center w-full h-full rounded-full text-base font-semibold text-white border border-primary/20 border-white">
                      {name ? name.charAt(0).toUpperCase() : 'П'}
                    </AvatarFallback>
                  )}
                </Avatar>
              </button>

              {menuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card border border-border text-card-foreground z-50">
                  <div className="py-1" role="none">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium truncate">{name || 'Пользователь'}</p>
                      <p className="text-xs text-muted-foreground">
                        {roleId === 2 ? 'Администратор' : 'Клиент'}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setMenuOpen(false)}
                    >
                      Профиль
                    </Link>
                    {roleId === 2 && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setMenuOpen(false)}
                      >
                        Админ панель
                      </Link>
                    )}
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
          ) : (
            <Link
              href="/login"
              className="ml-2 flex items-center px-4 py-2 rounded-md text-sm font-medium bg-primary/90 hover:bg-primary transition-colors"
            >
              <User className="h-4 w-4 mr-2" />
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}