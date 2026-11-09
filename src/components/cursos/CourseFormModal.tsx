'use me';
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema } from '@/lib/validators/schemas';
import { createCourse } from '@/app/actions/courses';
import { X, BookOpen, Loader2 } from 'lucide-react';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CourseFormModal({ isOpen, onClose, onSuccess }: CourseFormModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      workloadHours: 120,
      monthlyFee: 450,
      durationMonths: 6,
      active: true,
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: any) => {
    setServerError(null);
    const res = await createCourse(data);
    if (res.success) {
      reset();
      onSuccess();
      onClose();
    } else {
      setServerError(res.error || 'Erro ao criar curso.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border bg-card text-card-foreground shadow-2xl p-6 transition-all my-8">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-foreground">Cadastrar Novo Curso</h2>
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
            <label className="block font-semibold mb-1">Nome do Curso *</label>
            <input
              {...register('name')}
              placeholder="Ex: Engenharia de Software SaaS"
              className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && <p className="text-destructive text-[11px] mt-0.5">{errors.name.message as string}</p>}
          </div>

          <div>
            <label className="block font-semibold mb-1">Código do Curso (Único) *</label>
            <input
              {...register('code')}
              placeholder="Ex: ENG-2026"
              className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500 uppercase"
            />
            {errors.code && <p className="text-destructive text-[11px] mt-0.5">{errors.code.message as string}</p>}
          </div>

          <div>
            <label className="block font-semibold mb-1">Descrição do Curso *</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Descreva os objetivos acadêmicos..."
              className="w-full rounded-lg border bg-background p-3 focus:ring-2 focus:ring-indigo-500"
            />
            {errors.description && <p className="text-destructive text-[11px] mt-0.5">{errors.description.message as string}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1">Mensalidade (R$) *</label>
              <input
                {...register('monthlyFee')}
                type="number"
                step="0.01"
                className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Carga Horária (h) *</label>
              <input
                {...register('workloadHours')}
                type="number"
                className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Duração (Meses) *</label>
              <input
                {...register('durationMonths')}
                type="number"
                className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
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
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar Curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
