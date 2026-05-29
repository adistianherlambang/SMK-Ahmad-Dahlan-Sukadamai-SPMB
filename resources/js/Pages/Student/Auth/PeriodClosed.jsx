import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../../Components/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';
import Button from '../../../Components/Button/Button';
import styles from './Login.module.css';

export default function PeriodClosed() {
  const links = [
    { url: '/', label: 'Beranda' },
    {
      label: 'Profil',
      dropdown: [
        { url: '/profil/sambutan', label: 'Sambutan Kepala Sekolah' },
        { url: '/profil/visi-misi', label: 'Visi & Misi' },
        { url: '/profil/struktur', label: 'Struktur Organisasi' },
        { url: '/profil/sejarah', label: 'Sejarah Singkat' }
      ]
    },
    {
      label: 'Informasi Pendaftaran',
      dropdown: [
        { url: '/informasi/jadwal', label: 'Jadwal SPMB' },
        { url: '/informasi/kuota', label: 'Kuota Pendaftaran' }
      ]
    },
    { url: '/berita', label: 'Berita' },
    { url: '/siswa/login', label: 'Daftar Sekarang', method: 'post' }
  ];

  return (
    <>
      <Head title="Pendaftaran Ditutup - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Pendaftaran Ditutup</h1>
          <p className={styles.breadcrumb}>
            <Link href="/">Beranda</Link> / Pendaftaran Ditutup
          </p>
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.cardHeader}>
          <div className={`${styles.statusCircle} ${styles.statusDanger}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h1 style={{ color: 'var(--color-danger)' }}>Pendaftaran Ditutup</h1>
          <p>Mohon maaf, saat ini sedang tidak ada gelombang pendaftaran online yang aktif.</p>
        </div>

        <div style={{ textAlign: 'left', fontSize: '13px', color: '#4A5568', lineHeight: '1.6', margin: '20px 0', border: '1px solid #E2E8F0', padding: '16px', borderRadius: '8px', backgroundColor: '#F8FAFC', width: '100%', boxSizing: 'border-box' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Silakan lakukan hal berikut:</p>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>Pantau kembali agenda pendaftaran resmi pada halaman <Link href="/informasi/jadwal" style={{ fontWeight: 'bold', color: 'var(--color-primary-dark)', textDecoration: 'underline' }}>Jadwal SPMB</Link>.</li>
            <li>Hubungi panitia pendaftaran sekolah jika Anda merasa ini adalah sebuah kekeliruan.</li>
          </ul>
        </div>

        <Button href="/" style={{ width: '100%' }}>
          Kembali ke Beranda
        </Button>
      </main>

      <Footer />
    </>
  );
}
