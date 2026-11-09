'use server';

import { prisma } from '@/lib/db';
import { courseSchema, subjectSchema } from '@/lib/validators/schemas';
import { revalidatePath } from 'next/cache';

export async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        subjects: true,
        enrollments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: courses };
  } catch (error) {
    return { success: false, error: 'Erro ao buscar cursos.' };
  }
}

export async function createCourse(formData: unknown) {
  try {
    const validated = courseSchema.parse(formData);

    const existingCode = await prisma.course.findUnique({
      where: { code: validated.code },
    });

    if (existingCode) {
      return { success: false, error: 'Já existe um curso com este código.' };
    }

    const course = await prisma.course.create({
      data: validated,
    });

    revalidatePath('/cursos');
    return { success: true, data: course };
  } catch (error: any) {
    if (error?.errors) {
      return { success: false, error: error.errors[0]?.message || 'Dados inválidos.' };
    }
    return { success: false, error: 'Erro ao criar curso.' };
  }
}

export async function createSubject(formData: unknown) {
  try {
    const validated = subjectSchema.parse(formData);

    const subject = await prisma.subject.create({
      data: validated,
    });

    revalidatePath('/cursos');
    return { success: true, data: subject };
  } catch (error: any) {
    if (error?.errors) {
      return { success: false, error: error.errors[0]?.message || 'Dados inválidos.' };
    }
    return { success: false, error: 'Erro ao adicionar disciplina.' };
  }
}

export async function deleteSubject(id: string) {
  try {
    await prisma.subject.delete({ where: { id } });
    revalidatePath('/cursos');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Erro ao remover disciplina.' };
  }
}
