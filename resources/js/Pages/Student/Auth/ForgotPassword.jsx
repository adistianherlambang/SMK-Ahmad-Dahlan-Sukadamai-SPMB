import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Navbar from '../../../Components/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';
import Input from '../../../Components/Input/Input';
import Button from '../../../Components/Button/Button';
import styles from './Login.module.css'; // Re-use main container/card layout structure

export default function ForgotPassword() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    nisn: '',
    full_name: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/siswa/lupa-password');
  };

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
      <Head title="Lupa Kata Sandi - SPMB SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Lupa Kata Sandi</h1>
          <p className={styles.breadcrumb}>
            <Link href="/">Beranda</Link> / <Link href="/siswa/login">Login Siswa</Link> / Lupa Sandi
          </p>
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.cardHeader}>
          <h2>Lupa Kata Sandi</h2>
          <p>Silakan masukkan detail pendaftaran Anda untuk melakukan verifikasi identitas.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.email && <div className={styles.errorAlert}>{errors.email}</div>}
          {errors.nisn && <div className={styles.errorAlert}>{errors.nisn}</div>}
          
          <Input 
            label="Email Terdaftar"
            type="email"
            placeholder="contoh@gmail.com"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            required
          />

          <Input 
            label="NISN (10 Digit)"
            type="text"
            placeholder="Masukkan 10 digit NISN..."
            maxLength={10}
            value={data.nisn}
            onChange={(e) => setData('nisn', e.target.value)}
            required
          />

          <Input 
            label="Nama Lengkap Calon Siswa"
            type="text"
            placeholder="Sesuai Akta Kelahiran..."
            value={data.full_name}
            onChange={(e) => setData('full_name', e.target.value)}
            required
          />

          <Button type="submit" loading={processing} style={{ width: '100%' }}>
            Verifikasi Data
          </Button>
        </form>

        <div className={styles.footerLink}>
          <p>Ingat kata sandi? <Link href="/siswa/login">Masuk Kembali</Link></p>
        </div>
      </main>

      <Footer />
    </>
  );
}
