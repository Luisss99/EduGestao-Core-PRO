import { jsPDF } from 'jspdf';
import { formatCPFDisplay, formatDate } from './utils';

export interface StudentLGPDPDFData {
  studentName: string;
  cpf: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  enrollments: {
    registrationNumber: string;
    courseName: string;
    startDate: string;
    status: string;
  }[];
  gradesCount: number;
  invoicesCount: number;
}

export function generateStudentLGPDReportPDF(data: StudentLGPDPDFData) {
  const doc = new jsPDF();

  // Banner Superior
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('RELATÓRIO DE DADOS DO TITULAR (LGPD)', 14, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Direito de Acesso e Transparência • Art. 18 da Lei Federal nº 13.709/2018', 14, 25);

  // Badge de Autenticidade
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(140, 8, 56, 16, 2, 2, 'F');
  doc.setTextColor(226, 232, 240);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DOCUMENTO OFICIAL', 144, 14);
  doc.setFontSize(9);
  doc.setTextColor(56, 189, 248);
  doc.text('CONFIDENCIAL', 144, 20);

  // Seção 1: Dados Pessoais Identificáveis
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. DADOS PESSOAIS DO ALUNO (IDENTIFICAÇÃO CADASTRAL)', 14, 44);

  doc.setLineWidth(0.5);
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 46, 196, 46);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Nome do Titular:', 14, 54);
  doc.setFont('helvetica', 'normal');
  doc.text(data.studentName, 48, 54);

  doc.setFont('helvetica', 'bold');
  doc.text('CPF:', 14, 61);
  doc.setFont('helvetica', 'normal');
  doc.text(data.cpf, 48, 61);

  doc.setFont('helvetica', 'bold');
  doc.text('Data de Nascimento:', 120, 61);
  doc.setFont('helvetica', 'normal');
  doc.text(data.birthDate, 155, 61);

  doc.setFont('helvetica', 'bold');
  doc.text('E-mail de Contato:', 14, 68);
  doc.setFont('helvetica', 'normal');
  doc.text(data.email, 48, 68);

  doc.setFont('helvetica', 'bold');
  doc.text('Telefone / WhatsApp:', 120, 68);
  doc.setFont('helvetica', 'normal');
  doc.text(data.phone, 155, 68);

  doc.setFont('helvetica', 'bold');
  doc.text('Endereço Registrado:', 14, 75);
  doc.setFont('helvetica', 'normal');
  doc.text(data.address, 48, 75);

  // Seção 2: Finalidade e Base Legal do Tratamento
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('2. BASE LEGAL E FINALIDADE DO TRATAMENTO DE DADOS', 14, 89);
  doc.line(14, 91, 196, 91);

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 96, 182, 28, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.text('• Base Legal:', 18, 103);
  doc.setFont('helvetica', 'bold');
  doc.text('Execução de Contrato de Prestação de Serviços Educacionais e Cumprimento de Obrigação Legal.', 40, 103);

  doc.setFont('helvetica', 'normal');
  doc.text('• Finalidade:', 18, 111);
  doc.setFont('helvetica', 'bold');
  doc.text('Gestão acadêmica, emissão de certificados, diários de classe, controle de notas e cobrança.', 40, 111);

  doc.setFont('helvetica', 'normal');
  doc.text('• Compartilhamento:', 18, 119);
  doc.setFont('helvetica', 'bold');
  doc.text('Nenhum dado é repassado para publicidade ou terceiros estranhos à rotina pedagógica.', 50, 119);

  // Seção 3: Registros Vinculados (Matrículas e Histórico)
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('3. VÍNCULOS ACADÊMICOS E REGISTROS PEDAGÓGICOS', 14, 134);
  doc.line(14, 136, 196, 136);

  // Cabeçalho da tabela de matrículas
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 141, 182, 8, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Nº MATRÍCULA', 18, 146);
  doc.text('CURSO VINCULADO', 65, 146);
  doc.text('INÍCIO', 140, 146);
  doc.text('STATUS', 170, 146);

  let y = 155;
  data.enrollments.forEach((en, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 5, 182, 8, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(en.registrationNumber, 18, y);
    doc.text(en.courseName.length > 35 ? en.courseName.substring(0, 32) + '...' : en.courseName, 65, y);
    doc.text(en.startDate, 140, y);
    doc.setFont('helvetica', 'bold');
    doc.text(en.status === 'ACTIVE' ? 'ATIVO' : en.status, 170, y);
    y += 8;
  });

  if (data.enrollments.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.text('Nenhuma matrícula vinculada encontrada.', 18, y);
    y += 8;
  }

  // Resumo de Registros de Desempenho e Financeiro
  y += 5;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(`Total de avaliações e notas arquivadas: ${data.gradesCount} lançamento(s)`, 14, y);
  doc.text(`Total de títulos e parcelas financeiras emitidas: ${data.invoicesCount} registro(s)`, 14, y + 6);

  // Rodapé e Validação
  const footerY = 265;
  doc.setLineWidth(0.5);
  doc.setDrawColor(203, 213, 225);
  doc.line(14, footerY, 196, footerY);

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Documento comprobatório emitido a pedido do titular ou para auditoria de proteção de dados.', 14, footerY + 6);
  doc.text(`Protocolo LGPD: DPO-${Math.random().toString(36).substring(2, 9).toUpperCase()} • Emitido em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 14, footerY + 11);

  doc.save(`Relatorio_LGPD_${data.studentName.replace(/\s+/g, '_')}.pdf`);
}

