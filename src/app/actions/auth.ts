'use server';

import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const loginActionSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(1, 'A senha é obrigatória'),
});

const createUserSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
  role: z.enum(['ADMIN', 'SECRETARY']).default('SECRETARY'),
});

export async function loginUser(formData: unknown) {
  try {
    const validated = loginActionSchema.parse(formData);

    const user = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase().trim() },
    });

    if (!user) {
      return { success: false, error: 'E-mail ou senha incorretos.' };
    }

    const passwordsMatch = await bcrypt.compare(validated.password, user.passwordHash);

    if (!passwordsMatch) {
      return { success: false, error: 'E-mail ou senha incorretos.' };
    }

    // Salvar sessão segura em cookie HTTP
    const sessionData = JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    cookies().set('edusaas_session', sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error: any) {
    if (error?.errors) {
      return { success: false, error: error.errors[0]?.message || 'Dados inválidos.' };
    }
    console.error('Erro no login:', error);
    return { success: false, error: 'Falha ao processar login. Tente novamente.' };
  }
}

export async function getSessionUser() {
  try {
    const cookie = cookies().get('edusaas_session');
    if (!cookie?.value) return null;
    return JSON.parse(cookie.value);
  } catch (error) {
    return null;
  }
}

export async function logoutUser() {
  try {
    cookies().delete('edusaas_session');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// ==================== GESTÃO DE USUÁRIOS (ADMIN ONLY) ====================

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: users };
  } catch (error) {
    return { success: false, error: 'Erro ao listar usuários.' };
  }
}

export async function createUser(formData: unknown) {
  try {
    const session = await getSessionUser();

    // Apenas Administrador pode criar novos usuários
    if (!session || session.role !== 'ADMIN') {
      return {
        success: false,
        error: 'Apenas usuários com permissão de Administrador podem adicionar novos usuários.',
      };
    }

    const validated = createUserSchema.parse(formData);

    const existing = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase().trim() },
    });

    if (existing) {
      return { success: false, error: 'Este e-mail já está cadastrado no sistema.' };
    }

    const passwordHash = await bcrypt.hash(validated.password, 10);

    const user = await prisma.user.create({
      data: {
        name: validated.name.trim(),
        email: validated.email.toLowerCase().trim(),
        passwordHash,
        role: validated.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    revalidatePath('/usuarios');
    return { success: true, data: user };
  } catch (error: any) {
    if (error?.errors) {
      return { success: false, error: error.errors[0]?.message || 'Dados inválidos.' };
    }
    console.error('Erro ao criar usuário:', error);
    return { success: false, error: 'Erro ao registrar usuário.' };
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await getSessionUser();

    if (!session || session.role !== 'ADMIN') {
      return {
        success: false,
        error: 'Permissão negada. Apenas Administradores podem excluir usuários.',
      };
    }

    if (session.id === userId) {
      return {
        success: false,
        error: 'Você não pode excluir o seu próprio usuário logado.',
      };
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath('/usuarios');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Erro ao remover usuário.' };
  }
}

