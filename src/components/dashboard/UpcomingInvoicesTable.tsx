'use me';
'use client';

import React from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Calendar, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

interface UpcomingInvoicesTableProps {
  invoices: any[];
}

export function UpcomingInvoicesTable({ invoices }: UpcomingInvoicesTableProps) {
  return (
    <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-base text-foreground">
            Próximos Vencimentos de Mensalidades
          </h3>
        </div>
        <Link
          href="/financeiro"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          Ver Todas <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b bg-muted/30 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Aluno</th>
              <th className="py-2.5 px-3">Curso</th>
              <th className="py-2.5 px-3">Parcela</th>
              <th className="py-2.5 px-3">Vencimento</th>
              <th className="py-2.5 px-3 text-right">Valor</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">
                  Nenhum vencimento pendente nos próximos dias.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-foreground">
                    {inv.enrollment?.student?.fullName}
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">
                    {inv.enrollment?.course?.name}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      P{inv.installmentNumber}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium">{formatDate(inv.dueDate)}</td>
                  <td className="py-3 px-3 text-right font-bold text-foreground">
                    {formatCurrency(inv.amount)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      <Clock className="h-3 w-3" /> A Vencer
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
