'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { getEnrollments } from '@/app/actions/enrollments';
import { getStudents } from '@/app/actions/students';
import { getCourses } from '@/app/actions/courses';
import { EnrollmentList } from '@/components/matriculas/EnrollmentList';
import { EnrollmentWizard } from '@/components/matriculas/EnrollmentWizard';
import { GraduationCap, Plus, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function MatriculasContent() {
  const searchParams = useSearchParams();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWizardMode, setIsWizardMode] = useState(
    searchParams.get('new') === 'true'
  );

  const loadData = async () => {
    setLoading(true);
    const [enRes, stRes, crRes] = await Promise.all([
      getEnrollments(),
      getStudents(),
      getCourses(),
    ]);

    if (enRes.success) setEnrollments(enRes.data || []);
    if (stRes.success) setStudents(stRes.data || []);
    if (crRes.success) setCourses(crRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-bold text-foreground">Gestão de Matrículas</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Efetue matrículas sequenciais, altere status e emita comprovantes oficiais em PDF.
          </p>
        </div>

        {!isWizardMode && (
          <button
            onClick={() => setIsWizardMode(true)}
            className="h-9 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5 self-start"
          >
            <Plus className="h-4 w-4" /> Nova Matrícula (Wizard)
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : isWizardMode ? (
        <EnrollmentWizard
          students={students}
          courses={courses}
          onSuccess={() => {
            setIsWizardMode(false);
            loadData();
          }}
          onCancel={() => setIsWizardMode(false)}
        />
      ) : (
        <EnrollmentList
          enrollments={enrollments}
          onOpenNew={() => setIsWizardMode(true)}
          onRefresh={loadData}
        />
      )}
    </div>
  );
}

export default function MatriculasPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <MatriculasContent />
    </Suspense>
  );
}
