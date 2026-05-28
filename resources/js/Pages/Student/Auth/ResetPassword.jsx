import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import Input from '../../../Components/Input/Input';
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

  return (
    <>
      <Head title="Buat Kata Sandi Baru - SPMB SMK Ahmad Dahlan" />
      
      <main className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo}>🔒</div>
            <h1>Kata Sandi Baru</h1>
            <p>Silakan buat kata sandi baru yang kuat untuk akun portal siswa Anda.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {errors.password && <div className={styles.errorAlert}>{errors.password}</div>}
            
            <Input 
              label="Kata Sandi Baru"
              type="password"
              placeholder="Minimal 6 karakter..."
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              required
            />

            <Input 
              label="Konfirmasi Kata Sandi"
              type="password"
              placeholder="Ulangi kata sandi baru..."
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              required
            />

            <button type="submit" disabled={processing} className={styles.submitBtn}>
              {processing ? 'Menyimpan...' : 'Simpan Kata Sandi'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
