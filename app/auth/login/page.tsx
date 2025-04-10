'use client';

import { AuthSection } from "@/components/organisms/AuthSection";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Armazena o token em um cookie httpOnly
        Cookies.set('auth-token', data.token, { 
          expires: 1, // expira em 1 dia
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        router.push('/dashboard');
      } else {
        alert(data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login. Tente novamente.');
    }
  };

  return <AuthSection title="Login" onSubmit={handleLogin} buttonText="Entrar" />;
} 