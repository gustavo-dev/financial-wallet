'use client';

import { useState } from 'react';
import { Modal } from '@/components/molecules/Modal';
import styles from './styles.module.css';
import Cookies from 'js-cookie';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DepositModal({ isOpen, onClose, onSuccess }: DepositModalProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = Cookies.get('auth-token');
      const response = await fetch('/api/transactions/deposit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: Number(amount),
          description
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAmount('');
        setDescription('');
        onSuccess();
        onClose();
      } else {
        setError(data.error || 'Erro ao processar depósito');
      }
    } catch (error) {
      setError('Erro ao processar depósito');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Realizar Depósito">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="amount">Valor (R$)</label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="description">Descrição (opcional)</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading || !amount}
        >
          {isLoading ? 'Processando...' : 'Confirmar Depósito'}
        </button>
      </form>
    </Modal>
  );
} 