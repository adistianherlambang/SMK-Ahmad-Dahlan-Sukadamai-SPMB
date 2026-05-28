import React from 'react';
import { Head, Link } from '@inertiajs/react';
import styles from './Login.module.css';

export default function PeriodClosed() {
  return (
    <>
      <Head title="Pendaftaran Ditutup - SMK Ahmad Dahlan" />
      
      <main className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo} style={{ backgroundColor: 'var(--color-danger)', color: 'white' }}>⚠️</div>
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

          <Link href="/" className={styles.submitBtn} style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    </>
  );
}
