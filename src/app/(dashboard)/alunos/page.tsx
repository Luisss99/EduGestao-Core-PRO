'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { getStudents } from '@/app/actions/students';
import { StudentTable } from '@/components/alunos/StudentTable';
import { StudentFormModal } from '@/components/alunos/StudentFormModal';
import { StudentDetailsModal } from '@/components/alunos/StudentDetailsModal';
import { StudentReportModal } from '@/components/alunos/StudentReportModal';
import {
  Users,
  Plus,
  Loader2,
  GraduationCap,
  Award
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function AlunosContent() {
  const searchParams = useSearchParams();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de Modais
  const [isFormOpen, setIsFormOpen] = useState(searchParams.get('new') === 'true');
  const [studentToEdit, setStudentToEdit] = useState<any | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [studentForReport, setStudentForReport] = useState<any | null>(null);

  const fetchStudentsData = async () => {
    setLoading(true);
    const res = await getStudents();
    if (res.success) {
      setStudents(res.data || []);
      if (selectedStudent) {
        const updatedSelected = res.data?.find((s: any) => s.id === selectedStudent.id);
        if (updatedSelected) setSelectedStudent(updatedSelected);
      }
      if (studentForReport) {
        const updatedReportStudent = res.data?.find((s: any) => s.id === studentForReport.id);
        if (updatedReportStudent) setStudentForReport(updatedReportStudent);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudentsData();
  }, []);

  const totalStudents = students.length;
  const activeEnrolledCount = students.filter((s) =>
    s.enrollments.some((e: any) => e.status === 'ACTIVE')
  ).length;

  const allGrades = students.flatMap((s) =>
    s.enrollments.flatMap((e: any) => e.grades || [])
  );
  const overallAvg =
    allGrades.length > 0
      ? (allGrades.reduce((acc: number, g: any) => acc + g.score, 0) / allGrades.length).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6">
      {/* Cabeçalho Superior com Estatísticas Rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Gestão de Alunos & Boletins</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Acesse fichas cadastrais, acompanhe e emita boletins escolares com notas e faltas.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setStudentToEdit(null);
              setIsFormOpen(true);
            }}
            className="h-9 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5 self-start"
          >
            <Plus className="h-4 w-4" /> Novo Aluno
          </button>
        </div>
      </div>

      {/* Cards de Métricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border bg-card text-card-foreground shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-medium block">Total de Alunos</span>
            <span className="text-2xl font-black text-foreground mt-0.5 block">{totalStudents}</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border bg-card text-card-foreground shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-medium block">Com Matrícula Ativa</span>
            <span className="text-2xl font-black text-emerald-600 mt-0.5 block">{activeEnrolledCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <GraduationCap className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border bg-card text-card-foreground shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-medium block">Média Geral Acadêmica</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-foreground">{overallAvg}</span>
              <span className="text-xs text-muted-foreground">/ 10</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Award className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Tabela de Gestão de Alunos */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <StudentTable
          students={students}
          onSelectStudent={(st) => setSelectedStudent(st)}
          onEditStudent={(st) => {
            setStudentToEdit(st);
            setIsFormOpen(true);
          }}
          onOpenReport={(st) => setStudentForReport(st)}
          onRefresh={fetchStudentsData}
        />
      )}

      {/* Modal 1: Cadastro / Edição do Aluno */}
      <StudentFormModal
        isOpen={isFormOpen}
        studentToEdit={studentToEdit}
        onClose={() => {
          setIsFormOpen(false);
          setStudentToEdit(null);
        }}
        onSuccess={fetchStudentsData}
      />

      {/* Modal 2: Visualização Detalhada 360º (Perfil, Matrículas, Boletim e Financeiro) */}
      <StudentDetailsModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onOpenReport={(st) => {
          setSelectedStudent(null);
          setStudentForReport(st);
        }}
        onEditStudent={(st) => {
          setSelectedStudent(null);
          setStudentToEdit(st);
          setIsFormOpen(true);
        }}
      />

      {/* Modal 3: Gerenciamento do Boletim Escolar (Notas, Faltas e Emissão PDF) */}
      <StudentReportModal
        student={studentForReport}
        isOpen={!!studentForReport}
        onClose={() => setStudentForReport(null)}
        onRefresh={fetchStudentsData}
      />
    </div>
  );
}

export default function AlunosPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <AlunosContent />
    </Suspense>
  );
}
