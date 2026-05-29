import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import styles from './KuotaPendaftaran.module.css';

export default function KuotaPendaftaran({ quotas = [] }) {
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
      <Head title="Kuota & Jalur Pendaftaran - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Kuota & Jalur Pendaftaran</h1>
          <p className={styles.breadcrumb}>
            <Link href="/">Beranda</Link> / Informasi Pendaftaran / Kuota
          </p>
        </div>
      </header>

      <main className={styles.container}>
        <section className={styles.intro}>
          <h2>Informasi Kapasitas & Jalur Masuk</h2>
          <p>Rincian batas daya tampung penerimaan siswa baru berdasarkan jalur masuk yang tersedia di SMK Ahmad Dahlan Sukadamai.</p>
        </section>

        <section className={styles.quotaGrid}>
          {quotas.length > 0 ? (
            quotas.map((item) => (
              <div key={item.id} className={styles.quotaCard}>
                <div className={styles.quotaCardHeader}>
                  <h3>{item.name}</h3>
                  <div className={styles.seatsBadge}>
                    <span className={styles.seatsLeft}>{item.sisa}</span>
                    <span className={styles.seatsTotal}>/ {item.quota_limit} Kursi Tersedia</span>
                  </div>
                </div>
                <div className={styles.quotaCardBody}>
                  <p>{item.description || 'Tidak ada deskripsi rincian untuk jalur pendaftaran ini.'}</p>
                </div>
                <div className={styles.quotaCardFooter}>
                  {item.sisa > 0 ? (
                    <span className={`${styles.statusText} ${styles.statusOpen}`}>Jalur Tersedia / Terbuka</span>
                  ) : (
                    <span className={`${styles.statusText} ${styles.statusClosed}`}>Kuota Penuh / Ditutup</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className={styles.emptyText}>Belum ada data kuota jalur pendaftaran yang tersedia.</p>
          )}
        </section>

        <section className={styles.guideCard}>
          <h3>Tips Memilih Jalur Masuk</h3>
          <ul>
            <li><strong>Jalur Domisili:</strong> Prioritas utama untuk calon siswa yang berjarak dekat dengan lokasi sekolah.</li>
            <li><strong>Jalur Prestasi:</strong> Unggul bagi calon siswa dengan raihan juara perlombaan atau nilai raport tinggi.</li>
            <li><strong>Jalur Afirmasi:</strong> Diperuntukkan khusus bagi pemegang KIP/PKH dan menyertakan Surat Keterangan Tidak Mampu (SKTM).</li>
          </ul>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2026 SMK Ahmad Dahlan Sukadamai. All Rights Reserved.</p>
      </footer>
    </>
  );
}
