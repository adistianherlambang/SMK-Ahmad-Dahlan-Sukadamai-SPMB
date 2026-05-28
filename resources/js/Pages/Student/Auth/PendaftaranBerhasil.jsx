import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../../Components/Navbar/Navbar';
import styles from './Formulir.module.css'; // Re-use main container/card wrapper styles

export default function PendaftaranBerhasil({ registration = {} }) {
  const links = [
    { url: '/', label: 'Beranda' },
    { url: '/dashboard/siswa', label: 'Dasbor Siswa' }
  ];

  return (
    <>
      <Head title="Pendaftaran Berhasil - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Pendaftaran Berhasil</h1>
          <p className={styles.breadcrumb}>
            <Link href="/">Beranda</Link> / Pendaftaran / Berhasil
          </p>
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.formCard} style={{ textAlign: 'center' }}>
          <div className={styles.stepIndicator}>
            <div className={styles.step}>
              <div className={styles.stepNum} style={{ backgroundColor: 'var(--color-success)', color: 'white', border: 'none' }}>✓</div>
              <span>Form Data</span>
            </div>
            <div className={styles.stepLine} style={{ backgroundColor: 'var(--color-success)' }}></div>
            <div className={styles.step}>
              <div className={styles.stepNum} style={{ backgroundColor: 'var(--color-success)', color: 'white', border: 'none' }}>✓</div>
              <span>Buat Akun</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', margin: '24px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#E6FFFA', color: '#319795', display: 'flex', alignItems: 'center', justifycontent: 'center', fontSize: '32px', fontWeight: 'bold' }}>🎉</div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-primary-dark)', textTransform: 'uppercase', marginTop: '12px' }}>Pendaftaran Sukses!</h2>
            <p style={{ fontSize: '13px', color: '#718096', maxWidth: '400px', margin: '0 auto', lineHeight: '1.5' }}>
              Selamat, berkas formulir pendaftaran Anda berhasil terkirim ke sistem kami. Silakan simpan detail registrasi berikut:
            </p>
          </div>

          {/* Registration Details Card */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '20px', textAlign: 'left', margin: '24px 0', display: 'flex', flexdirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #EDF2F7', paddingBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#718096', fontWeight: '600' }}>NO REGISTRASI</span>
              <span style={{ fontSize: '14px', color: 'var(--color-primary-dark)', fontWeight: '800' }}>{registration.registration_number}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #EDF2F7', paddingBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#718096', fontWeight: '600' }}>NAMA LENGKAP</span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-main)', fontWeight: '700' }}>{registration.full_name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #EDF2F7', paddingBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#718096', fontWeight: '600' }}>NISN</span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-main)', fontWeight: '700' }}>{registration.nisn}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#718096', fontWeight: '600' }}>JALUR MASUK</span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-main)', fontWeight: '700' }}>{registration.quota?.name}</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFDF0', border: '1px solid #FEFCBF', borderRadius: '4px', padding: '12px 16px', fontSize: '12px', color: '#744210', textAlign: 'left', lineHeight: '1.6', margin: '24px 0' }}>
            <strong>💡 Informasi Penting:</strong>
            <p style={{ margin: '4px 0 0 0' }}>Anda dapat langsung mengunduh bukti pendaftaran di bawah ini untuk dibawa beserta berkas fisik KK, Akta, dan SKHU/SKL saat jadwal verifikasi tatap muka berlangsung di sekolah.</p>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            <a 
              href="/dashboard/siswa/unduh-bukti" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.submitBtn} 
              style={{ textDecoration: 'none', display: 'block', textAlign: 'center', backgroundColor: 'var(--color-accent-yellow)', color: 'var(--color-text-main)' }}
            >
              📥 Unduh Bukti Pendaftaran
            </a>
            <Link 
              href="/dashboard/siswa" 
              className={styles.submitBtn} 
              style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
            >
              Masuk ke Dasbor Saya
            </Link>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2026 SMK Ahmad Dahlan Sukadamai. All Rights Reserved.</p>
      </footer>
    </>
  );
}
