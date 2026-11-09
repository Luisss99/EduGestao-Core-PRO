import { jsPDF } from 'jspdf';

export interface EnrollmentPDFData {
  registrationNumber: string;
  studentName: string;
  studentCpf: string;
  studentEmail: string;
  courseName: string;
  courseCode: string;
  workloadHours: number;
  startDate: string;
  subjects: { name: string; workloadHours: number }[];
}

export interface PaymentReceiptPDFData {
  receiptId: string;
  registrationNumber: string;
  studentName: string;
  courseName: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  paidAt: string;
  paymentMethod: string;
}

export interface ReportCardPDFData {
  studentName: string;
  studentCpf: string;
  studentEmail: string;
  registrationNumber: string;
  courseName: string;
  courseCode: string;
  startDate: string;
  grades: {
    subjectName: string;
    workloadHours: number;
    term: string;
    score: number;
    maxScore: number;
    absences: number;
    feedback?: string | null;
  }[];
  overallAverage: number;
  totalAbsences: number;
  status: string;
}

export function generateEnrollmentPDF(data: EnrollmentPDFData) {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(79, 70, 229); // Primary Indigo
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('ACADEMIA TECH - GESTÃO ESCOLAR', 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('COMPROVANTE OFICIAL DE MATRÍCULA', 14, 27);

  // Registration Badge
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(140, 10, 56, 16, 2, 2, 'F');
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('MATRÍCULA Nº', 144, 17);
  doc.setFontSize(11);
  doc.setTextColor(79, 70, 229);
  doc.text(data.registrationNumber, 144, 23);

  // Student Section
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('1. DADOS DO ALUNO', 14, 45);

  doc.setLineWidth(0.5);
  doc.setDrawColor(229, 231, 235);
  doc.line(14, 47, 196, 47);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Nome Completo:', 14, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(data.studentName, 50, 55);

  doc.setFont('helvetica', 'bold');
  doc.text('CPF:', 14, 62);
  doc.setFont('helvetica', 'normal');
  doc.text(data.studentCpf, 50, 62);

  doc.setFont('helvetica', 'bold');
  doc.text('E-mail:', 14, 69);
  doc.setFont('helvetica', 'normal');
  doc.text(data.studentEmail, 50, 69);

  // Course Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('2. DADOS DO CURSO', 14, 84);
  doc.line(14, 86, 196, 86);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Curso:', 14, 94);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.courseName} (${data.courseCode})`, 50, 94);

  doc.setFont('helvetica', 'bold');
  doc.text('Carga Horária Total:', 14, 101);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.workloadHours} horas`, 58, 101);

  doc.setFont('helvetica', 'bold');
  doc.text('Data de Início:', 14, 108);
  doc.setFont('helvetica', 'normal');
  doc.text(data.startDate, 50, 108);

  // Subjects Section Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('3. GRADE CURRICULAR DE DISCIPLINAS', 14, 123);
  doc.line(14, 125, 196, 125);

  // Table Header
  doc.setFillColor(243, 244, 246);
  doc.rect(14, 130, 182, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('DISCIPLINA', 18, 135);
  doc.text('CARGA HORÁRIA', 150, 135);

  let y = 144;
  data.subjects.forEach((sub, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(14, y - 5, 182, 8, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.text(sub.name, 18, y);
    doc.text(`${sub.workloadHours}h`, 150, y);
    y += 8;
  });

  // Footer / Authentication
  const footerY = 265;
  doc.setLineWidth(0.5);
  doc.setDrawColor(209, 213, 219);
  doc.line(14, footerY, 196, footerY);

  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text('Documento gerado eletronicamente pelo Sistema de Gestão Escolar SaaS.', 14, footerY + 6);
  doc.text(`Autenticação Digital: ETH-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now()}`, 14, footerY + 11);

  doc.save(`Comprovante_Matricula_${data.registrationNumber}.pdf`);
}

export function generatePaymentReceiptPDF(data: PaymentReceiptPDFData) {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(16, 185, 129); // Emerald Green
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('RECIBO DE PAGAMENTO', 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('COMPROVANTE OFICIAL DE QUITAÇÃO', 14, 27);

  // Amount Highlight
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(135, 8, 61, 18, 2, 2, 'F');
  doc.setTextColor(6, 95, 70);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('VALOR PAGO', 140, 15);
  doc.setFontSize(13);
  doc.text(`R$ ${data.amount.toFixed(2).replace('.', ',')}`, 140, 22);

  // Content
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(10);

  const startY = 48;
  doc.setFont('helvetica', 'bold');
  doc.text('Recebemos de:', 14, startY);
  doc.setFont('helvetica', 'normal');
  doc.text(data.studentName, 55, startY);

  doc.setFont('helvetica', 'bold');
  doc.text('Matrícula / Contrato:', 14, startY + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(data.registrationNumber, 55, startY + 8);

  doc.setFont('helvetica', 'bold');
  doc.text('Referente a:', 14, startY + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(`Mensalidade Parcela ${data.installmentNumber} - Curso: ${data.courseName}`, 55, startY + 16);

  doc.setFont('helvetica', 'bold');
  doc.text('Data de Vencimento:', 14, startY + 24);
  doc.setFont('helvetica', 'normal');
  doc.text(data.dueDate, 55, startY + 24);

  doc.setFont('helvetica', 'bold');
  doc.text('Data do Pagamento:', 14, startY + 32);
  doc.setFont('helvetica', 'normal');
  doc.text(data.paidAt, 55, startY + 32);

  doc.setFont('helvetica', 'bold');
  doc.text('Forma de Pagamento:', 14, startY + 40);
  doc.setFont('helvetica', 'normal');
  doc.text(data.paymentMethod, 55, startY + 40);

  // Verification Box
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(14, startY + 52, 182, 28, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(55, 65, 81);
  doc.text('AUTENTICAÇÃO ELETRÔNICA DO SISTEMA', 20, startY + 60);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(`ID da Transação: REC-${data.receiptId}`, 20, startY + 67);
  doc.text(`Hash de Validação: 0x${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`, 20, startY + 73);

  // Signatures
  doc.setLineWidth(0.5);
  doc.setDrawColor(156, 163, 175);
  doc.line(120, startY + 115, 185, startY + 115);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text('Departamento Financeiro', 125, startY + 120);

  doc.save(`Recibo_Pagamento_${data.registrationNumber}_P${data.installmentNumber}.pdf`);
}

export function generateReportCardPDF(data: ReportCardPDFData) {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(79, 70, 229); // Indigo
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ACADEMIA TECH - BOLETIM ESCOLAR OFICIAL', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Desempenho Acadêmico e Registro de Frequência`, 14, 26);

  // Badge Matrícula
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(138, 8, 58, 16, 2, 2, 'F');
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('MATRÍCULA', 142, 14);
  doc.setFontSize(10);
  doc.setTextColor(79, 70, 229);
  doc.text(data.registrationNumber, 142, 20);

  // Informações do Aluno e Curso
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO ALUNO E MATRÍCULA', 14, 44);

  doc.setLineWidth(0.5);
  doc.setDrawColor(229, 231, 235);
  doc.line(14, 46, 196, 46);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Aluno(a):', 14, 53);
  doc.setFont('helvetica', 'normal');
  doc.text(data.studentName, 40, 53);

  doc.setFont('helvetica', 'bold');
  doc.text('CPF:', 120, 53);
  doc.setFont('helvetica', 'normal');
  doc.text(data.studentCpf, 135, 53);

  doc.setFont('helvetica', 'bold');
  doc.text('Curso:', 14, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.courseName} (${data.courseCode})`, 40, 60);

  doc.setFont('helvetica', 'bold');
  doc.text('Início:', 120, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(data.startDate, 135, 60);

  // Tabela de Notas e Faltas
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('AVALIAÇÃO POR DISCIPLINA', 14, 76);
  doc.line(14, 78, 196, 78);

  // Cabeçalho da Tabela
  doc.setFillColor(243, 244, 246);
  doc.rect(14, 83, 182, 8, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(55, 65, 81);
  doc.text('DISCIPLINA', 18, 88);
  doc.text('PERÍODO', 105, 88);
  doc.text('CARGA', 130, 88);
  doc.text('FALTAS', 150, 88);
  doc.text('NOTA', 170, 88);
  doc.text('STATUS', 184, 88);

  let y = 97;
  data.grades.forEach((g, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(14, y - 5, 182, 8, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(17, 24, 39);

    // Truncar nome se muito longo
    const displayName = g.subjectName.length > 45 ? g.subjectName.substring(0, 42) + '...' : g.subjectName;
    doc.text(displayName, 18, y);
    doc.text(g.term, 105, y);
    doc.text(`${g.workloadHours}h`, 130, y);
    doc.text(g.absences.toString(), 154, y);

    // Cor da nota
    const isPassing = g.score >= 7.0;
    doc.setFont('helvetica', 'bold');
    if (isPassing) {
      doc.setTextColor(16, 185, 129); // verde
    } else {
      doc.setTextColor(220, 38, 38); // vermelho
    }
    doc.text(g.score.toFixed(1), 170, y);

    doc.setFontSize(7);
    doc.text(isPassing ? 'APROV.' : 'RECUP.', 184, y);
    y += 8;
  });

  // Resumo Geral / Média Geral
  y += 6;
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(14, y, 182, 24, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(79, 70, 229);
  doc.text('RESUMO GERAL DO ALUNO', 20, y + 8);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(31, 41, 55);
  doc.text(`Média Geral: `, 20, y + 17);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.overallAverage.toFixed(2)} / 10.0`, 45, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.text(`Total de Faltas: `, 85, y + 17);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.totalAbsences} faltas`, 112, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.text(`Situação Global: `, 145, y + 17);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(data.overallAverage >= 7.0 ? 16 : 220, data.overallAverage >= 7.0 ? 185 : 38, 38);
  doc.text(data.status, 172, y + 17);

  // Assinatura e Autenticação
  const footerY = 260;
  doc.setLineWidth(0.5);
  doc.setDrawColor(209, 213, 219);
  doc.line(14, footerY, 196, footerY);

  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'normal');
  doc.text('Boletim emitido conforme registro no banco de dados da instituição.', 14, footerY + 6);
  doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')} | Código: BOL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`, 14, footerY + 11);

  // Linhas de assinatura
  doc.line(25, footerY - 18, 85, footerY - 18);
  doc.text('Coordenação Pedagógica', 35, footerY - 13);

  doc.line(125, footerY - 18, 185, footerY - 18);
  doc.text('Secretaria Acadêmica', 137, footerY - 13);

  doc.save(`Boletim_${data.studentName.replace(/\s+/g, '_')}_${data.registrationNumber}.pdf`);
}
