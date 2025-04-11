'use client';

import styles from './page.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { DepositModal } from '@/components/organisms/DepositModal';
import { TransferModal } from '@/components/organisms/TransferModal';

interface User {
  id: number;
  name: string;
  email: string;
  balance: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

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
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('auth-token');
    router.push('/auth/login');
  };

  const handleOperationSuccess = async () => {
    // Atualizar os dados do usuário após uma operação bem-sucedida
    try {
      const res = await fetch('/api/user/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  if (!user) {
    return <div className={styles.container}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1>Dashboard</h1>
            <p>Bem-vindo de volta, {user.name}!</p>
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
          <button 
            onClick={() => setIsDepositModalOpen(true)} 
            className={styles.depositButton}
          >
            Realizar Depósito
          </button>
          <button 
            onClick={() => setIsTransferModalOpen(true)} 
            className={styles.transferButton}
          >
            Realizar Transferência
          </button>
        </div>
      </section>

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSuccess={handleOperationSuccess}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSuccess={handleOperationSuccess}
      />
    </div>
  );
} 