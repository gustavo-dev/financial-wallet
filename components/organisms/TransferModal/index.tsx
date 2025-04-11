import { useState } from 'react';
import { Modal } from '@/components/molecules/Modal';
import styles from './styles.module.css';
import Cookies from 'js-cookie';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function TransferModal({ isOpen, onClose, onSuccess }: TransferModalProps) {
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = Cookies.get('token');
      const response = await fetch('/api/transactions/transfer', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: Number(amount),
          email,
          description
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAmount('');
        setEmail('');
        setDescription('');
        onSuccess();
        onClose();
      } else {
        setError(data.error || 'Erro ao processar transferência');
      }
    } catch (error) {
      setError('Erro ao processar transferência');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Realizar Transferência">
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
          <label htmlFor="email">Email do destinatário</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          disabled={isLoading || !amount || !email}
        >
          {isLoading ? 'Processando...' : 'Confirmar Transferência'}
        </button>
      </form>
    </Modal>
  );
}