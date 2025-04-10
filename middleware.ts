import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Rotas que precisam de autenticação
const protectedRoutes = ['/dashboard'];

// Rotas públicas
const publicRoutes = ['/auth/login', '/auth/register', '/'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Se for rota pública, permite o acesso
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Se for rota protegida, verifica o token
  if (protectedRoutes.some(route => path.startsWith(route))) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      // Verifica o token usando a chave secreta
      await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      
      return NextResponse.next();
    } catch (error) {
      // Se o token for inválido, redireciona para o login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Para outras rotas, permite o acesso
  return NextResponse.next();
} 