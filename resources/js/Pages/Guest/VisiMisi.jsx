import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import styles from './VisiMisi.module.css';

export default function VisiMisi() {
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
    { url: '/berita', label: 'Berita' }
  ];

  return (
    <>
      <Head title="Visi & Misi - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Visi & Misi</h1>
          <p className={styles.breadcrumb}>
            <Link href="/">Beranda</Link> / Profil / Visi Misi
          </p>
        </div>
      </header>

      <main className={styles.container}>
        <section className={styles.visiSection}>
          <div className={styles.iconBadge}>🎯</div>
          <h2>Visi Sekolah</h2>
          <p className={styles.visiText}>
            "Menjadi lembaga pendidikan vokasi kejuruan yang unggul, menghasilkan lulusan berkompeten, mandiri, berkarakter islami, dan berdaya saing tinggi di tingkat nasional maupun internasional."
          </p>
        </section>

        <section className={styles.misiSection}>
          <div className={styles.iconBadge}>📋</div>
          <h2>Misi Sekolah</h2>
          <ol className={styles.misiList}>
            <li>Menyelenggarakan proses pembelajaran kejuruan berkualitas berlandaskan kurikulum industri nasional dan standar nilai Muhammadiyah.</li>
            <li>Membina potensi keterampilan (skills) siswa melalui penyediaan sarana praktek perbengkelan TBSM dan laboratorium bank syariah yang mumpuni.</li>
            <li>Menumbuhkan jiwa kemandirian, kepemimpinan, kewirausahaan (entrepreneurship), dan etos kerja profesional pada diri siswa.</li>
            <li>Membentuk kepribadian siswa yang berakhlakul karimah, disiplin, berintegritas, dan istiqamah menjalankan syariat islam.</li>
            <li>Membangun kemitraan dan jejaring kerja sama yang luas dengan dunia usaha, dunia industri (DUDI), dan instansi pemerintah guna penyaluran lulusan.</li>
          </ol>
        </section>

        <section className={styles.valuesSection}>
          <h2>Nilai Karakter Utama</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <h4>Kompeten</h4>
              <p>Menguasai keterampilan vokasi secara mendalam sesuai bidang keahlian.</p>
            </div>
            <div className={styles.valueCard}>
              <h4>Religius</h4>
              <p>Menerapkan ajaran islam, berakhlak mulia, dan beradab islami dalam keseharian.</p>
            </div>
            <div className={styles.valueCard}>
              <h4>Mandiri</h4>
              <p>Tangguh menghadapi rintangan, percaya diri, dan berjiwa kewirausahaan.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2026 SMK Ahmad Dahlan Sukadamai. All Rights Reserved.</p>
      </footer>
    </>
  );
}
