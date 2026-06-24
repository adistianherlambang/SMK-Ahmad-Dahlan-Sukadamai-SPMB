import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import styles from './Struktur.module.css';

export default function Struktur() {
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
      <Head title="Struktur Organisasi - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Struktur Organisasi</h1>
          <p className={styles.breadcrumb}>
            <Link href="/">Beranda</Link> / Profil / Struktur Organisasi
          </p>
        </div>
      </header>

      <main className={styles.container}>
        {/* <section className={styles.intro}>
          <h2>Susunan Organisasi Sekolah</h2>
          <p>Tata kelola kepemimpinan dan manajemen operasional di SMK Ahmad Dahlan Sukadamai Tahun Ajaran 2026/2027.</p>
        </section> */}

        <img style={{ width: "100%", objectFit: "contain" }} src="/landingPage/organisasi/organisasi.png" alt="" />
      </main>

      <Footer />
    </>
  );
}
