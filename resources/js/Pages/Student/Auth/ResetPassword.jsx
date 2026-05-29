import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Navbar from '../../../Components/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';
import Input from '../../../Components/Input/Input';
import Button from '../../../Components/Button/Button';
import styles from './Login.module.css';

export default function ResetPassword() {
  const { data, setData, post, processing, errors } = useForm({
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/siswa/buat-sandi-baru');
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
      <Head title="Buat Kata Sandi Baru - SPMB SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Reset Kata Sandi</h1>
          <p className={styles.breadcrumb}>
            <Link href="/">Beranda</Link> / Buat Sandi Baru
          </p>
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.cardHeader}>
          <div className={styles.statusCircle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2>Kata Sandi Baru</h2>
          <p>Silakan buat kata sandi baru yang kuat untuk akun portal siswa Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.password && <div className={styles.errorAlert}>{errors.password}</div>}
          
          <Input 
            label="Kata Sandi Baru"
            type="password"
            placeholder="Masukkan kata sandi baru..."
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            required
          />

          <Input 
            label="Ulangi Kata Sandi"
            type="password"
            placeholder="Ulangi kata sandi baru..."
            value={data.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
            required
          />

          <Button type="submit" loading={processing} style={{ width: '100%' }}>
            Simpan Kata Sandi
          </Button>
        </form>
      </main>

      <Footer />
    </>
  );
}
