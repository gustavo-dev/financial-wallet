'use client';

import { Button } from '@/components/atoms/Buttons';
import { Input } from '@/components/atoms/Input';
import React, { FormEvent } from 'react';

interface AuthFormProps {
  onSubmit: (email: string, password: string) => void;
  buttonText: string;
}

export const AuthForm = ({ onSubmit, buttonText }: AuthFormProps) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit">{buttonText}</Button>
    </form>
  );
};