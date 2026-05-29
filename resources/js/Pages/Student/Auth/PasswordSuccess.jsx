import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../../Components/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';
import Button from '../../../Components/Button/Button';
import styles from './Login.module.css';

export default function PasswordSuccess() {
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
      <Head title="Kata Sandi Berhasil Diperbarui - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <main className={styles.container}>
        <div className={styles.cardHeader}>
          <div className={`${styles.statusCircle} ${styles.statusSuccess}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 style={{ color: 'var(--color-success)', marginTop: '8px' }}>Sandi Diperbarui!</h1>
          <p>Kata sandi baru Anda berhasil disimpan. Silakan login kembali ke dalam portal siswa.</p>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          <Button href="/siswa/login" style={{ width: '100%' }}>
            Masuk Portal
          </Button>
        </div>
      </main>

      <Footer />
    </>
  );
}
