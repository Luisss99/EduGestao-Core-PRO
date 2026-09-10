/**
 * Dados demonstrativos iniciais ricos para o Sistema de Gestão Escolar (EduGestão)
 */

export const INITIAL_COURSES = [
  {
    id: 'crs-1',
    code: 'ENG-SOFT',
    name: 'Engenharia de Software',
    workload: 3600,
    description: 'Formação completa em desenvolvimento de sistemas, arquitetura de software, DevOps e gestão ágil.',
    createdAt: '2025-01-15'
  },
  {
    id: 'crs-2',
    code: 'DEV-FULL',
    name: 'Desenvolvimento Web Fullstack',
    workload: 1200,
    description: 'Curso prático focando em React, Node.js, Bancos de Dados e desenvolvimento de APIs RESTful.',
    createdAt: '2025-02-10'
  },
  {
    id: 'crs-3',
    code: 'DESIGN-UX',
    name: 'Design de Experiência do Usuário (UX/UI)',
    workload: 800,
    description: 'Pesquisa com usuários, prototipagem no Figma, arquitetura de informação e design systems.',
    createdAt: '2025-03-01'
  },
  {
    id: 'crs-4',
    code: 'DATA-SCI',
    name: 'Ciência de Dados & Inteligência Artificial',
    workload: 2400,
    description: 'Análise exploratória, estatística, aprendizado de máquina em Python e engenharia de dados.',
    createdAt: '2025-04-12'
  }
];

export const INITIAL_CLASSES = [
  {
    id: 'trm-2026-1a',
    code: 'TURMA-2026.1-ENG',
    name: 'Engenharia de Software - Turma A (Manhã)',
    courseId: 'crs-1',
    period: '2026.1',
    startDate: '2026-02-02',
    endDate: '2026-06-30',
    subjects: ['Algoritmos e Estrutura de Dados', 'Arquitetura de Software', 'Engenharia de Requisitos', 'Banco de Dados']
  },
  {
    id: 'trm-2026-1b',
    code: 'TURMA-2026.1-FULL',
    name: 'Desenvolvimento Fullstack - Turma Noturna',
    courseId: 'crs-2',
    period: '2026.1',
    startDate: '2026-02-09',
    endDate: '2026-07-15',
    subjects: ['JavaScript & React', 'Node.js & Express', 'SQL & PostgreSQL', 'DevOps Básico']
  },
  {
    id: 'trm-2026-1c',
    code: 'TURMA-2026.1-UX',
    name: 'Design UX/UI - Turma Intensiva',
    courseId: 'crs-3',
    period: '2026.1',
    startDate: '2026-03-01',
    endDate: '2026-07-01',
    subjects: ['Pesquisa & Personas', 'Wireframing & UI', 'Prototipagem Interativa', 'Design Systems']
  }
];

export const INITIAL_STUDENTS = [
  {
    id: 'aln-101',
    fullName: 'Lucas Gabriel Mendes Silva',
    cpf: '384.920.182-45',
    email: 'lucas.mendes@email.com',
    phone: '(11) 98765-4321',
    birthDate: '2001-05-14',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    status: 'Ativo', // Ativo, Trancado, Concluído, Cancelado
    address: 'Av. Paulista, 1500 - São Paulo, SP',
    enrolledClassIds: ['trm-2026-1a'],
    createdAt: '2026-01-10'
  },
  {
    id: 'aln-102',
    fullName: 'Mariana Oliveira Souza',
    cpf: '492.103.847-90',
    email: 'mariana.souza@email.com',
    phone: '(21) 99123-8877',
    birthDate: '1999-11-20',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    status: 'Ativo',
    address: 'Rua das Flores, 320 - Rio de Janeiro, RJ',
    enrolledClassIds: ['trm-2026-1b'],
    createdAt: '2026-01-12'
  },
  {
    id: 'aln-103',
    fullName: 'Carlos Eduardo Ferreira',
    cpf: '128.495.039-11',
    email: 'carlos.ferreira@email.com',
    phone: '(31) 97766-5544',
    birthDate: '2002-08-03',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    status: 'Trancado',
    address: 'Rua Bahia, 88 - Belo Horizonte, MG',
    enrolledClassIds: ['trm-2026-1a'],
    createdAt: '2025-08-15'
  },
  {
    id: 'aln-104',
    fullName: 'Beatriz Costa Rodrigues',
    cpf: '582.104.938-22',
    email: 'beatriz.rodrigues@email.com',
    phone: '(41) 98844-3322',
    birthDate: '2000-03-25',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    status: 'Concluído',
    address: 'Rua XV de Novembro, 450 - Curitiba, PR',
    enrolledClassIds: ['trm-2026-1c'],
    createdAt: '2024-02-01'
  },
  {
    id: 'aln-105',
    fullName: 'Gabriel Santos Almeida',
    cpf: '839.201.492-77',
    email: 'gabriel.almeida@email.com',
    phone: '(71) 99988-1122',
    birthDate: '1998-12-05',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    status: 'Cancelado',
    address: 'Orla Marítima, 12 - Salvador, BA',
    enrolledClassIds: [],
    createdAt: '2025-03-10'
  }
];

