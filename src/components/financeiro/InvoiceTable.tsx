'use me';
'use client';

import React, { useState } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { generatePaymentReceiptPDF } from '@/lib/pdf-generator';
import { Search, DollarSign, FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface InvoiceTableProps {
  invoices: any[];
  onOpenClearance: (invoice: any) => void;
}

export function InvoiceTable({ invoices, onOpenClearance }: InvoiceTableProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'PAID' | 'OVERDUE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.enrollment?.student?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.enrollment?.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.enrollment?.course?.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'PENDING') return inv.status === 'PENDING';
    if (activeTab === 'PAID') return inv.status === 'PAID';
    if (activeTab === 'OVERDUE') return inv.status === 'OVERDUE';

    return true;
  });

  const handlePrintReceipt = (inv: any) => {
    generatePaymentReceiptPDF({
      receiptId: inv.id.slice(0, 8).toUpperCase(),
      registrationNumber: inv.enrollment?.registrationNumber || 'MAT-2026',
      studentName: inv.enrollment?.student?.fullName || '',
      courseName: inv.enrollment?.course?.name || '',
      installmentNumber: inv.installmentNumber,
      amount: inv.amount,
      dueDate: formatDate(inv.dueDate),
      paidAt: formatDate(inv.paidAt || new Date()),
      paymentMethod: inv.paymentMethod || 'PIX',
    });
  };

  return (
    <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-xs space-y-4">
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'ALL', label: 'Todas as Faturas' },
            { id: 'PENDING', label: 'A Vencer' },
            { id: 'OVERDUE', label: 'Em Atraso' },
            { id: 'PAID', label: 'Pagas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`h-8 px-3.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por aluno ou matrícula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 w-full rounded-lg border bg-background pl-9 pr-3 text-xs focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b bg-muted/30 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Aluno / Matrícula</th>
              <th className="py-2.5 px-3">Curso</th>
              <th className="py-2.5 px-3">Parcela</th>
              <th className="py-2.5 px-3">Vencimento</th>
              <th className="py-2.5 px-3 text-right">Valor</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground text-xs">
                  Nenhuma mensalidade encontrada nesta aba.
                </td>
              </tr>
            ) : (
              filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-foreground">{inv.enrollment?.student?.fullName}</div>
                    <div className="text-[10px] text-indigo-600 font-semibold">
                      {inv.enrollment?.registrationNumber}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">{inv.enrollment?.course?.name}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 dark:bg-gray-800">
                      P{inv.installmentNumber}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium">{formatDate(inv.dueDate)}</td>
                  <td className="py-3 px-3 text-right font-bold text-foreground">
                    {formatCurrency(inv.amount)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : inv.status === 'OVERDUE'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {inv.status === 'PAID' && <CheckCircle2 className="h-3 w-3" />}
                      {inv.status === 'OVERDUE' && <AlertTriangle className="h-3 w-3" />}
                      {inv.status === 'PENDING' && <Clock className="h-3 w-3" />}
                      {inv.status === 'PAID' ? 'Pago' : inv.status === 'OVERDUE' ? 'Em Atraso' : 'A Vencer'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {inv.status !== 'PAID' ? (
                        <button
                          onClick={() => onOpenClearance(inv)}
                          className="h-7 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <DollarSign className="h-3.5 w-3.5" /> Dar Baixa
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePrintReceipt(inv)}
                          className="h-7 px-2.5 rounded-lg border bg-background hover:bg-indigo-50 text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold transition-colors flex items-center gap-1"
                        >
                          <FileText className="h-3.5 w-3.5" /> Imprimir Recibo
                        </button>
                      )}
                    </div>
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
