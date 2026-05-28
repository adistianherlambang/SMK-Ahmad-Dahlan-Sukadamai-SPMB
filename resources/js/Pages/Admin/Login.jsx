import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Input from '../../Components/Input/Input';
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
            <Link href="/" className={styles.logo} style={{ backgroundColor: 'var(--color-accent-yellow)', color: 'var(--color-primary-dark)' }}>⚙️</Link>
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

            <button type="submit" disabled={processing} className={styles.submitBtn} style={{ backgroundColor: 'var(--color-accent-yellow)', color: 'var(--color-text-main)' }}>
              {processing ? 'Menghubungkan...' : 'Masuk Portal'}
            </button>
          </form>

          <div className={styles.footerLink}>
            <Link href="/">Kembali ke Beranda</Link>
          </div>
        </div>
      </main>
    </>
  );
}
