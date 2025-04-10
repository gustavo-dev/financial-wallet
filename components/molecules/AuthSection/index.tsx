import React from 'react';
import { AuthForm } from '@/components/molecules/AuthForm';
import styles from './styles.module.css';

interface AuthSectionProps {
  title: string;
  onSubmit: (email: string, password: string) => void;
  buttonText: string;
}

export const AuthSection = ({ title, onSubmit, buttonText }: AuthSectionProps) => {
  return (
    <div className={styles.section}>
      <h1 className={styles.title}>{title}</h1>
      <AuthForm onSubmit={onSubmit} buttonText={buttonText} />
    </div>
  );
};