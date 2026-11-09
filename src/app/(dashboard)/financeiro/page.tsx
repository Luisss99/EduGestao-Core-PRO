'use me';
'use client';

import React, { useEffect, useState } from 'react';
import { getInvoices } from '@/app/actions/invoices';
import { InvoiceTable } from '@/components/financeiro/InvoiceTable';
import { PaymentClearanceModal } from '@/components/financeiro/PaymentClearanceModal';
import { DollarSign, Loader2 } from 'lucide-react';

export default function FinanceiroPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const fetchInvoicesData = async () => {
    setLoading(true);
    const res = await getInvoices('ALL');
    if (res.success) {
      setInvoices(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoicesData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <h1 className="text-xl font-bold text-foreground">Módulo Financeiro & Mensalidades</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Controle de contas a receber, baixa manual de faturas, inadimplência e emissão de recibos digitais.
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <InvoiceTable
          invoices={invoices}
          onOpenClearance={(inv) => setSelectedInvoice(inv)}
        />
      )}

      <PaymentClearanceModal
        invoice={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onSuccess={fetchInvoicesData}
      />
    </div>
  );
}