export const INITIAL_GRADES = [
  // Lucas Gabriel Mendes Silva - Turma A (Engenharia de Software)
  {
    studentId: 'aln-101',
    classId: 'trm-2026-1a',
    subject: 'Algoritmos e Estrutura de Dados',
    evaluations: { n1: 9.5, n2: 8.8, n3: 9.0 },
    absences: 2
  },
  {
    studentId: 'aln-101',
    classId: 'trm-2026-1a',
    subject: 'Arquitetura de Software',
    evaluations: { n1: 8.0, n2: 8.5, n3: 9.2 },
    absences: 0
  },
  {
    studentId: 'aln-101',
    classId: 'trm-2026-1a',
    subject: 'Engenharia de Requisitos',
    evaluations: { n1: 7.5, n2: 8.0, n3: 8.5 },
    absences: 1
  },
  {
    studentId: 'aln-101',
    classId: 'trm-2026-1a',
    subject: 'Banco de Dados',
    evaluations: { n1: 10.0, n2: 9.0, n3: 9.5 },
    absences: 0
  },

  // Mariana Oliveira Souza - Turma Fullstack
  {
    studentId: 'aln-102',
    classId: 'trm-2026-1b',
    subject: 'JavaScript & React',
    evaluations: { n1: 9.0, n2: 9.5, n3: 9.8 },
    absences: 1
  },
  {
    studentId: 'aln-102',
    classId: 'trm-2026-1b',
    subject: 'Node.js & Express',
    evaluations: { n1: 8.5, n2: 8.0, n3: 8.8 },
    absences: 3
  },
  {
    studentId: 'aln-102',
    classId: 'trm-2026-1b',
    subject: 'SQL & PostgreSQL',
    evaluations: { n1: 9.2, n2: 8.7, n3: 9.0 },
    absences: 0
  },

  // Carlos Eduardo Ferreira - Turma A
  {
    studentId: 'aln-103',
    classId: 'trm-2026-1a',
    subject: 'Algoritmos e Estrutura de Dados',
    evaluations: { n1: 6.0, n2: 5.5, n3: 6.5 },
    absences: 8
  },

  // Beatriz Costa Rodrigues - Turma UX
  {
    studentId: 'aln-104',
    classId: 'trm-2026-1c',
    subject: 'Pesquisa & Personas',
    evaluations: { n1: 10.0, n2: 9.5, n3: 9.5 },
    absences: 0
  },
  {
    studentId: 'aln-104',
    classId: 'trm-2026-1c',
    subject: 'Wireframing & UI',
    evaluations: { n1: 9.8, n2: 9.6, n3: 10.0 },
    absences: 0
  }
];

export const MOCK_ADMIN_USER = {
  name: 'Ana Cláudia Martins',
  email: 'admin@edugestao.com',
  cpf: '000.000.000-00',
  role: 'Administradora / Secretária',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
};
