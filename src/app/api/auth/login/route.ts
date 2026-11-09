import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'E-mail e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'E-mail ou senha incorretos.' },
        { status: 401 }
      );
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordsMatch) {
      return NextResponse.json(
        { success: false, error: 'E-mail ou senha incorretos.' },
        { status: 401 }
      );
    }

    const sessionData = JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set('edusaas_session', sessionData, {
      httpOnly: false, // acessível ao cliente para estado rápido
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Erro na API de login:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao autenticar.' },
      { status: 500 }
    );
  }
}

