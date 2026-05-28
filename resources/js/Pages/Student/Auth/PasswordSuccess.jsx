import React from 'react';
import { Head, Link } from '@inertiajs/react';
import styles from './Login.module.css';

export default function PasswordSuccess() {
  return (
    <>
      <Head title="Kata Sandi Berhasil Diperbarui - SMK Ahmad Dahlan" />
      
      <main className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo} style={{ backgroundColor: 'var(--color-success)', color: 'white' }}>✓</div>
            <h1 style={{ color: 'var(--color-success)', marginTop: '8px' }}>Sandi Diperbarui!</h1>
            <p>Kata sandi baru Anda berhasil disimpan. Silakan login kembali ke dalam portal siswa.</p>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/siswa/login" className={styles.submitBtn} style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
              Masuk Portal
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
