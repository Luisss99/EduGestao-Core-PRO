'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, BarChart3 } from 'lucide-react';

interface RevenueChartProps {
  forecastAmount: number;
  realizedAmount: number;
  overdueAmount: number;
}

export function RevenueChart({ forecastAmount, realizedAmount, overdueAmount }: RevenueChartProps) {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

  // Dados mock demonstrativos por mês para visualização elegante
  const monthlyData = [
    { month: 'Jan', forecast: 3200, realized: 3200 },
    { month: 'Fev', forecast: 4100, realized: 4100 },
    { month: 'Mar', forecast: 4800, realized: 3500 },
    { month: 'Abr', forecast: 5200, realized: 2400 },
    { month: 'Mai', forecast: 5500, realized: 0 },
    { month: 'Jun', forecast: 6000, realized: 0 },
  ];

  const maxVal = Math.max(...monthlyData.map((d) => d.forecast)) * 1.15;

  return (
    <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-base text-foreground">
              Faturamento Previsto vs. Realizado
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Acompanhamento financeiro semestral da instituição
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-indigo-500" />
            <span className="text-muted-foreground">Previsto</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground font-semibold">Realizado</span>
          </div>
        </div>
      </div>

      {/* Modern SVG Bar Visualizer */}
      <div className="h-56 flex items-end gap-3 pt-6 pb-2 border-b">
        {monthlyData.map((item, i) => {
          const forecastHeight = (item.forecast / maxVal) * 100;
          const realizedHeight = (item.realized / maxVal) * 100;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-12 hidden group-hover:flex flex-col items-center bg-gray-900 text-white text-[10px] p-2 rounded-md z-30 shadow-xl whitespace-nowrap">
                <span>Previsto: {formatCurrency(item.forecast)}</span>
                <span className="text-emerald-400 font-bold">Realizado: {formatCurrency(item.realized)}</span>
              </div>

              <div className="w-full flex items-end justify-center gap-1.5 h-full">
                {/* Previsto Bar */}
                <div
                  className="w-1/2 bg-indigo-200 dark:bg-indigo-900/60 rounded-t-md transition-all duration-500 group-hover:bg-indigo-300"
                  style={{ height: `${forecastHeight}%` }}
                />
                {/* Realizado Bar */}
                <div
                  className="w-1/2 bg-emerald-500 dark:bg-emerald-600 rounded-t-md transition-all duration-500 group-hover:bg-emerald-400"
                  style={{ height: `${realizedHeight}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{item.month}</span>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs pt-2">
        <div className="p-2 rounded-lg bg-muted/40">
          <span className="text-muted-foreground block">Total Previsto</span>
          <span className="font-bold text-foreground">{formatCurrency(forecastAmount)}</span>
        </div>
        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
          <span className="block">Total Recebido</span>
          <span className="font-bold">{formatCurrency(realizedAmount)}</span>
        </div>
        <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
          <span className="block">Inadimplência</span>
          <span className="font-bold">{formatCurrency(overdueAmount)}</span>
        </div>
      </div>
    </div>
  );
}
