'use me';
'use client';

import React from 'react';
import { Users, TrendingUp, AlertTriangle, CalendarPlus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface MetricCardsProps {
  metrics: {
    activeStudentsCount: number;
    newEnrollmentsMonth: number;
    adimplenciaRate: number;
    overdueAmount: number;
  };
}

export function MetricCards({ metrics }: MetricCardsProps) {
  const cards = [
    {
      title: 'Total de Alunos Ativos',
      value: metrics.activeStudentsCount.toString(),
      subtext: 'Matrículas ativas na instituição',
      icon: Users,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
      borderColor: 'border-indigo-200 dark:border-indigo-900',
    },
    {
      title: 'Taxa de Adimplência',
      value: `${metrics.adimplenciaRate}%`,
      subtext: 'Mensalidades em dia no semestre',
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
      borderColor: 'border-emerald-200 dark:border-emerald-900',
    },
    {
      title: 'Mensalidades Atrasadas',
      value: formatCurrency(metrics.overdueAmount),
      subtext: 'Total pendente de cobrança',
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/50',
      borderColor: 'border-amber-200 dark:border-amber-900',
    },
    {
      title: 'Novas Matrículas no Mês',
      value: `+${metrics.newEnrollmentsMonth}`,
      subtext: 'Crescimento do corpo discente',
      icon: CalendarPlus,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/50',
      borderColor: 'border-blue-200 dark:border-blue-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl border bg-card text-card-foreground shadow-xs hover:shadow-md transition-all ${card.borderColor}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {card.value}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{card.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
