'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import styles from './page.module.css';

interface User {
  id: number;
  name: string;
  email: string;
  balance: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get('auth-token');
        
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const res = await fetch('/api/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (res.status === 401) {
            Cookies.remove('auth-token');
            router.push('/auth/login');
            return;
          }
          throw new Error('Erro ao carregar dados do usuário');
        }

        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar dados do usuário');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('auth-token');
    router.push('/auth/login');
  };

  if (loading) {
    return <div className={styles.container}>Carregando...</div>;
  }

  if (!user) {
    return <div className={styles.container}>Não autorizado</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1>Dashboard</h1>
            <p>Bem-vindo, {user.name}!</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Sair
          </button>
        </div>
      </header>

      <section className={styles.balance}>
        <h2>Seu Saldo</h2>
        <p className={styles.amount}>
          R$ {user.balance.toFixed(2)}
        </p>
      </section>

      <section className={styles.actions}>
        <h2>Operações</h2>
        <div className={styles.buttons}>
          <button className={styles.depositButton}>
            Realizar Depósito
          </button>
          <button className={styles.transferButton}>
            Realizar Transferência
          </button>
        </div>
      </section>

      <section className={styles.history}>
        <h2>Histórico de Transações</h2>
        {/* TODO: Implementar lista de transações */}
      </section>
    </div>
  );
} 