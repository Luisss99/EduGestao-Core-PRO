import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando Seeder de dados para Gestão Escolar SaaS...');

  // Reset db
  await prisma.invoice.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.course.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('123456', 10);

  // 1. Criar Usuários
  const admin = await prisma.user.create({
    data: {
      name: 'Carlos Andrade (Admin)',
      email: 'admin@escola.com.br',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const secretary = await prisma.user.create({
    data: {
      name: 'Mariana Souza (Secretária)',
      email: 'secretaria@escola.com.br',
      passwordHash,
      role: 'SECRETARY',
    },
  });

  console.log('✅ Usuários de demonstração criados: admin@escola.com.br e secretaria@escola.com.br (Senha: 123456)');

  // 2. Criar Cursos e Disciplinas
  const course1 = await prisma.course.create({
    data: {
      name: 'Desenvolvimento Web Full-Stack',
      code: 'FS-2026',
      description: 'Formação completa em TypeScript, Next.js, Node.js, Banco de Dados e DevOps SaaS.',
      workloadHours: 360,
      monthlyFee: 590.0,
      durationMonths: 6,
      active: true,
      subjects: {
        create: [
          { name: 'Fundamentos de HTML5, CSS3 e Javascript Moderno', workloadHours: 60, syllabus: 'Sintaxe ES6+, DOM, CSS Grid, Flexbox e Acessibilidade Web.' },
          { name: 'React.js Avançado e Gerenciamento de Estado', workloadHours: 90, syllabus: 'Hooks, React Hook Form, Context API, Tailwind CSS e Zod.' },
          { name: 'Backend com Node.js, Express & Prisma ORM', workloadHours: 90, syllabus: 'Arquitetura REST, PostgreSQL, Migrations, JWT e Server Actions.' },
          { name: 'Arquitetura Next.js App Router e Cloud Deploy', workloadHours: 120, syllabus: 'Server Components, SSR, Cache, Vercel Deploy e CI/CD.' },
        ],
      },
    },
  });

  const course2 = await prisma.course.create({
    data: {
      name: 'Engenharia de Dados & Business Intelligence',
      code: 'ED-2026',
      description: 'Especialização em ETL, Python, SQL Avançado e Dashboards Corporativos.',
      workloadHours: 280,
      monthlyFee: 650.0,
      durationMonths: 4,
      active: true,
      subjects: {
        create: [
          { name: 'Python para Análise de Dados e Scripting', workloadHours: 80, syllabus: 'Pandas, NumPy, tratamento de inconsistências e scraping.' },
          { name: 'Modelagem de Dados Relacional e Data Warehouse', workloadHours: 100, syllabus: 'PostgreSQL, Star Schema, Índices e Otimização de Queries.' },
          { name: 'Pipelines de Dados e Visualização com PowerBI', workloadHours: 100, syllabus: 'Airflow, ETL assíncrono e construção de KPIs.' },
        ],
      },
    },
  });

  const course3 = await prisma.course.create({
    data: {
      name: 'Gestão Ágil de Projetos & Produtos SaaS',
      code: 'GP-2026',
      description: 'Metodologias Ágeis (Scrum/Kanban), Gestão Financeira Escolar e Product Management.',
      workloadHours: 180,
      monthlyFee: 480.0,
      durationMonths: 3,
      active: true,
      subjects: {
        create: [
          { name: 'Scrum Framework & Kanban na Prática', workloadHours: 60, syllabus: 'Sprints, backlog grooming, estimativa e métricas ágeis.' },
          { name: 'Product Discovery & Estratégias de SaaS', workloadHours: 120, syllabus: 'OKRs, Churn, LTV, CAC e Métricas Financeiras.' },
        ],
      },
    },
  });

  console.log('✅ 3 Cursos e 9 Disciplinas criadas.');

  // 3. Criar Alunos de Teste (com CPFs válidos)
  const student1 = await prisma.student.create({
    data: {
      fullName: 'Lucas Fernandes Silva',
      cpf: '45892134085',
      email: 'lucas.silva@gmail.com',
      phone: '11987654321',
      birthDate: new Date('1998-05-14'),
      zipCode: '01310100',
      street: 'Avenida Paulista',
      number: '1000',
      complement: 'Apto 42',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
    },
  });

  const student2 = await prisma.student.create({
    data: {
      fullName: 'Beatriz Maria Oliveira',
      cpf: '38194025062',
      email: 'beatriz.oliveira@hotmail.com',
      phone: '21998877665',
      birthDate: new Date('2001-11-20'),
      zipCode: '22041001',
      street: 'Avenida Copacabana',
      number: '500',
      neighborhood: 'Copacabana',
      city: 'Rio de Janeiro',
      state: 'RJ',
    },
  });

  const student3 = await prisma.student.create({
    data: {
      fullName: 'Gabriel Santos Ferreira',
      cpf: '12948573010',
      email: 'gabriel.ferreira@yahoo.com.br',
      phone: '31976543210',
      birthDate: new Date('1995-02-08'),
      zipCode: '30130000',
      street: 'Praça da Liberdade',
      number: '80',
      neighborhood: 'Funcionários',
      city: 'Belo Horizonte',
      state: 'MG',
    },
  });

  const student4 = await prisma.student.create({
    data: {
      fullName: 'Camila Rocha Lima',
      cpf: '50938271049',
      email: 'camila.rocha@outlook.com',
      phone: '41991234567',
      birthDate: new Date('2000-09-30'),
      zipCode: '80020000',
      street: 'Rua XV de Novembro',
      number: '120',
      neighborhood: 'Centro',
      city: 'Curitiba',
      state: 'PR',
    },
  });

  console.log('✅ 4 Alunos com dados cadastrais e CPFs válidos inseridos.');

  // 4. Criar Matrículas e Faturas (Invoices)
  // Matrícula 1: Lucas (Full-Stack - 6 Meses)
  const enrollment1 = await prisma.enrollment.create({
    data: {
      registrationNumber: 'MAT-2026-0001',
      studentId: student1.id,
      courseId: course1.id,
      startDate: new Date('2026-01-15'),
      status: 'ACTIVE',
    },
  });

  // Criar 6 faturas para Matrícula 1
  for (let i = 1; i <= course1.durationMonths; i++) {
    const dueDate = new Date('2026-01-15');
    dueDate.setMonth(dueDate.getMonth() + i);

    let status: 'PAID' | 'PENDING' | 'OVERDUE' = 'PENDING';
    let paidAt: Date | undefined = undefined;
    let paymentMethod: 'PIX' | 'BOLETO' | 'CREDIT_CARD' | undefined = undefined;

    if (i === 1) {
      status = 'PAID';
      paidAt = new Date('2026-02-14');
      paymentMethod = 'PIX';
    } else if (i === 2) {
      status = 'PAID';
      paidAt = new Date('2026-03-10');
      paymentMethod = 'CREDIT_CARD';
    } else if (i === 3) {
      // Supondo vencimento passado (Inadimplente/Atrasado)
      status = 'OVERDUE';
    }

    await prisma.invoice.create({
      data: {
        enrollmentId: enrollment1.id,
        installmentNumber: i,
        dueDate,
        amount: course1.monthlyFee,
        status,
        paidAt,
        paymentMethod,
        barcode: `34191.79001 01043.510047 91020.150008 8 ${Date.now().toString().slice(-8)}`,
      },
    });
  }

  // Matrícula 2: Beatriz (Engenharia de Dados - 4 Meses)
  const enrollment2 = await prisma.enrollment.create({
    data: {
      registrationNumber: 'MAT-2026-0002',
      studentId: student2.id,
      courseId: course2.id,
      startDate: new Date('2026-02-01'),
      status: 'ACTIVE',
    },
  });

  for (let i = 1; i <= course2.durationMonths; i++) {
    const dueDate = new Date('2026-02-01');
    dueDate.setMonth(dueDate.getMonth() + i);

    const status = i === 1 ? 'PAID' : 'PENDING';
    const paidAt = i === 1 ? new Date('2026-03-01') : undefined;
    const paymentMethod = i === 1 ? 'BOLETO' : undefined;

    await prisma.invoice.create({
      data: {
        enrollmentId: enrollment2.id,
        installmentNumber: i,
        dueDate,
        amount: course2.monthlyFee,
        status,
        paidAt,
        paymentMethod,
        barcode: `23793.38128 60000.123456 01000.650004 1 ${Date.now().toString().slice(-8)}`,
      },
    });
  }

  // 5. Inserir Notas de Demonstração (Boletins)
  const subjects1 = await prisma.subject.findMany({ where: { courseId: course1.id } });
  for (const sub of subjects1) {
    await prisma.grade.create({
      data: {
        enrollmentId: enrollment1.id,
        subjectId: sub.id,
        term: '1º Módulo',
        score: parseFloat((Math.random() * 2.5 + 7.5).toFixed(1)), // Notas entre 7.5 e 10.0
        maxScore: 10.0,
        absences: Math.floor(Math.random() * 3),
        feedback: 'Excelente engajamento e cumprimento das atividades práticas.',
      },
    });
  }

  const subjects2 = await prisma.subject.findMany({ where: { courseId: course2.id } });
  for (const sub of subjects2) {
    await prisma.grade.create({
      data: {
        enrollmentId: enrollment2.id,
        subjectId: sub.id,
        term: '1º Módulo',
        score: parseFloat((Math.random() * 3.0 + 6.8).toFixed(1)),
        maxScore: 10.0,
        absences: Math.floor(Math.random() * 4),
        feedback: 'Bom aproveitamento teórico e participação nas aulas.',
      },
    });
  }

  console.log('✅ Matrículas, Faturas e Notas do Boletim geradas com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
