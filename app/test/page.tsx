'use client';

import { useState } from 'react';
import Wallet from '@/components/organisms/Wallet';

export default function TestPage() {
  const [balance, setBalance] = useState(1000);

  const handleOperationSuccess = () => {
    // Simulando uma atualização do saldo
    setBalance(prev => prev + 100);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <Wallet 
        balance={balance} 
        onOperationSuccess={handleOperationSuccess} 
      />
    </div>
  );
} 