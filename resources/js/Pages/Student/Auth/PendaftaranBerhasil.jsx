import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../../Components/Navbar/Navbar';
import Button from '../../../Components/Button/Button';
import Footer from '../../../Components/Footer/Footer';
import styles from './PendaftaranBerhasil.module.css';

export default function PendaftaranBerhasil({ registration = {} }) {
  const links = [
    { url: '/', label: 'Beranda' },
    { url: '/dashboard/siswa', label: 'Dasbor Siswa' }
  ];

  return (
    <>
      <Head title="Pendaftaran Berhasil - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <main className={styles.container}>
        <div className={styles.formCard}>

          <div className={styles.successHeader}>
            <img src="/login/siswa/buatAkun.png" alt="" />
            <h2 className={styles.successTitle}>Pendaftaran Sukses!</h2>
            <p className={styles.successDescription}>
              Selamat, berkas formulir pendaftaran Anda berhasil terkirim ke sistem kami. Silakan simpan detail registrasi berikut:
            </p>
          </div>

          {/* Registration Details Card */}
          <div className={styles.detailsCard}>
            <div className={styles.detailsRow}>
              <span className={styles.detailsLabel}>NO REGISTRASI</span>
              <span className={styles.detailsValueBold}>{registration.registration_number}</span>
            </div>
            <div className={styles.detailsRow}>
              <span className={styles.detailsLabel}>NAMA LENGKAP</span>
              <span className={styles.detailsValue}>{registration.full_name}</span>
            </div>
            <div className={styles.detailsRow}>
              <span className={styles.detailsLabel}>NISN</span>
              <span className={styles.detailsValue}>{registration.nisn}</span>
            </div>
            <div className={styles.detailsRowLast}>
              <span className={styles.detailsLabel}>JURUSAN</span>
              <span className={styles.detailsValue}>{registration.jurusan ? registration.jurusan.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '-'}</span>
            </div>
          </div>

          <div className={styles.infoAlert}>
            <strong>Informasi Penting:</strong>
            <p className={styles.infoText}>Anda dapat langsung mengunduh bukti pendaftaran di bawah ini untuk dibawa beserta berkas fisik KK, Akta, dan SKHU/SKL saat jadwal verifikasi tatap muka berlangsung di sekolah.</p>
          </div>

          {/* Action CTAs */}
          <div className={styles.actionsContainer}>
            <Button
              href="/dashboard/siswa/unduh-bukti"
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              external
            >
              Unduh Bukti Pendaftaran
            </Button>
            <Button
              href="/dashboard/siswa"
            >
              Masuk ke Dasbor Saya
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
