'use me';
'use client';

import React, { useEffect, useState } from 'react';
import { getDashboardMetrics } from '@/app/actions/invoices';
import { MetricCards } from '@/components/dashboard/MetricCards';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { UpcomingInvoicesTable } from '@/components/dashboard/UpcomingInvoicesTable';
import { GraduationCap, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    const res = await getDashboardMetrics();
    if (res.success) {
      setMetrics(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner de Boas-Vindas */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white shadow-lg">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-300" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                Painel Administrativo
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1">
              Bem-vindo ao EduSaaS
            </h1>
            <p className="text-xs text-indigo-100 mt-1 max-w-xl">
              Visão geral corporativa da sua instituição. Acompanhe a adimplência, matrículas ativas e faturamento em tempo real.
            </p>
          </div>

          <Link
            href="/matriculas?new=true"
            className="h-10 px-5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs shadow-md transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <GraduationCap className="h-4 w-4" /> Nova Matrícula
          </Link>
        </div>
      </div>

      {/* 4 Cards de Métricas Principais */}
      <MetricCards metrics={metrics} />

      {/* Gráfico de Faturamento + Próximos Vencimentos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RevenueChart
            forecastAmount={metrics.totalForecastAmount}
            realizedAmount={metrics.totalPaidAmount}
            overdueAmount={metrics.overdueAmount}
          />
        </div>

        <div className="lg:col-span-5">
          <UpcomingInvoicesTable invoices={metrics.upcomingInvoices || []} />
        </div>
      </div>
    </div>
  );
}
