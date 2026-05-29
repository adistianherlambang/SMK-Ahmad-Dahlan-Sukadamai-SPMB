import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Button from '../../../Components/Button/Button';
import styles from './Login.module.css';

export default function PeriodClosed() {
  return (
    <>
      <Head title="Pendaftaran Ditutup - SMK Ahmad Dahlan" />
      
      <main className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo} style={{ backgroundColor: 'var(--color-danger)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h1 style={{ color: 'var(--color-danger)', marginTop: '8px' }}>Pendaftaran Ditutup</h1>
            <p>Mohon maaf, saat ini sedang tidak ada gelombang pendaftaran online yang aktif.</p>
          </div>

          <div style={{ textAlign: 'left', fontSize: '13px', color: '#4A5568', lineHeight: '1.6', margin: '20px 0', border: '1px solid #E2E8F0', padding: '16px', borderRadius: '4px', backgroundColor: '#F8FAFC' }}>
            <p>Silakan lakukan hal berikut:</p>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>Pantau kembali agenda pendaftaran resmi pada halaman <Link href="/informasi/jadwal" style={{ fontWeight: 'bold', color: 'var(--color-primary-dark)', textDecoration: 'underline' }}>Jadwal SPMB</Link>.</li>
              <li>Hubungi panitia pendaftaran sekolah jika Anda merasa ini adalah sebuah kekeliruan.</li>
            </ul>
          </div>

          <Button href="/" style={{ width: '100%' }}>
            Kembali ke Beranda
          </Button>
        </div>
      </main>
    </>
  );
}
