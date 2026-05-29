import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import styles from '../Student/Auth/Login.module.css'; // Re-use auth visuals

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/login');
  };

  return (
    <>
      <Head title="Admin Login - SMK Ahmad Dahlan" />
      
      <main className={styles.container} style={{ background: 'linear-gradient(135deg, #1A202C 0%, var(--color-primary-dark) 100%)' }}>
        <div className={styles.card} style={{ borderTop: '4px solid var(--color-accent-yellow)' }}>
          <div className={styles.header}>
            <Link href="/" className={styles.logo} style={{ backgroundColor: 'var(--color-accent-yellow)', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </Link>
            <h1>Portal Admin</h1>
            <p>Sistem Manajemen Pendaftaran (SPMB)</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {errors.email && <div className={styles.errorAlert}>{errors.email}</div>}
            
            <Input 
              label="Email Administrator"
              type="email"
              placeholder="admin@gmail.com"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              required
            />

            <Input 
              label="Password"
              type="password"
              placeholder="Masukkan password..."
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              required
            />

            <Button type="submit" loading={processing} variant="secondary" style={{ width: '100%' }}>
              Masuk Portal
            </Button>
          </form>

          <div className={styles.footerLink}>
            <Link href="/">Kembali ke Beranda</Link>
          </div>
        </div>
      </main>
    </>
  );
}
