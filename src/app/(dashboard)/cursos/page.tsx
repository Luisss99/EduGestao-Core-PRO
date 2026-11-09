'use me';
'use client';

import React, { useEffect, useState } from 'react';
import { getCourses } from '@/app/actions/courses';
import { CourseList } from '@/components/cursos/CourseList';
import { CourseFormModal } from '@/components/cursos/CourseFormModal';
import { SubjectFormModal } from '@/components/cursos/SubjectFormModal';
import { Loader2 } from 'lucide-react';

export default function CursosPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [subjectModalData, setSubjectModalData] = useState<{
    courseId: string;
    courseName: string;
  } | null>(null);

  const fetchCoursesData = async () => {
    setLoading(true);
    const res = await getCourses();
    if (res.success) {
      setCourses(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoursesData();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <CourseList
          courses={courses}
          onOpenNewCourse={() => setIsCourseModalOpen(true)}
          onOpenNewSubject={(courseId, courseName) =>
            setSubjectModalData({ courseId, courseName })
          }
          onRefresh={fetchCoursesData}
        />
      )}

      <CourseFormModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSuccess={fetchCoursesData}
      />

      {subjectModalData && (
        <SubjectFormModal
          courseId={subjectModalData.courseId}
          courseName={subjectModalData.courseName}
          isOpen={!!subjectModalData}
          onClose={() => setSubjectModalData(null)}
          onSuccess={fetchCoursesData}
        />
      )}
    </div>
  );
}
