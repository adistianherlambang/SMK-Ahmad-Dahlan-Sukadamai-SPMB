import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Button from '../../../Components/Button/Button';
import styles from './Login.module.css';

export default function PasswordSuccess() {
  return (
    <>
      <Head title="Kata Sandi Berhasil Diperbarui - SMK Ahmad Dahlan" />
      
      <main className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo} style={{ backgroundColor: 'var(--color-success)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 style={{ color: 'var(--color-success)', marginTop: '8px' }}>Sandi Diperbarui!</h1>
            <p>Kata sandi baru Anda berhasil disimpan. Silakan login kembali ke dalam portal siswa.</p>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button href="/siswa/login" style={{ width: '100%' }}>
              Masuk Portal
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
