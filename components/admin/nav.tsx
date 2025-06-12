'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Users,
  Fuel,
  Star,
  MessageSquare,
  Settings,
  Home,
  Tag,
} from 'lucide-react';

const navItems = [
  {
    title: 'Обзор',
    href: '/admin',
    icon: Home,
  },
  {
    title: 'Пользователи',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'АЗС',
    href: '/admin/stations',
    icon: Fuel,
  },
  {
    title: 'Типы топлива',
    href: '/admin/fuel-types',
    icon: Tag,
  },
  {
    title: 'Отзывы',
    href: '/admin/reviews',
    icon: Star,
  },
  {
    title: 'Обращения',
    href: '/admin/support',
    icon: MessageSquare,
  },
  {
    title: 'Настройки',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === item.href ? 'bg-accent text-accent-foreground' : 'transparent'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
} 