'use client';

import { useState } from 'react';
import styles from './styles.module.css';
import { DepositModal } from '../DepositModal';
import { TransferModal } from '../TransferModal';

interface WalletProps {
  balance: number;
  onOperationSuccess: () => void;
}

export default function Wallet({ balance, onOperationSuccess }: WalletProps) {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const formattedBalance = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(balance);

  return (
    <div className={styles.wallet}>
      <div className={styles.balanceContainer}>
        <span className={styles.balanceLabel}>Saldo atual</span>
        <span className={styles.balanceValue}>{formattedBalance}</span>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.actionButton}
          onClick={() => setIsDepositModalOpen(true)}
        >
          Depositar
        </button>
        <button
          className={styles.actionButton}
          onClick={() => setIsTransferModalOpen(true)}
        >
          Transferir
        </button>
      </div>

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSuccess={() => {
          setIsDepositModalOpen(false);
          onOperationSuccess();
        }}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSuccess={() => {
          setIsTransferModalOpen(false);
          onOperationSuccess();
        }}
      />
    </div>
  );
} 