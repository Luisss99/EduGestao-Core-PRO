'use me';
'use client';

import React, { useState } from 'react';
import { formatDate, formatCPFDisplay } from '@/lib/utils';
import { updateEnrollmentStatus } from '@/app/actions/enrollments';
import { generateEnrollmentPDF } from '@/lib/pdf-generator';
import { Search, GraduationCap, FileText, Lock, Play, XCircle, CheckCircle2 } from 'lucide-react';

interface EnrollmentListProps {
  enrollments: any[];
  onOpenNew: () => void;
  onRefresh: () => void;
}

export function EnrollmentList({ enrollments, onOpenNew, onRefresh }: EnrollmentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = enrollments.filter((en) => {
    const matchesSearch =
      en.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      en.student?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      en.student?.cpf.includes(searchTerm) ||
      en.course?.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter !== 'ALL') {
      return en.status === statusFilter;
    }
    return true;
  });

  const handleStatusChange = async (
    enrollmentId: string,
    newStatus: 'ACTIVE' | 'LOCKED' | 'COMPLETED' | 'CANCELED'
  ) => {
    let reason: string | undefined = undefined;
    if (newStatus === 'CANCELED') {
      const promptRes = prompt('Digite o motivo do cancelamento da matrícula:');
      if (!promptRes) return;
      reason = promptRes;
    }

    await updateEnrollmentStatus(enrollmentId, newStatus, reason);
    onRefresh();
  };

  const handlePrintPDF = (en: any) => {
    generateEnrollmentPDF({
      registrationNumber: en.registrationNumber,
      studentName: en.student?.fullName || '',
      studentCpf: formatCPFDisplay(en.student?.cpf || ''),
      studentEmail: en.student?.email || '',
      courseName: en.course?.name || '',
      courseCode: en.course?.code || '',
      workloadHours: en.course?.workloadHours || 0,
      startDate: formatDate(en.startDate),
      subjects: en.course?.subjects || [],
    });
  };

  return (
    <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-xs space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por matrícula (MAT-2026), aluno ou curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full rounded-lg border bg-background pl-9 pr-4 text-xs focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-lg border bg-background px-3 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Todos os Status</option>
            <option value="ACTIVE">Ativas</option>
            <option value="LOCKED">Trancadas</option>
            <option value="COMPLETED">Concluídas</option>
            <option value="CANCELED">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b bg-muted/30 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Código / Aluno</th>
              <th className="py-2.5 px-3">Curso</th>
              <th className="py-2.5 px-3">Data Início</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground text-xs">
                  Nenhuma matrícula encontrada.
                </td>
              </tr>
            ) : (
              filtered.map((en) => (
                <tr key={en.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {en.registrationNumber}
                      </span>
                    </div>
                    <div className="font-semibold text-foreground mt-0.5">
                      {en.student?.fullName}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-foreground">
                    {en.course?.name} ({en.course?.code})
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">{formatDate(en.startDate)}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        en.status === 'ACTIVE'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : en.status === 'LOCKED'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          : en.status === 'COMPLETED'
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {en.status === 'ACTIVE'
                        ? 'Ativa'
                        : en.status === 'LOCKED'
                        ? 'Trancada'
                        : en.status === 'COMPLETED'
                        ? 'Concluída'
                        : 'Cancelada'}
                    </span>
                    {en.status === 'CANCELED' && en.cancellationReason && (
                      <span className="block text-[9px] text-rose-600 mt-0.5 truncate max-w-[120px]">
                        {en.cancellationReason}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handlePrintPDF(en)}
                        className="p-1.5 rounded-lg border bg-background hover:bg-indigo-50 text-indigo-600 dark:text-indigo-400 transition-colors"
                        title="Baixar Comprovante (PDF)"
                      >
                        <FileText className="h-4 w-4" />
                      </button>

                      {en.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleStatusChange(en.id, 'LOCKED')}
                          className="p-1.5 rounded-lg border bg-background hover:bg-amber-50 text-amber-600 transition-colors"
                          title="Trancar Matrícula"
                        >
                          <Lock className="h-4 w-4" />
                        </button>
                      )}

                      {en.status === 'LOCKED' && (
                        <button
                          onClick={() => handleStatusChange(en.id, 'ACTIVE')}
                          className="p-1.5 rounded-lg border bg-background hover:bg-emerald-50 text-emerald-600 transition-colors"
                          title="Reativar Matrícula"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}

                      {en.status !== 'CANCELED' && (
                        <button
                          onClick={() => handleStatusChange(en.id, 'CANCELED')}
                          className="p-1.5 rounded-lg border bg-background hover:bg-rose-50 text-rose-600 transition-colors"
                          title="Cancelar Matrícula"
                        >
                          <XCircle className="h-4 w-4" />
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
