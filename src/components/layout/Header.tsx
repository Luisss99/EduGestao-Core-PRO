'use client';

import React, { useState } from 'react';
import { Search, Sun, Moon, Bell, Plus, GraduationCap, UserPlus } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import Link from 'next/link';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6 text-card-foreground shadow-xs z-20">
      {/* Global Search Bar */}
      <div className="flex items-center gap-3 w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por aluno, CPF, matrícula (MAT-2026)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border bg-background pl-9 pr-4 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Right Controls & Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Actions */}
        <Link
          href="/matriculas?new=true"
          className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <GraduationCap className="h-4 w-4" />
          <span>Nova Matrícula</span>
        </Link>

        <Link
          href="/alunos?new=true"
          className="hidden md:flex items-center gap-1.5 h-9 px-3 rounded-lg border bg-background hover:bg-accent text-xs font-semibold transition-colors"
        >
          <UserPlus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>Novo Aluno</span>
        </Link>

        <div className="h-5 w-px bg-border mx-1" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title="Alternar Tema (Claro / Escuro)"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-600" />
          )}
        </button>

        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title="Notificações do Sistema"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background" />
        </button>
      </div>
    </header>
  );
}
