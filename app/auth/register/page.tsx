'use client';

import { AuthSection } from '@/components/organisms/AuthSection';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (email: string, password: string, name?: string) => {
    if (!name) return;
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      
      if (res.ok) {
        router.push('/auth/login');
      } else {
        console.error('Erro no cadastro:', data.error);
        alert('Erro ao cadastrar usuário. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao cadastrar usuário. Por favor, tente novamente.');
    }
  };

  return (
    <AuthSection 
      title="Cadastro" 
      onSubmit={handleRegister} 
      buttonText="Cadastrar" 
      showNameField={true}
    />
  );
} 