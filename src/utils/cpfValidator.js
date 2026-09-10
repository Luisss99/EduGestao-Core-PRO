/**
 * Utilitários para formatação e validação de CPF (Cadastro de Pessoas Físicas)
 */

/**
 * Limpa o CPF removendo caracteres não numéricos.
 */
export function cleanCPF(cpf) {
  if (!cpf) return '';
  return cpf.toString().replace(/\D/g, '');
}

/**
 * Aplica a máscara 000.000.000-00 no texto informado.
 */
export function formatCPF(value) {
  const digits = cleanCPF(value).slice(0, 11);
  if (!digits) return '';

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/**
 * Valida se um número de CPF é matematicamente válido.
 */
export function validateCPF(cpf) {
  const cleaned = cleanCPF(cpf);

  // Deve ter exatamente 11 dígitos
  if (cleaned.length !== 11) return false;

  // Rejeita sequências de dígitos idênticos (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // Validação do 1º Dígito Verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i), 10) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cleaned.charAt(9), 10)) return false;

  // Validação do 2º Dígito Verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i), 10) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cleaned.charAt(10), 10)) return false;

  return true;
}
