import { FormEvent } from 'react';
import styles from './styles.module.css';

interface AuthSectionProps {
  title: string;
  onSubmit: (email: string, password: string, name?: string) => void;
  buttonText: string;
  showNameField?: boolean;
}

export function AuthSection({ title, onSubmit, buttonText, showNameField = false }: AuthSectionProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    onSubmit(email, password, name);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {showNameField && (
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="Nome"
            required
          />
        )}
        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          className={styles.input}
          type="password"
          name="password"
          placeholder="Senha"
          required
        />
        <button className={styles.button} type="submit">
          {buttonText}
        </button>
      </form>
    </div>
  );
} 