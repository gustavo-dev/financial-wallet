import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bem-vindo à Carteira Financeira</h1>
      <p>
        <a href="/auth/login" className={styles.link}>
          Login
        </a>
        |
        <a href="/auth/register" className={styles.link}>
          Cadastro
        </a>
      </p>
    </div>
  );
}
