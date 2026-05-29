import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Navbar from '../../../Components/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';
import Input from '../../../Components/Input/Input';
import Button from '../../../Components/Button/Button';
import styles from './Formulir.module.css'; // Re-use Formulir card layouts and steps

export default function BuatAkun() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/siswa/buat-akun');
  };

  return (
    <>
      <Head title="Buat Akun Portal - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <main className={styles.container}>
        <div className={styles.cardHeader}>
          <h2>Buat Akun Portal</h2>
          <p>Silakan buat email dan password untuk digunakan login ke dalam Dasbor Portal Siswa.</p>
        </div>

        <div className={styles.stepIndicator}>
          <div className={styles.step}>
            <div className={styles.stepNum} style={{ backgroundColor: 'var(--color-success)', color: 'white', border: 'none' }}>✓</div>
            <span>Form Data</span>
          </div>
          <div className={styles.stepLine} style={{ backgroundColor: 'var(--color-success)' }}></div>
          <div className={`${styles.step} ${styles.stepActive}`}>
            <div className={styles.stepNum}>2</div>
            <span>Buat Akun</span>
          </div>
        </div>

        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>F. Kredensial Login Portal Siswa</h2>
              <div className={styles.sectionBody}>
                <p style={{ fontSize: '13px', color: '#718096', lineHeight: '1.5', margin: '0 0 8px 0' }}>
                  Silakan buat email dan password untuk digunakan login ke dalam Dasbor Portal Siswa guna memantau status seleksi & berkas Anda.
                </p>

                {errors.email && <div className={styles.errorSummary}>{errors.email}</div>}
                {errors.password && <div className={styles.errorSummary}>{errors.password}</div>}

                <Input 
                  label="Email Akun Baru"
                  type="email"
                  placeholder="Masukkan email aktif..."
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  required
                />

                <Input 
                  label="Password Akun"
                  type="password"
                  placeholder="Buat password minimal 6 karakter..."
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" loading={processing} style={{ width: '100%' }}>
              Selesaikan Pendaftaran
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
