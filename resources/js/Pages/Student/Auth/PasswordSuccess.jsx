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
    { url: '/siswa/login', label: 'Daftar Sekarang', method: 'post' },
    { url: '/admin/login', label: 'Login Admin' }
  ];

  return (
    <>
      <Head title="Kata Sandi Berhasil Diperbarui - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <main className={styles.container}>
        <div style={{ textAlign: "center", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", gap: "12px" }} className={styles.cardHeader}>
          <img style={{ width: '15rem' }} src="/login/siswa/buatAkun.webp" alt="" />
          <h2>Sandi Diperbarui!</h2>
          <p>Kata sandi baru Anda berhasil disimpan. Silakan login kembali ke dalam portal siswa.</p>
        </div>

        <Button href="/siswa/login" style={{ width: '100%' }}>
          Ke Halaman Login
        </Button>
      </main>

      <Footer />
    </>
  );
}
