import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import styles from './JadwalSpmb.module.css';

export default function JadwalSpmb({ schedules = [] }) {
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

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const now = new Date()
  const year = now.getFullYear()

  return (
    <>
      <Head title="Jadwal Pendaftaran SPMB - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Jadwal Pendaftaran SPMB</h1>
          <p className={styles.breadcrumb}>
            <Link href="/">Beranda</Link> / Informasi Pendaftaran / Jadwal
          </p>
        </div>
      </header>

      <main className={styles.container}>
        <section className={styles.intro}>
          <h2>Timeline Alur & Tahapan Seleksi</h2>
          <p>Berikut adalah agenda penting pelaksanaan Penerimaan Peserta Didik Baru (PPDB/SPMB) SMK Ahmad Dahlan Sukadamai Tahun Ajaran {year}/{year + 1}</p>
        </section>

        <section className={styles.scheduleTimeline}>
          {schedules.length > 0 ? (
            schedules.map((stage, idx) => (
              <div className={styles.timelineCard}>
                <div className={styles.badge}>
                  <p>Tahap {idx + 1}</p>
                </div>
                <div>
                  <h2>{stage.title}</h2>
                  <p>{stage.description}</p>
                </div>
                <i>{formatDate(stage.start_date)} - {formatDate(stage.end_date)}</i>
              </div>
              // <div key={stage.id} className={styles.timelineCard}>
              //   <div className={styles.numberBadge}>{idx + 1}</div>
              //   <div className={styles.content}>
              //     <div className={styles.dateRange}>
              //       <span>{formatDate(stage.start_date)} s/d {formatDate(stage.end_date)}</span>
              //     </div>
              //     <h3>{stage.title}</h3>
              //     <p>{stage.description}</p>
              //   </div>
              // </div>
            ))
          ) : (
            <p className={styles.emptyText}>Belum ada jadwal pendaftaran yang dirilis.</p>
          )}
        </section>
      </main >

      <Footer />
    </>
  );
}
