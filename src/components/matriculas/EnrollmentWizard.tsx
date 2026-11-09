'use me';
'use client';

import React, { useState } from 'react';
import { formatCurrency, formatDate, formatCPFDisplay } from '@/lib/utils';
import { createEnrollment } from '@/app/actions/enrollments';
import { generateEnrollmentPDF } from '@/lib/pdf-generator';
import {
  GraduationCap,
  User,
  BookOpen,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  FileText,
} from 'lucide-react';

interface EnrollmentWizardProps {
  students: any[];
  courses: any[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function EnrollmentWizard({ students, courses, onSuccess, onCancel }: EnrollmentWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdEnrollment, setCreatedEnrollment] = useState<any | null>(null);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  const handleFinish = async () => {
    if (!selectedStudentId || !selectedCourseId || !startDate) return;

    setIsSubmitting(true);
    const res = await createEnrollment({
      studentId: selectedStudentId,
      courseId: selectedCourseId,
      startDate,
    });
    setIsSubmitting(false);

    if (res.success) {
      setCreatedEnrollment(res.data);
      setStep(4);
    } else {
      alert(res.error || 'Erro ao gerar matrícula.');
    }
  };

  const handlePrintPDF = () => {
    if (!createdEnrollment || !selectedStudent || !selectedCourse) return;
    generateEnrollmentPDF({
      registrationNumber: createdEnrollment.registrationNumber,
      studentName: selectedStudent.fullName,
      studentCpf: formatCPFDisplay(selectedStudent.cpf),
      studentEmail: selectedStudent.email,
      courseName: selectedCourse.name,
      courseCode: selectedCourse.code,
      workloadHours: selectedCourse.workloadHours,
      startDate: formatDate(startDate),
      subjects: selectedCourse.subjects || [],
    });
  };

  return (
    <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm">
      {/* Wizard Step Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[
            { num: 1, title: '1. Selecionar Aluno' },
            { num: 2, title: '2. Selecionar Curso' },
            { num: 3, title: '3. Condições & Faturas' },
            { num: 4, title: '4. Conclusão & PDF' },
          ].map((st, idx) => (
            <div key={st.num} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  step === st.num
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950'
                    : step > st.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > st.num ? <CheckCircle2 className="h-4 w-4" /> : st.num}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-muted-foreground">
                {st.title}
              </span>
              {idx < 3 && <ChevronRight className="h-4 w-4 text-muted-foreground hidden sm:block mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Selecionar Aluno */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-600" /> Passo 1: Selecione o Aluno
          </h3>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {students.map((st) => (
              <div
                key={st.id}
                onClick={() => setSelectedStudentId(st.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedStudentId === st.id
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-600 ring-1 ring-indigo-600/30'
                    : 'bg-background hover:bg-muted/40'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-foreground">{st.fullName}</div>
                  <div className="text-[11px] text-muted-foreground">
                    CPF: {formatCPFDisplay(st.cpf)} • E-mail: {st.email}
                  </div>
                </div>
                {selectedStudentId === st.id && <CheckCircle2 className="h-5 w-5 text-indigo-600" />}
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={onCancel}
              className="h-9 px-4 rounded-lg border bg-background hover:bg-accent text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              disabled={!selectedStudentId}
              onClick={() => setStep(2)}
              className="h-9 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold disabled:opacity-50 flex items-center gap-1"
            >
              Próximo Passo <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Selecionar Curso */}
      {step === 2 && (
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" /> Passo 2: Selecione o Curso Acadêmico
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
            {courses.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCourseId(c.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  selectedCourseId === c.id
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-600 ring-1 ring-indigo-600/30'
                    : 'bg-background hover:bg-muted/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-foreground">{c.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {c.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{c.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t flex justify-between text-[11px] font-semibold">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(c.monthlyFee)}/mês
                  </span>
                  <span className="text-muted-foreground">{c.durationMonths} Meses</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={() => setStep(1)}
              className="h-9 px-4 rounded-lg border bg-background hover:bg-accent text-xs font-semibold flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Voltar
            </button>
            <button
              disabled={!selectedCourseId}
              onClick={() => setStep(3)}
              className="h-9 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold disabled:opacity-50 flex items-center gap-1"
            >
              Próximo Passo <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmar Condições & Gerar Faturas */}
      {step === 3 && selectedStudent && selectedCourse && (
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-indigo-600" /> Passo 3: Confirmar Condições Financeiras
          </h3>

          <div className="p-4 rounded-xl border bg-muted/30 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2 border-b pb-3">
              <div>
                <span className="text-muted-foreground block text-[10px]">Aluno Selecionado</span>
                <span className="font-bold text-foreground">{selectedStudent.fullName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Curso Escolhido</span>
                <span className="font-bold text-foreground">{selectedCourse.name}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <div>
                <span className="text-muted-foreground block text-[10px]">Mensalidade</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(selectedCourse.monthlyFee)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Duração em Parcelas</span>
                <span className="font-bold text-foreground">{selectedCourse.durationMonths}x Parcelas</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Total do Contrato</span>
                <span className="font-bold text-foreground">
                  {formatCurrency(selectedCourse.monthlyFee * selectedCourse.durationMonths)}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 mt-2">Data de Início da Matrícula *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500 text-xs"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                As faturas mensais ({selectedCourse.durationMonths} parcelas) serão geradas automaticamente a partir desta data.
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={() => setStep(2)}
              className="h-9 px-4 rounded-lg border bg-background hover:bg-accent text-xs font-semibold flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Voltar
            </button>
            <button
              disabled={isSubmitting}
              onClick={handleFinish}
              className="h-9 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processando...
                </>
              ) : (
                'Gerar Matrícula & Faturas'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Conclusão & Emissão do Comprovante PDF */}
      {step === 4 && createdEnrollment && (
        <div className="max-w-xl mx-auto text-center space-y-4 py-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground">Matrícula Realizada com Sucesso!</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Código de Registro da Matrícula Gerado:
            </p>
            <div className="mt-2 inline-block px-4 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-lg tracking-wider">
              {createdEnrollment.registrationNumber}
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed px-4">
            Foram geradas {selectedCourse?.durationMonths} parcelas mensais na conta do aluno. Você pode emitir agora o comprovante oficial de matrícula em PDF.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handlePrintPDF}
              className="w-full sm:w-auto h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4" /> Emitir Comprovante em PDF
            </button>

            <button
              onClick={() => {
                onSuccess();
              }}
              className="w-full sm:w-auto h-10 px-5 rounded-xl border bg-background hover:bg-accent text-xs font-semibold transition-colors"
            >
              Concluir e Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
