'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  FileText,
  CreditCard,
  Award,
  Edit,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { formatCPFDisplay, formatPhone, formatCurrency, formatDate } from '@/lib/utils';
import { generateEnrollmentPDF } from '@/lib/pdf-generator';
import { generateStudentLGPDReportPDF } from '@/lib/lgpd-report';

interface StudentDetailsModalProps {
  student: any | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReport?: (student: any) => void;
  onEditStudent?: (student: any) => void;
}

export function StudentDetailsModal({
  student,
  isOpen,
  onClose,
  onOpenReport,
  onEditStudent,
}: StudentDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'perfil' | 'matriculas' | 'boletim' | 'financeiro'>('perfil');

  if (!isOpen || !student) return null;

  const enrollments = student.enrollments || [];

  const handlePrintCertificate = (enrollment: any) => {
    generateEnrollmentPDF({
      registrationNumber: enrollment.registrationNumber,
      studentName: student.fullName,
      studentCpf: formatCPFDisplay(student.cpf),
      studentEmail: student.email,
      courseName: enrollment.course.name,
      courseCode: enrollment.course.code,
      workloadHours: enrollment.course.workloadHours,
      startDate: formatDate(enrollment.startDate),
      subjects: enrollment.course.subjects || [],
    });
  };

  const handleExportLGPD = () => {
    const allGrades = enrollments.flatMap((e: any) => e.grades || []);
    const allInvoices = enrollments.flatMap((e: any) => e.invoices || []);
    generateStudentLGPDReportPDF({
      studentName: student.fullName,
      cpf: formatCPFDisplay(student.cpf),
      email: student.email,
      phone: formatPhone(student.phone),
      birthDate: formatDate(student.birthDate),
      address: `${student.street}, Nº ${student.number} - ${student.neighborhood}, ${student.city}/${student.state} (CEP: ${student.zipCode})`,
      enrollments: enrollments.map((en: any) => ({
        registrationNumber: en.registrationNumber,
        courseName: en.course?.name || 'Curso Regular',
        startDate: formatDate(en.startDate),
        status: en.status,
      })),
      gradesCount: allGrades.length,
      invoicesCount: allInvoices.length,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border bg-card text-card-foreground shadow-2xl p-6 transition-all my-8 max-h-[92vh] overflow-y-auto">
        {/* Cabeçalho do Aluno */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-xl shadow-xs">
              {student.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">{student.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {enrollments.length > 0 ? `${enrollments.length} Matrícula(s)` : 'Sem Matrícula'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                CPF: <span className="font-medium text-foreground">{formatCPFDisplay(student.cpf)}</span> • Cadastrado em {formatDate(student.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleExportLGPD}
              className="h-8 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-background hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors text-slate-700 dark:text-slate-300"
              title="Emitir Relatório de Dados Pessoais (LGPD Art. 18)"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Relatório LGPD (PDF)
            </button>
            {onEditStudent && (
              <button
                onClick={() => {
                  onClose();
                  onEditStudent(student);
                }}
                className="h-8 px-3 rounded-lg border bg-background hover:bg-accent text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Edit className="h-3.5 w-3.5" /> Editar Cadastro
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navegação por Abas no Próprio Perfil */}
        <div className="flex border-b mb-6 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('perfil')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'perfil'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="h-4 w-4" /> Dados Pessoais & Endereço
          </button>
          <button
            onClick={() => setActiveTab('boletim')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'boletim'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Award className="h-4 w-4" /> Boletim & Desempenho
          </button>
          <button
            onClick={() => setActiveTab('matriculas')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'matriculas'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <GraduationCap className="h-4 w-4" /> Cursos & Matrículas
          </button>
          <button
            onClick={() => setActiveTab('financeiro')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'financeiro'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <CreditCard className="h-4 w-4" /> Situação Financeira
          </button>
        </div>

        {/* Conteúdo Aba: Dados Pessoais & Endereço */}
        {activeTab === 'perfil' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Informações de Contato e Documentação
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl border bg-muted/20">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1.5 mb-1">
                    <Mail className="h-3.5 w-3.5 text-indigo-600" /> E-mail
                  </span>
                  <span className="text-xs font-semibold text-foreground break-all">{student.email}</span>
                </div>

                <div className="p-3.5 rounded-xl border bg-muted/20">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1.5 mb-1">
                    <Phone className="h-3.5 w-3.5 text-indigo-600" /> Telefone / WhatsApp
                  </span>
                  <span className="text-xs font-semibold text-foreground">{formatPhone(student.phone)}</span>
                </div>

                <div className="p-3.5 rounded-xl border bg-muted/20">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1.5 mb-1">
                    <Calendar className="h-3.5 w-3.5 text-indigo-600" /> Nascimento
                  </span>
                  <span className="text-xs font-semibold text-foreground">{formatDate(student.birthDate)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Endereço Residencial Cadastrado
              </h3>
              <div className="p-4 rounded-xl border bg-muted/20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block font-bold">Logradouro / Rua</span>
                  <span className="font-semibold text-foreground">
                    {student.street}, Nº {student.number}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-bold">Complemento</span>
                  <span className="font-semibold text-foreground">{student.complement || 'Não informado'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-bold">Bairro</span>
                  <span className="font-semibold text-foreground">{student.neighborhood}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-bold">Cidade / Estado</span>
                  <span className="font-semibold text-foreground">
                    {student.city} / {student.state}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-bold">CEP</span>
                  <span className="font-semibold text-foreground">{student.zipCode}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo Aba: Boletim & Desempenho */}
        {activeTab === 'boletim' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Resumo do Boletim Acadêmico</h3>
                <p className="text-xs text-muted-foreground">
                  Acompanhe as avaliações por matéria ou abra o gerenciador completo do boletim.
                </p>
              </div>
              {onOpenReport && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenReport(student);
                  }}
                  className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Award className="h-3.5 w-3.5" /> Abrir Gerenciador de Notas / Boletim
                </button>
              )}
            </div>

            {enrollments.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed text-center text-xs text-muted-foreground">
                Nenhuma matrícula registrada para exibir boletim.
              </div>
            ) : (
              enrollments.map((en: any) => {
                const grades = en.grades || [];
                const totalScore = grades.reduce((acc: number, g: any) => acc + (g.score || 0), 0);
                const avg = grades.length > 0 ? totalScore / grades.length : 0;
                const totalAbsences = grades.reduce((acc: number, g: any) => acc + (g.absences || 0), 0);

                return (
                  <div key={en.id} className="p-4 rounded-xl border bg-card space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                      <div>
                        <span className="font-bold text-sm text-foreground">{en.course?.name}</span>
                        <div className="text-xs text-muted-foreground">
                          Matrícula: <span className="font-mono">{en.registrationNumber}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground block">Média Atual</span>
                          <span className={`font-bold ${avg >= 7 ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {avg > 0 ? avg.toFixed(1) : '-'} / 10.0
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground block">Faltas</span>
                          <span className="font-bold text-foreground">{totalAbsences}</span>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b bg-muted/20 text-muted-foreground uppercase text-[10px]">
                            <th className="py-2 px-2">Disciplina</th>
                            <th className="py-2 px-2">Período</th>
                            <th className="py-2 px-2 text-center">Faltas</th>
                            <th className="py-2 px-2 text-center">Nota</th>
                            <th className="py-2 px-2 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {grades.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-4 text-center text-muted-foreground text-xs">
                                Nenhuma nota lançada para este curso ainda.
                              </td>
                            </tr>
                          ) : (
                            grades.map((g: any) => (
                              <tr key={g.id}>
                                <td className="py-2 px-2 font-medium">{g.subject?.name}</td>
                                <td className="py-2 px-2 text-muted-foreground">{g.term}</td>
                                <td className="py-2 px-2 text-center">{g.absences}</td>
                                <td className="py-2 px-2 text-center font-bold">
                                  <span
                                    className={`px-1.5 py-0.5 rounded ${
                                      g.score >= 7
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                    }`}
                                  >
                                    {g.score.toFixed(1)}
                                  </span>
                                </td>
                                <td className="py-2 px-2 text-center">
                                  <span
                                    className={`text-[11px] font-semibold ${
                                      g.score >= 7 ? 'text-emerald-600' : 'text-rose-600'
                                    }`}
                                  >
                                    {g.score >= 7 ? 'Aprovado' : 'Recuperação'}
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
              })
            )}
          </div>
        )}

        {/* Conteúdo Aba: Matrículas */}
        {activeTab === 'matriculas' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">Cursos e Matrículas Registradas</h3>
            {enrollments.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed text-center text-xs text-muted-foreground">
                Nenhuma matrícula registrada.
              </div>
            ) : (
              enrollments.map((en: any) => (
                <div key={en.id} className="p-4 rounded-xl border bg-card space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{en.course?.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {en.registrationNumber}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Início: {formatDate(en.startDate)} • Carga Horária: {en.course?.workloadHours} horas • {en.course?.durationMonths} meses
                      </p>
                    </div>

                    <button
                      onClick={() => handlePrintCertificate(en)}
                      className="h-8 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                    >
                      <FileText className="h-3.5 w-3.5" /> Comprovante de Matrícula (PDF)
                    </button>
                  </div>

                  {en.course?.subjects && (
                    <div className="border-t pt-2 mt-2">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase block mb-1.5">
                        Disciplinas da Grade ({en.course.subjects.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {en.course.subjects.map((sub: any) => (
                          <div key={sub.id} className="p-2 rounded-lg bg-muted/30 flex items-center justify-between">
                            <span className="font-medium text-foreground">{sub.name}</span>
                            <span className="text-muted-foreground text-[11px] font-mono">{sub.workloadHours}h</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Conteúdo Aba: Financeiro */}
        {activeTab === 'financeiro' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">Parcelas e Mensalidades</h3>
            {enrollments.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed text-center text-xs text-muted-foreground">
                Nenhum registro financeiro disponível.
              </div>
            ) : (
              enrollments.map((en: any) => (
                <div key={en.id} className="p-4 rounded-xl border bg-card space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <span className="font-bold text-xs text-foreground">{en.course?.name}</span>
                      <span className="text-[10px] text-muted-foreground ml-2 font-mono">
                        ({en.registrationNumber})
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Mensalidade Base: <strong className="text-foreground">{formatCurrency(en.course?.monthlyFee || 0)}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {en.invoices?.map((inv: any) => (
                      <div
                        key={inv.id}
                        className="p-2.5 rounded-lg border bg-background flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                          <span>Parcela {inv.installmentNumber}</span>
                          <span>{formatDate(inv.dueDate)}</span>
                        </div>
                        <span className="font-bold text-foreground mt-1">{formatCurrency(inv.amount)}</span>
                        <span
                          className={`mt-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md text-center ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : inv.status === 'OVERDUE'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}
                        >
                          {inv.status === 'PAID' ? 'PAGO' : inv.status === 'OVERDUE' ? 'ATRASADO' : 'PENDENTE'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
