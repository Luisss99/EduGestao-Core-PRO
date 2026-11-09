'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  School,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSessionUser, logoutUser } from '@/app/actions/auth';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Alunos', href: '/alunos', icon: Users },
  { name: 'Cursos & Disciplinas', href: '/cursos', icon: BookOpen },
  { name: 'Matrículas', href: '/matriculas', icon: GraduationCap },
  { name: 'Financeiro', href: '/financeiro', icon: DollarSign },
  { name: 'Usuários', href: '/usuarios', icon: UserCheck },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    getSessionUser().then((user) => {
      if (user) setCurrentUser(user);
    });
  }, [pathname]);

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r bg-card text-card-foreground transition-all duration-300 z-30 shadow-sm',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <School className="h-6 w-6" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-foreground leading-tight">
                EduSaaS
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                Gestão Escolar
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-7 w-7 items-center justify-center rounded-lg border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title={collapsed ? 'Expandir Menu' : 'Recolher Menu'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative',
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5 shrink-0 transition-transform group-hover:scale-105', isActive && 'text-white')} />
              {!collapsed && <span>{item.name}</span>}
              {collapsed && (
                <div className="absolute left-full ml-2 hidden rounded-md bg-gray-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg group-hover:block z-50 whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t bg-muted/30">
        <div className={cn('flex items-center gap-3', collapsed ? 'justify-center' : 'justify-between')}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase">
              {currentUser?.name ? currentUser.name.substring(0, 2) : 'US'}
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-foreground truncate">
                  {currentUser?.name || 'Usuário'}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {currentUser?.email || 'conectado'}
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors cursor-pointer"
              title="Sair do Sistema"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
        {!collapsed && (
          <div className="mt-2 text-center text-[10px] text-muted-foreground">
            Ambiente Seguro • LGPD Compliant
          </div>
        )}
      </div>
    </aside>
  );
}
