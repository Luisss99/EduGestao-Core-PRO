'use me';
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subjectSchema } from '@/lib/validators/schemas';
import { createSubject } from '@/app/actions/courses';
import { X, Layers, Loader2 } from 'lucide-react';

interface SubjectFormModalProps {
  courseId: string;
  courseName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SubjectFormModal({ courseId, courseName, isOpen, onClose, onSuccess }: SubjectFormModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      courseId,
      name: '',
      workloadHours: 40,
      syllabus: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: any) => {
    setServerError(null);
    const res = await createSubject({ ...data, courseId });
    if (res.success) {
      reset();
      onSuccess();
      onClose();
    } else {
      setServerError(res.error || 'Erro ao adicionar disciplina.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl border bg-card text-card-foreground shadow-2xl p-6 transition-all my-8">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h2 className="text-sm font-bold text-foreground">Adicionar Disciplina</h2>
              <p className="text-[11px] text-muted-foreground">Curso: {courseName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Nome da Disciplina *</label>
            <input
              {...register('name')}
              placeholder="Ex: Arquitetura de Software SaaS"
              className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && <p className="text-destructive text-[11px] mt-0.5">{errors.name.message as string}</p>}
          </div>

          <div>
            <label className="block font-semibold mb-1">Carga Horária (horas) *</label>
            <input
              {...register('workloadHours')}
              type="number"
              className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500"
            />
            {errors.workloadHours && <p className="text-destructive text-[11px] mt-0.5">{errors.workloadHours.message as string}</p>}
          </div>

          <div>
            <label className="block font-semibold mb-1">Ementa / Conteúdo Programático *</label>
            <textarea
              {...register('syllabus')}
              rows={4}
              placeholder="Detalhamento dos módulos e tópicos..."
              className="w-full rounded-lg border bg-background p-3 focus:ring-2 focus:ring-indigo-500"
            />
            {errors.syllabus && <p className="text-destructive text-[11px] mt-0.5">{errors.syllabus.message as string}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-lg border bg-background hover:bg-accent font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Adicionar Disciplina'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
