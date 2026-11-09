'use client';

import React, { useState } from 'react';
import { formatCPFDisplay, formatPhone } from '@/lib/utils';
import {
  Search,
  Eye,
  Trash2,
  Edit,
  Award,
  GraduationCap,
  FileText,
  Mail,
  Phone,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { deleteStudent } from '@/app/actions/students';

interface StudentTableProps {
  students: any[];
  onSelectStudent: (student: any) => void;
  onEditStudent: (student: any) => void;
  onOpenReport: (student: any) => void;
  onRefresh: () => void;
}

export function StudentTable({
  students,
  onSelectStudent,
  onEditStudent,
  onOpenReport,
  onRefresh,
}: StudentTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [academicFilter, setAcademicFilter] = useState('ALL');

  const filtered = students.filter((st) => {
    const matchesSearch =
      st.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.cpf.includes(searchTerm) ||
      st.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (st.city && st.city.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    const hasActiveEnrollment = st.enrollments.some((e: any) => e.status === 'ACTIVE');

    if (statusFilter === 'ACTIVE' && !hasActiveEnrollment) return false;
    if (statusFilter === 'INACTIVE' && hasActiveEnrollment) return false;

    // Filtro por desempenho/boletim
    if (academicFilter !== 'ALL') {
      const allGrades = st.enrollments.flatMap((e: any) => e.grades || []);
      if (academicFilter === 'WITHOUT_GRADES') {
        if (allGrades.length > 0) return false;
      } else if (academicFilter === 'APPROVED') {
        if (allGrades.length === 0) return false;
        const avg = allGrades.reduce((acc: number, g: any) => acc + g.score, 0) / allGrades.length;
        if (avg < 7) return false;
      } else if (academicFilter === 'RECOVERY') {
        if (allGrades.length === 0) return false;
        const avg = allGrades.reduce((acc: number, g: any) => acc + g.score, 0) / allGrades.length;
        if (avg >= 7) return false;
      }
    }

    return true;
  });

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja remover o cadastro do aluno ${name}? Todas as matrículas e notas serão excluídas.`)) {
      await deleteStudent(id);
      onRefresh();
    }
  };

  return (
    <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-xs space-y-4">
      {/* Controles e Filtros Rápidos */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar por nome, CPF, e-mail ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full rounded-lg border bg-background pl-9 pr-4 text-xs focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Filtros:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-lg border bg-background px-3 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Todas as Matrículas</option>
            <option value="ACTIVE">Com Matrícula Ativa</option>
            <option value="INACTIVE">Sem Matrícula Ativa</option>
          </select>

          <select
            value={academicFilter}
            onChange={(e) => setAcademicFilter(e.target.value)}
            className="h-9 rounded-lg border bg-background px-3 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Todos os Desempenhos</option>
            <option value="APPROVED">Aprovados (Média ≥ 7.0)</option>
            <option value="RECOVERY">Em Recuperação (Média &lt; 7.0)</option>
            <option value="WITHOUT_GRADES">Sem Notas Lançadas</option>
          </select>
        </div>
      </div>

      {/* Tabela de Alunos Reformulada */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b bg-muted/30 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
              <th className="py-3 px-3">Aluno / Documento</th>
              <th className="py-3 px-3">Contato & Cidade</th>
              <th className="py-3 px-3">Cursos / Matrícula</th>
              <th className="py-3 px-3 text-center">Boletim / Média</th>
              <th className="py-3 px-3 text-right">Ações Rápidas</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-muted-foreground text-xs">
                  Nenhum aluno encontrado para os critérios de busca.
                </td>
              </tr>
            ) : (
              filtered.map((st) => {
                const allGrades = st.enrollments.flatMap((e: any) => e.grades || []);
                const totalScore = allGrades.reduce((acc: number, g: any) => acc + (g.score || 0), 0);
                const avg = allGrades.length > 0 ? totalScore / allGrades.length : null;

                return (
                  <tr key={st.id} className="hover:bg-muted/40 transition-colors group">
                    {/* Aluno */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-xs shrink-0">
                          {st.fullName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div
                            onClick={() => onSelectStudent(st)}
                            className="font-bold text-foreground hover:text-indigo-600 cursor-pointer"
                          >
                            {st.fullName}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            CPF: {formatCPFDisplay(st.cpf)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contato */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 text-foreground">
                        <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[170px]">{st.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-[11px] mt-0.5">
                        <Phone className="h-3 w-3 shrink-0" />
                        <span>{formatPhone(st.phone)}</span>
                        <span className="mx-1">•</span>
                        <span>{st.city}/{st.state}</span>
                      </div>
                    </td>

                    {/* Cursos */}
                    <td className="py-3 px-3">
                      {st.enrollments.length === 0 ? (
                        <span className="text-[11px] text-muted-foreground italic">Sem matrícula</span>
                      ) : (
                        <div className="space-y-1">
                          {st.enrollments.map((en: any) => (
                            <div key={en.id} className="flex items-center gap-1.5">
                              <span className="font-semibold text-foreground text-xs line-clamp-1 max-w-[180px]">
                                {en.course?.name}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                                {en.registrationNumber}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Boletim / Desempenho */}
                    <td className="py-3 px-3 text-center">
                      {avg !== null ? (
                        <div className="inline-flex flex-col items-center">
                          <button
                            onClick={() => onOpenReport(st)}
                            className={`px-2 py-0.5 rounded text-xs font-bold transition-transform hover:scale-105 flex items-center gap-1 ${
                              avg >= 7.0
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                            title="Clique para ver o boletim completo"
                          >
                            <Award className="h-3 w-3" />
                            {avg.toFixed(1)}
                          </button>
                          <span className="text-[10px] text-muted-foreground mt-0.5">
                            {allGrades.length} nota(s)
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onOpenReport(st)}
                          disabled={st.enrollments.length === 0}
                          className="px-2 py-1 rounded text-[11px] border bg-background hover:bg-accent text-muted-foreground disabled:opacity-40 transition-colors"
                          title="Lançar notas no boletim"
                        >
                          Lançar Notas
                        </button>
                      )}
                    </td>

                    {/* Ações Rápidas */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Acesso Direto ao Boletim */}
                        <button
                          onClick={() => onOpenReport(st)}
                          className="p-1.5 rounded-lg border bg-background hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-600 dark:text-amber-400 transition-colors"
                          title="Acessar Boletim Escolar"
                        >
                          <Award className="h-4 w-4" />
                        </button>

                        {/* Visualizar Perfil / Ficha */}
                        <button
                          onClick={() => onSelectStudent(st)}
                          className="p-1.5 rounded-lg border bg-background hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 transition-colors"
                          title="Ver Ficha Completa do Aluno"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Editar Cadastro */}
                        <button
                          onClick={() => onEditStudent(st)}
                          className="p-1.5 rounded-lg border bg-background hover:bg-accent text-foreground transition-colors"
                          title="Editar Cadastro do Aluno"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        {/* Excluir Aluno */}
                        <button
                          onClick={() => handleDelete(st.id, st.fullName)}
                          className="p-1.5 rounded-lg border bg-background hover:bg-destructive/10 text-destructive transition-colors"
                          title="Excluir Aluno"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Rodapé com Totalizadores */}
      <div className="pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <div>
          Mostrando <strong>{filtered.length}</strong> de <strong>{students.length}</strong> alunos cadastrados.
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Aprovado (Média ≥ 7.0)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500"></span>
            Recuperação (Média &lt; 7.0)
          </span>
        </div>
      </div>
    </div>
  );
}
