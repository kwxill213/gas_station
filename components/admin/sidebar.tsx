'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Users,
  Settings,
  FileText,
  LogOut,
  Tag,
  Headphones,
  DollarSign,
  Percent
} from 'lucide-react';

const menuItems = [
  {
    title: 'Панель управления',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    title: 'АЗС',
    href: '/admin/stations',
    icon: MapPin
  },
  {
    title: 'Типы топлива',
    href: '/admin/fuel-types',
    icon: Tag
  },
  {
    title: 'Цены на топливо',
    href: '/admin/fuel-prices',
    icon: DollarSign
  },
  {
    title: 'Отзывы',
    href: '/admin/reviews',
    icon: MessageSquare
  },
  {
    title: 'Обращения',
    href: '/admin/support',
    icon: Headphones
  },
  {
    title: 'Пользователи',
    href: '/admin/users',
    icon: Users
  },
  {
    title: 'Акции',
    href: '/admin/promotions',
    icon: Percent
  },
  // {
  //   title: 'Настройки',
  //   href: '/admin/settings',
  //   icon: Settings
  // }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">Админ-панель</h2>
      </div>
      
      <nav className="space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-0 w-64 p-4 border-t border-border">
        <Link href="/" className="flex">

        <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
          <LogOut className="h-5 w-5" />
            Выйти
          </button>
        </Link>
      </div>

    </aside>
  );
} 