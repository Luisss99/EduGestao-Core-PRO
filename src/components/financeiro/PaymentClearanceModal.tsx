'use me';
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentClearanceSchema } from '@/lib/validators/schemas';
import { clearInvoicePayment } from '@/app/actions/invoices';
import { generatePaymentReceiptPDF } from '@/lib/pdf-generator';
import { formatCurrency, formatDate } from '@/lib/utils';
import { X, DollarSign, Loader2, CheckCircle2 } from 'lucide-react';

interface PaymentClearanceModalProps {
  invoice: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentClearanceModal({ invoice, isOpen, onClose, onSuccess }: PaymentClearanceModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(paymentClearanceSchema),
    defaultValues: {
      paymentMethod: 'PIX',
      paidAt: new Date().toISOString().split('T')[0],
    },
  });

  if (!isOpen || !invoice) return null;

  const onSubmit = async (data: any) => {
    setServerError(null);
    const res = await clearInvoicePayment(invoice.id, data);
    if (res.success) {
      // Auto-gerar Recibo em PDF no momento da baixa
      generatePaymentReceiptPDF({
        receiptId: invoice.id.slice(0, 8).toUpperCase(),
        registrationNumber: invoice.enrollment?.registrationNumber || 'MAT-2026',
        studentName: invoice.enrollment?.student?.fullName || '',
        courseName: invoice.enrollment?.course?.name || '',
        installmentNumber: invoice.installmentNumber,
        amount: invoice.amount,
        dueDate: formatDate(invoice.dueDate),
        paidAt: formatDate(data.paidAt),
        paymentMethod: data.paymentMethod,
      });

      reset();
      onSuccess();
      onClose();
    } else {
      setServerError(res.error || 'Erro ao efetuar baixa do pagamento.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl border bg-card text-card-foreground shadow-2xl p-6 transition-all my-8">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-bold text-foreground">Dar Baixa Manual no Pagamento</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Invoice Summary */}
        <div className="p-3.5 rounded-xl bg-muted/40 text-xs space-y-1.5 mb-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Aluno:</span>
            <span className="font-bold text-foreground">{invoice.enrollment?.student?.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Matrícula:</span>
            <span className="font-bold text-indigo-600">{invoice.enrollment?.registrationNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Parcela:</span>
            <span className="font-semibold">Nº {invoice.installmentNumber}</span>
          </div>
          <div className="flex justify-between pt-1 border-t">
            <span className="text-muted-foreground font-semibold">Valor da Fatura:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {formatCurrency(invoice.amount)}
            </span>
          </div>
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Forma de Pagamento *</label>
            <select
              {...register('paymentMethod')}
              className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="PIX">PIX (Transferência Instantânea)</option>
              <option value="BOLETO">Boleto Bancário Quitado</option>
              <option value="CREDIT_CARD">Cartão de Crédito</option>
              <option value="CASH">Dinheiro / Espécie</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Data do Recebimento *</label>
            <input
              {...register('paidAt')}
              type="date"
              className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-emerald-500"
            />
            {errors.paidAt && <p className="text-destructive text-[11px] mt-0.5">{errors.paidAt.message as string}</p>}
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
              className="h-9 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Registrando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Confirmar & Emitir Recibo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
