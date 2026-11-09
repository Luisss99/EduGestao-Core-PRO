/**
 * Gerador de número de matrícula sequencial no formato MAT-{ANO}-{SEQ_4_DIGITOS}
 * Exemplo: MAT-2026-0001, MAT-2026-0002
 */

export function generateRegistrationNumber(sequenceNumber: number, year?: number): string {
  const currentYear = year || new Date().getFullYear();
  const formattedSeq = String(sequenceNumber).padStart(4, '0');
  return `MAT-${currentYear}-${formattedSeq}`;
}

export function parseRegistrationSeq(registrationNumber: string): number {
  const parts = registrationNumber.split('-');
  if (parts.length === 3) {
    const seq = parseInt(parts[2], 10);
    return isNaN(seq) ? 0 : seq;
  }
  return 0;
}
