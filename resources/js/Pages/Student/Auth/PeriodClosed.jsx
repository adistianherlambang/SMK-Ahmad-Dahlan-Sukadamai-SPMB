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
    { url: '/siswa/login', label: 'Daftar Sekarang', method: 'post' },
    { url: '/admin/login', label: 'Login Admin' }
  ];

  return (
    <>
      <Head title="Pendaftaran Ditutup - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <main className={styles.container}>
        <div style={{ textAlign: "center", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", gap: "32px" }} className={styles.cardHeader}>
          <img src="/login/siswa/closed.png" style={{ width: "15rem" }} alt="" />
          <div>
            <h2>Maaf, periode pendaftaran belum dibuka / sudah ditutup</h2>
          </div>
        </div>

        <Button href="/" style={{ width: '100%' }}>
          Kembali ke Beranda
        </Button>
      </main>

      <Footer />
    </>
  );
}
