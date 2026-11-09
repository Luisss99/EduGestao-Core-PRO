import { z } from 'zod';
import { validateCPF, cleanCPF } from './cpf';

export const studentSchema = z.object({
  fullName: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  cpf: z
    .string()
    .transform((val) => cleanCPF(val))
    .refine((val) => validateCPF(val), {
      message: 'CPF inválido. Verifique os dígitos digitados.',
    }),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  birthDate: z.string().min(10, 'Data de nascimento é obrigatória'),
  zipCode: z.string().min(8, 'CEP inválido'),
  street: z.string().min(2, 'Logradouro é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve conter 2 letras (UF)'),
});

export const courseSchema = z.object({
  name: z.string().min(3, 'Nome do curso é obrigatório'),
  code: z.string().min(2, 'Código do curso é obrigatório (ex: ENG-01)'),
  description: z.string().min(5, 'Descrição é obrigatória'),
  workloadHours: z.coerce.number().min(1, 'Carga horária deve ser maior que 0'),
  monthlyFee: z.coerce.number().min(1, 'Valor da mensalidade é obrigatório'),
  durationMonths: z.coerce.number().min(1, 'Duração em meses deve ser no mínimo 1'),
  active: z.boolean().default(true),
});

export const subjectSchema = z.object({
  courseId: z.string().uuid('Selecione um curso válido'),
  name: z.string().min(3, 'Nome da disciplina é obrigatório'),
  workloadHours: z.coerce.number().min(1, 'Carga horária é obrigatória'),
  syllabus: z.string().min(5, 'Ementa/Conteúdo programático é obrigatório'),
});

export const enrollmentSchema = z.object({
  studentId: z.string().uuid('Selecione um aluno válido'),
  courseId: z.string().uuid('Selecione um curso válido'),
  startDate: z.string().min(10, 'Data de início é obrigatória'),
});

export const paymentClearanceSchema = z.object({
  paymentMethod: z.enum(['PIX', 'BOLETO', 'CREDIT_CARD', 'CASH'], {
    required_error: 'Selecione a forma de pagamento',
  }),
  paidAt: z.string().min(10, 'Data do recebimento é obrigatória'),
});

export const loginSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
});
