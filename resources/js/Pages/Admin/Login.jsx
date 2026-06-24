import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import styles from '../Student/Auth/Login.module.css';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('spmb_admin_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        setData({
          email: parsed.email || '',
          password: parsed.password || '',
        });
      }
    } catch (err) {
      // ignore
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('spmb_admin_session', JSON.stringify({
        email: data.email,
        password: data.password,
      }));
    } catch (err) {
      // ignore
    }
    post('/admin/login');
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
    { url: '/siswa/login', label: 'Daftar Sekarang', method: 'post' },
    { url: '/admin/login', label: 'Login Admin' }

  ];

  return (
    <>
      <Head title="Admin Login - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <main className={styles.container}>
        <div className={styles.cardHeader}>
          <h2>Portal Admin</h2>
          <p>Sistem Manajemen Penerimaan Peserta Didik Baru (SPMB)</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.email && <div className={styles.errorAlert}>{errors.email}</div>}

          <Input
            label="Email Administrator"
            type="email"
            placeholder="admin@gmail.com"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Masukkan password..."
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            required
          />

          <Button type="submit" loading={processing} variant="secondary" style={{ width: '100%' }}>
            Masuk Portal
          </Button>
        </form>

        <div className={styles.footerLink}>
          <Link href="/">Kembali ke Beranda</Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
