'use server';

import { prisma } from '@/lib/db';
import { studentSchema } from '@/lib/validators/schemas';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function getStudents(query?: string) {
  try {
    const students = await prisma.student.findMany({
      where: query
        ? {
            OR: [
              { fullName: { contains: query } },
              { cpf: { contains: query } },
              { email: { contains: query } },
            ],
          }
        : undefined,
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                subjects: true,
              },
            },
            invoices: {
              orderBy: { installmentNumber: 'asc' },
            },
            grades: {
              include: {
                subject: true,
              },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: students };
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    return { success: false, error: 'Falha ao carregar lista de alunos.' };
  }
}

export async function getStudentById(id: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            course: {
              include: { subjects: true },
            },
            invoices: {
              orderBy: { installmentNumber: 'asc' },
            },
            grades: {
              include: { subject: true },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });
    return { success: true, data: student };
  } catch (error) {
    return { success: false, error: 'Aluno não encontrado.' };
  }
}

export async function createStudent(formData: unknown) {
  try {
    const validated = studentSchema.parse(formData);

    // Verificar se o CPF já existe
    const existing = await prisma.student.findUnique({
      where: { cpf: validated.cpf },
    });

    if (existing) {
      return { success: false, error: 'Este CPF já está cadastrado no sistema.' };
    }

    const student = await prisma.student.create({
      data: {
        ...validated,
        birthDate: new Date(validated.birthDate),
      },
    });

    revalidatePath('/alunos');
    return { success: true, data: student };
  } catch (error: any) {
    if (error?.errors) {
      return { success: false, error: error.errors[0]?.message || 'Dados inválidos.' };
    }
    return { success: false, error: 'Erro ao cadastrar aluno. Tente novamente.' };
  }
}

export async function updateStudent(id: string, formData: unknown) {
  try {
    const validated = studentSchema.parse(formData);

    // Verificar se o CPF pertence a outro aluno
    const existing = await prisma.student.findFirst({
      where: {
        cpf: validated.cpf,
        NOT: { id },
      },
    });

    if (existing) {
      return { success: false, error: 'Este CPF já está cadastrado para outro aluno.' };
    }

    const updated = await prisma.student.update({
      where: { id },
      data: {
        ...validated,
        birthDate: new Date(validated.birthDate),
      },
    });

    revalidatePath('/alunos');
    return { success: true, data: updated };
  } catch (error: any) {
    if (error?.errors) {
      return { success: false, error: error.errors[0]?.message || 'Dados inválidos.' };
    }
    return { success: false, error: 'Erro ao atualizar aluno.' };
  }
}

export async function deleteStudent(id: string) {
  try {
    await prisma.student.delete({ where: { id } });
    revalidatePath('/alunos');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Erro ao remover aluno.' };
  }
}

// ==================== GESTÃO DE NOTAS / BOLETIM ====================

const gradeInputSchema = z.object({
  enrollmentId: z.string().uuid(),
  subjectId: z.string().uuid(),
  term: z.string().min(1, 'Período/Módulo é obrigatório'),
  score: z.coerce.number().min(0).max(10, 'Nota deve ser entre 0 e 10'),
  maxScore: z.coerce.number().default(10),
  absences: z.coerce.number().min(0).default(0),
  feedback: z.string().optional(),
});

export async function addOrUpdateGrade(formData: unknown) {
  try {
    const validated = gradeInputSchema.parse(formData);

    const grade = await prisma.grade.create({
      data: {
        enrollmentId: validated.enrollmentId,
        subjectId: validated.subjectId,
        term: validated.term,
        score: validated.score,
        maxScore: validated.maxScore,
        absences: validated.absences,
        feedback: validated.feedback || null,
      },
    });

    revalidatePath('/alunos');
    return { success: true, data: grade };
  } catch (error: any) {
    if (error?.errors) {
      return { success: false, error: error.errors[0]?.message || 'Dados de nota inválidos.' };
    }
    return { success: false, error: 'Erro ao registrar nota do aluno.' };
  }
}

export async function deleteGrade(gradeId: string) {
  try {
    await prisma.grade.delete({
      where: { id: gradeId },
    });
    revalidatePath('/alunos');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Erro ao excluir nota.' };
  }
}
