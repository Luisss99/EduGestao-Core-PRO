'use client';

import React, { useState } from 'react';
import { X, Award, Printer, Plus, Trash2, BookOpen, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { formatCPFDisplay, formatDate } from '@/lib/utils';
import { generateReportCardPDF } from '@/lib/pdf-generator';
import { addOrUpdateGrade, deleteGrade } from '@/app/actions/students';

interface StudentReportModalProps {
  student: any | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export function StudentReportModal({
  student,
  isOpen,
  onClose,
  onRefresh,
}: StudentReportModalProps) {
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string>('');
  const [isAddingGrade, setIsAddingGrade] = useState(false);
  const [subjectId, setSubjectId] = useState('');
  const [term, setTerm] = useState('1º Módulo');
  const [score, setScore] = useState('');
  const [absences, setAbsences] = useState('0');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !student) return null;

  const enrollments = student.enrollments || [];
  const currentEnrollment =
    enrollments.find((e: any) => e.id === selectedEnrollmentId) || enrollments[0];

  const grades = currentEnrollment?.grades || [];
  const subjects = currentEnrollment?.course?.subjects || [];

  // Cálculos do Boletim
  const totalScores = grades.reduce((acc: number, g: any) => acc + (g.score || 0), 0);
  const overallAverage = grades.length > 0 ? totalScores / grades.length : 0;
  const totalAbsences = grades.reduce((acc: number, g: any) => acc + (g.absences || 0), 0);
  const isApproved = overallAverage >= 7.0;

  const handlePrint = () => {
    if (!currentEnrollment) return;

    generateReportCardPDF({
      studentName: student.fullName,
      studentCpf: formatCPFDisplay(student.cpf),
      studentEmail: student.email,
      registrationNumber: currentEnrollment.registrationNumber,
      courseName: currentEnrollment.course?.name || 'Curso Regular',
      courseCode: currentEnrollment.course?.code || 'CUR-01',
      startDate: formatDate(currentEnrollment.startDate),
      grades: grades.map((g: any) => ({
        subjectName: g.subject?.name || 'Disciplina',
        workloadHours: g.subject?.workloadHours || 40,
        term: g.term || '1º Período',
        score: g.score,
        maxScore: g.maxScore || 10,
        absences: g.absences || 0,
        feedback: g.feedback,
      })),
      overallAverage,
      totalAbsences,
      status: isApproved ? 'APROVADO' : 'EM RECUPERAÇÃO',
    });
  };

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEnrollment || !subjectId) {
      setErrorMsg('Selecione uma disciplina.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const res = await addOrUpdateGrade({
      enrollmentId: currentEnrollment.id,
      subjectId,
      term,
      score: parseFloat(score),
      maxScore: 10,
      absences: parseInt(absences, 10) || 0,
      feedback,
    });

    setSaving(false);
    if (res.success) {
      setIsAddingGrade(false);
      setScore('');
      setAbsences('0');
      setFeedback('');
      if (onRefresh) onRefresh();
    } else {
      setErrorMsg(res.error || 'Erro ao registrar nota.');
    }
  };

  const handleDeleteGrade = async (gradeId: string) => {
    if (confirm('Deseja excluir este registro de nota?')) {
      await deleteGrade(gradeId);
      if (onRefresh) onRefresh();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border bg-card text-card-foreground shadow-2xl p-6 transition-all my-8 max-h-[92vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">Boletim Escolar & Notas</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {student.fullName}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                CPF: {formatCPFDisplay(student.cpf)} • Acompanhamento de notas, faltas e emissão em PDF.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={!currentEnrollment || grades.length === 0}
              className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              title="Baixar Boletim em PDF"
            >
              <Printer className="h-3.5 w-3.5" /> Baixar Boletim (PDF)
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Seleção de Curso/Matrícula se houver mais de uma */}
        {enrollments.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed text-center">
            <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">Nenhuma matrícula registrada</p>
            <p className="text-xs text-muted-foreground mt-1">
              Este aluno ainda não está matriculado em nenhum curso. Matricule o aluno para lançar notas no boletim.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {enrollments.length > 1 && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 text-xs">
                <span className="font-semibold text-muted-foreground">Selecione o Curso/Matrícula:</span>
                <select
                  value={currentEnrollment?.id}
                  onChange={(e) => setSelectedEnrollmentId(e.target.value)}
                  className="h-8 rounded-md border bg-background px-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                >
                  {enrollments.map((en: any) => (
                    <option key={en.id} value={en.id}>
                      {en.course?.name} ({en.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Painel com Métricas de Desempenho do Aluno */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border bg-card">
                <span className="text-[11px] font-semibold text-muted-foreground block">Curso Matriculado</span>
                <span className="text-sm font-bold text-foreground line-clamp-1">
                  {currentEnrollment?.course?.name}
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">
                  {currentEnrollment?.registrationNumber}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border bg-card">
                <span className="text-[11px] font-semibold text-muted-foreground block">Média Geral</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span
                    className={`text-xl font-extrabold ${
                      overallAverage >= 7 ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {overallAverage > 0 ? overallAverage.toFixed(1) : '-'}
                  </span>
                  <span className="text-xs text-muted-foreground">/ 10.0</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border bg-card">
                <span className="text-[11px] font-semibold text-muted-foreground block">Total de Faltas</span>
                <span className="text-xl font-extrabold text-foreground mt-0.5 block">
                  {totalAbsences} <span className="text-xs font-normal text-muted-foreground">horas/aulas</span>
                </span>
              </div>

              <div className="p-3.5 rounded-xl border bg-card">
                <span className="text-[11px] font-semibold text-muted-foreground block">Status Acadêmico</span>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      grades.length === 0
                        ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        : isApproved
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {grades.length === 0 ? 'Sem Notas' : isApproved ? '✓ Aprovado' : '⚠ Em Recuperação'}
                  </span>
                </div>
              </div>
            </div>

            {/* Ações e Tabela de Notas */}
            <div className="p-4 rounded-xl border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                  Disciplinas e Notas Lançadas ({grades.length})
                </h3>

                <button
                  onClick={() => setIsAddingGrade(!isAddingGrade)}
                  className="h-8 px-3 rounded-lg border bg-background hover:bg-accent text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> {isAddingGrade ? 'Cancelar' : 'Lançar Nota'}
                </button>
              </div>

              {/* Formulário para Inserir Nota */}
              {isAddingGrade && (
                <form
                  onSubmit={handleAddGrade}
                  className="p-3.5 rounded-lg border bg-muted/30 space-y-3 text-xs"
                >
                  <div className="font-semibold text-foreground">Novo Lançamento no Boletim</div>
                  {errorMsg && (
                    <div className="p-2 rounded bg-destructive/10 text-destructive text-[11px]">
                      {errorMsg}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold mb-1">Disciplina *</label>
                      <select
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                        required
                        className="w-full h-8 rounded-md border bg-background px-2 text-xs"
                      >
                        <option value="">Selecione a disciplina...</option>
                        {subjects.map((s: any) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.workloadHours}h)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold mb-1">Período / Módulo *</label>
                      <input
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        placeholder="Ex: 1º Módulo"
                        required
                        className="w-full h-8 rounded-md border bg-background px-2 text-xs"
                      >
                      </input>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Nota (0 a 10) *</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={score}
                          onChange={(e) => setScore(e.target.value)}
                          placeholder="8.5"
                          required
                          className="w-full h-8 rounded-md border bg-background px-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Faltas</label>
                        <input
                          type="number"
                          min="0"
                          value={absences}
                          onChange={(e) => setAbsences(e.target.value)}
                          className="w-full h-8 rounded-md border bg-background px-2 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1">
                      Parecer do Professor / Observação
                    </label>
                    <input
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Ex: Ótimo desempenho nas atividades avaliativas..."
                      className="w-full h-8 rounded-md border bg-background px-2 text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingGrade(false)}
                      className="h-7 px-3 rounded border bg-background text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="h-7 px-4 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
                    >
                      {saving ? 'Gravando...' : 'Salvar Nota'}
                    </button>
                  </div>
                </form>
              )}

              {/* Tabela de Notas */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b bg-muted/40 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Disciplina</th>
                      <th className="py-2.5 px-3">Período</th>
                      <th className="py-2.5 px-3 text-center">Faltas</th>
                      <th className="py-2.5 px-3 text-center">Nota</th>
                      <th className="py-2.5 px-3 text-center">Situação</th>
                      <th className="py-2.5 px-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {grades.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-muted-foreground">
                          Nenhuma nota lançada ainda para este curso. Clique em "Lançar Nota" acima.
                        </td>
                      </tr>
                    ) : (
                      grades.map((g: any) => (
                        <tr key={g.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-foreground">
                            {g.subject?.name}
                            {g.feedback && (
                              <p className="text-[11px] text-muted-foreground font-normal italic">
                                "{g.feedback}"
                              </p>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">{g.term}</td>
                          <td className="py-2.5 px-3 text-center font-medium">{g.absences}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`font-bold px-2 py-0.5 rounded text-xs ${
                                g.score >= 7.0
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}
                            >
                              {g.score.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`text-[11px] font-semibold ${
                                g.score >= 7.0 ? 'text-emerald-600' : 'text-rose-600'
                              }`}
                            >
                              {g.score >= 7.0 ? 'Aprovado' : 'Recuperação'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => handleDeleteGrade(g.id)}
                              className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              title="Remover Nota"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

