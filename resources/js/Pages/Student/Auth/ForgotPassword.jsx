import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Input from '../../../Components/Input/Input';
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

  return (
    <>
      <Head title="Lupa Kata Sandi - SPMB SMK Ahmad Dahlan" />
      
      <main className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <Link href="/" className={styles.logo}>SMK AD</Link>
            <h1>Lupa Kata Sandi</h1>
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

            <button type="submit" disabled={processing} className={styles.submitBtn}>
              {processing ? 'Memverifikasi...' : 'Verifikasi Data'}
            </button>
          </form>

          <div className={styles.footerLink}>
            <p>Ingat kata sandi? <Link href="/siswa/login">Masuk Kembali</Link></p>
          </div>
        </div>
      </main>
    </>
  );
}
