'use server';

import { prisma } from '@/lib/db';
import { enrollmentSchema } from '@/lib/validators/schemas';
import { generateRegistrationNumber } from '@/lib/enrollment-code';
import { revalidatePath } from 'next/cache';

export async function getEnrollments() {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: true,
        course: {
          include: { subjects: true },
        },
        invoices: {
          orderBy: { installmentNumber: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: enrollments };
  } catch (error) {
    return { success: false, error: 'Erro ao buscar matrículas.' };
  }
}

export async function createEnrollment(formData: unknown) {
  try {
    const validated = enrollmentSchema.parse(formData);

    const course = await prisma.course.findUnique({
      where: { id: validated.courseId },
    });

    if (!course) {
      return { success: false, error: 'Curso não encontrado.' };
    }

    // Gerar número de matrícula sequencial MAT-2026-XXXX
    const currentYear = new Date().getFullYear();
    const countYear = await prisma.enrollment.count({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`),
        },
      },
    });

    const registrationNumber = generateRegistrationNumber(countYear + 1, currentYear);
    const startDate = new Date(validated.startDate);

    // Transação Prisma para criar Matrícula e N Invoices correspondentes
    const result = await prisma.$transaction(async (tx) => {
      const enrollment = await tx.enrollment.create({
        data: {
          registrationNumber,
          studentId: validated.studentId,
          courseId: validated.courseId,
          startDate,
          status: 'ACTIVE',
        },
      });

      // Motor de Cobrança: Gerar N parcelas
      const invoicesData = [];
      for (let i = 1; i <= course.durationMonths; i++) {
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + i);

        // Barcode fictício estilo FEBRABAN
        const barcode = `34191.79001 ${Math.floor(10000 + Math.random() * 90000)}.${Math.floor(100000 + Math.random() * 900000)} ${Math.floor(10000 + Math.random() * 90000)}.${Math.floor(100000 + Math.random() * 900000)} 1 ${Math.floor(1000000000 + Math.random() * 9000000000)}`;

        invoicesData.push({
          enrollmentId: enrollment.id,
          installmentNumber: i,
          dueDate,
          amount: course.monthlyFee,
          status: 'PENDING' as const,
          barcode,
        });
      }

      await tx.invoice.createMany({
        data: invoicesData,
      });

      return enrollment;
    });

    revalidatePath('/matriculas');
    revalidatePath('/financeiro');
    revalidatePath('/dashboard');
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Erro ao efetuar matrícula:', error);
    if (error?.errors) {
      return { success: false, error: error.errors[0]?.message || 'Dados inválidos.' };
    }
    return { success: false, error: 'Falha ao processar matrícula.' };
  }
}

export async function updateEnrollmentStatus(
  enrollmentId: string,
  status: 'ACTIVE' | 'LOCKED' | 'COMPLETED' | 'CANCELED',
  cancellationReason?: string
) {
  try {
    const updated = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status,
        cancellationReason: status === 'CANCELED' ? cancellationReason : null,
      },
    });

    revalidatePath('/matriculas');
    revalidatePath('/dashboard');
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: 'Erro ao atualizar status da matrícula.' };
  }
}
