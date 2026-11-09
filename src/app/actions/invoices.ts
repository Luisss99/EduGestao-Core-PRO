'use server';

import { prisma } from '@/lib/db';
import { paymentClearanceSchema } from '@/lib/validators/schemas';
import { computeInvoiceStatus } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function getInvoices(statusFilter?: 'ALL' | 'PENDING' | 'PAID' | 'OVERDUE') {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        enrollment: {
          include: {
            student: true,
            course: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Mapeamento dinâmico de status OVERDUE se dueDate < hoje
    const processed = invoices.map((inv) => {
      const computed = computeInvoiceStatus(inv.dueDate, inv.status);
      return {
        ...inv,
        status: computed as typeof inv.status,
      };
    });

    if (!statusFilter || statusFilter === 'ALL') {
      return { success: true, data: processed };
    }

    const filtered = processed.filter((inv) => inv.status === statusFilter);
    return { success: true, data: filtered };
  } catch (error) {
    return { success: false, error: 'Erro ao buscar mensalidades.' };
  }
}

export async function clearInvoicePayment(invoiceId: string, formData: unknown) {
  try {
    const validated = paymentClearanceSchema.parse(formData);

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
        paidAt: new Date(validated.paidAt),
        paymentMethod: validated.paymentMethod,
        receiptUrl: `/receipts/REC-${invoiceId.slice(0, 8)}.pdf`,
      },
      include: {
        enrollment: {
          include: { student: true, course: true },
        },
      },
    });

    revalidatePath('/financeiro');
    revalidatePath('/dashboard');
    return { success: true, data: invoice };
  } catch (error: any) {
    if (error?.errors) {
      return { success: false, error: error.errors[0]?.message || 'Dados inválidos.' };
    }
    return { success: false, error: 'Erro ao dar baixa no pagamento.' };
  }
}

export async function getDashboardMetrics() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // 1. Total Alunos Ativos
    const activeStudentsCount = await prisma.enrollment.count({
      where: { status: 'ACTIVE' },
    });

    // 2. Novas Matrículas no Mês
    const newEnrollmentsMonth = await prisma.enrollment.count({
      where: {
        createdAt: { gte: firstDayOfMonth },
      },
    });

    // 3. Faturas para cálculo de adimplência e inadimplência
    const allInvoices = await prisma.invoice.findMany({
      include: {
        enrollment: {
          include: { student: true, course: true },
        },
      },
    });

    let paidCount = 0;
    let overdueAmount = 0;
    let totalPaidAmount = 0;
    let totalForecastAmount = 0;

    allInvoices.forEach((inv) => {
      const computedStatus = computeInvoiceStatus(inv.dueDate, inv.status);
      if (computedStatus === 'PAID') {
        paidCount++;
        totalPaidAmount += inv.amount;
      } else if (computedStatus === 'OVERDUE') {
        overdueAmount += inv.amount;
      }
      totalForecastAmount += inv.amount;
    });

    const totalInvoices = allInvoices.length;
    const adimplenciaRate = totalInvoices > 0 ? (paidCount / totalInvoices) * 100 : 100;

    // Próximos vencimentos
    const upcomingInvoices = allInvoices
      .filter((inv) => computeInvoiceStatus(inv.dueDate, inv.status) === 'PENDING')
      .slice(0, 5);

    return {
      success: true,
      data: {
        activeStudentsCount,
        newEnrollmentsMonth,
        adimplenciaRate: Math.round(adimplenciaRate),
        overdueAmount,
        totalPaidAmount,
        totalForecastAmount,
        upcomingInvoices,
      },
    };
  } catch (error) {
    console.error('Erro nas métricas do dashboard:', error);
    return {
      success: false,
      data: {
        activeStudentsCount: 0,
        newEnrollmentsMonth: 0,
        adimplenciaRate: 0,
        overdueAmount: 0,
        totalPaidAmount: 0,
        totalForecastAmount: 0,
        upcomingInvoices: [],
      },
    };
  }
}
