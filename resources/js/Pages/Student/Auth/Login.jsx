import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Input from '../../../Components/Input/Input';
import styles from './Login.module.css';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/siswa/login');
  };

  return (
    <>
      <Head title="Login Portal Siswa - SMK Ahmad Dahlan" />
      
      <main className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <Link href="/" className={styles.logo}>SMK AD</Link>
            <h1>Portal Siswa</h1>
            <p>Sistem Penerimaan Peserta Didik Baru (SPMB)</p>
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

            <button type="submit" disabled={processing} className={styles.submitBtn}>
              {processing ? 'Menghubungkan...' : 'Masuk Portal'}
            </button>
          </form>

          <div className={styles.footerLink}>
            <p>Belum melakukan pendaftaran? <Link href="/siswa/formulir">Daftar Sekarang</Link></p>
          </div>
        </div>
      </main>
    </>
  );
}
