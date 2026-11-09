'use me';
'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { BookOpen, Plus, Clock, DollarSign, Layers, Trash2 } from 'lucide-react';
import { deleteSubject } from '@/app/actions/courses';

interface CourseListProps {
  courses: any[];
  onOpenNewCourse: () => void;
  onOpenNewSubject: (courseId: string, courseName: string) => void;
  onRefresh: () => void;
}

export function CourseList({ courses, onOpenNewCourse, onOpenNewSubject, onRefresh }: CourseListProps) {
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(
    courses.length > 0 ? courses[0].id : null
  );

  const handleDeleteSub = async (subId: string) => {
    if (confirm('Deseja remover esta disciplina do curso?')) {
      await deleteSubject(subId);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Gestão de Cursos & Disciplinas</h2>
          <p className="text-xs text-muted-foreground">
            Gerencie a grade curricular, mensalidades e carga horária acadêmica.
          </p>
        </div>

        <button
          onClick={onOpenNewCourse}
          className="h-9 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5 self-start"
        >
          <Plus className="h-4 w-4" /> Novo Curso
        </button>
      </div>

      {/* Master-Detail Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Lista de Cursos */}
        <div className="lg:col-span-5 space-y-3">
          {courses.map((course) => {
            const isSelected = expandedCourseId === course.id;
            return (
              <div
                key={course.id}
                onClick={() => setExpandedCourseId(course.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                    : 'bg-card hover:bg-muted/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-foreground">{course.name}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {course.code}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {course.description}
                </p>

                <div className="grid grid-cols-3 gap-2 text-[11px] pt-2 border-t">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Mensalidade</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(course.monthlyFee)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Carga Horária</span>
                    <span className="font-semibold text-foreground">{course.workloadHours}h</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Duração</span>
                    <span className="font-semibold text-foreground">{course.durationMonths} Meses</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Sub-lista de Disciplinas do Curso Selecionado */}
        <div className="lg:col-span-7">
          {(() => {
            const selectedCourse = courses.find((c) => c.id === expandedCourseId);
            if (!selectedCourse) {
              return (
                <div className="p-8 rounded-2xl border bg-card text-center text-xs text-muted-foreground">
                  Selecione um curso ao lado para visualizar e gerenciar suas disciplinas.
                </div>
              );
            }

            return (
              <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Disciplinas Vinculadas ao Curso
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{selectedCourse.name}</h3>
                  </div>

                  <button
                    onClick={() => onOpenNewSubject(selectedCourse.id, selectedCourse.name)}
                    className="h-8 px-3 rounded-lg border bg-background hover:bg-accent text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5 text-indigo-600" /> Add Disciplina
                  </button>
                </div>

                {selectedCourse.subjects.length === 0 ? (
                  <div className="py-12 border border-dashed rounded-xl text-center text-xs text-muted-foreground">
                    Nenhuma disciplina cadastrada para este curso ainda.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedCourse.subjects.map((sub: any) => (
                      <div key={sub.id} className="p-4 rounded-xl border bg-background space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-foreground">{sub.name}</h4>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-800">
                              {sub.workloadHours} horas
                            </span>
                            <button
                              onClick={() => handleDeleteSub(sub.id)}
                              className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                              title="Remover Disciplina"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          <strong className="text-foreground">Ementa:</strong> {sub.syllabus}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
