import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Navbar from '../../../Components/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';
import Input from '../../../Components/Input/Input';
import Button from '../../../Components/Button/Button';
import styles from './Login.module.css';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('spmb_siswa_session');
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
      localStorage.setItem('spmb_siswa_session', JSON.stringify({
        email: data.email,
        password: data.password,
      }));
    } catch (err) {
      // ignore
    }
    post('/siswa/login');
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
      <Head title="Login Portal Siswa - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <main className={styles.container}>
        <img style={{ width: "100%" }} src="/login/siswa/login.webp" alt="" />
        <div className={styles.cardHeader}>
          <h2>Selamat Datang Kembali!</h2>
          <p>Silakan masuk menggunakan akun terdaftar Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.email && <div className={styles.errorAlert}>{errors.email}</div>}

          <Input
            label="Email Calon Siswa"
            type="email"
            placeholder="contoh@gmail.com"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            required
          />

          <Input
            label="Kata Sandi"
            type="password"
            placeholder="Masukkan kata sandi..."
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            required
          />

          <div className={styles.forgotLink}>
            <Link href="/siswa/lupa-password">Lupa Kata Sandi?</Link>
          </div>

          <Button type="submit" loading={processing} style={{ width: '100%' }}>
            Masuk Portal
          </Button>

          <div className={styles.footerLink}>
            <p>Belum melakukan pendaftaran? <Link href="/siswa/formulir">Daftar Sekarang</Link></p>
          </div>
        </form>


      </main>

      <Footer />
    </>
  );
}
