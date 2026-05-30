import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import styles from './Sejarah.module.css';

export default function Sejarah() {
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
      <Head title="Sejarah Singkat - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Sejarah Singkat</h1>
          <p className={styles.breadcrumb}>
            <Link href="/">Beranda</Link> / Profil / Sejarah Singkat
          </p>
        </div>
      </header>

      <main className={styles.container}>
        <article className={styles.historyArticle}>
          <h2>Awal Pendirian</h2>
          <p>SMK Ahmad Dahlan Sukadamai didirikan pada tahun 2012 oleh Pimpinan Cabang Muhammadiyah Sukadamai Kabupaten Lampung Selatan. Pendirian sekolah ini dilatarbelakangi oleh tingginya kebutuhan masyarakat akan adanya lembaga pendidikan kejuruan yang bermutu, terjangkau, dan berlandaskan nilai-nilai islami.</p>
          
          <p>Dengan semangat "Tajdid" (pembaruan) Muhammadiyah, sekolah ini awalnya dibuka dengan melayani satu program keahlian tunggal yaitu Teknik & Bisnis Sepeda Motor (TBSM), dengan fasilitas bengkel praktek sederhana dan jumlah siswa angkatan pertama sebanyak 35 siswa.</p>

          <h2>Masa Perkembangan</h2>
          <p>Seiring berjalannya waktu dan meningkatnya kepercayaan wali murid, pada tahun 2017, SMK Ahmad Dahlan secara resmi membuka program studi baru yaitu Perbankan Syariah (PBS). Pembukaan jurusan ini bertujuan memfasilitasi minat siswa di bidang jasa akuntansi dan keuangan berbasis syariat, yang perkembangannya sangat pesat di wilayah Lampung.</p>
          
          <p>Kerja sama strategis juga terus dikembangkan, salah satunya dengan PT. Astra Honda Motor (AHM) untuk mensinkronisasi kurikulum TBSM serta kemitraan bersama lembaga keuangan syariah setempat untuk penempatan magang/Prakerin siswa PBS.</p>

          <h2>SMK Ahmad Dahlan Hari Ini</h2>
          <p>Kini, SMK Ahmad Dahlan Sukadamai telah berkembang pesat dengan memiliki gedung representatif milik sendiri, fasilitas laboratorium komputer, bank mini syariah, bengkel modern berstandar industri, serta didukung oleh tenaga pendidik profesional yang berpengalaman di bidangnya.</p>
          
          <p>Pada akreditasi terakhir yang diselenggarakan oleh BAN-S/M, SMK Ahmad Dahlan berhasil mendapatkan predikat <strong>Akreditasi A (Unggul)</strong>. Hal ini menegaskan komitmen kami untuk terus melahirkan kader Muhammadiyah yang mandiri, islami, dan siap kerja menjawab tantangan industri masa kini.</p>
        </article>

        {/* Milestones timeline for professional visual polish */}
        <section className={styles.milestones}>
          <h3>Milestone Perjalanan</h3>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timeBadge}>2012</div>
              <div className={styles.timeContent}>
                <h4>Pendirian Pertama</h4>
                <p>Resmi didirikan dengan membuka Jurusan TBSM perdana.</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timeBadge}>2015</div>
              <div className={styles.timeContent}>
                <h4>Akreditasi Perdana</h4>
                <p>Memperoleh status terakreditasi B dan meluluskan angkatan alumni pertama.</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timeBadge}>2017</div>
              <div className={styles.timeContent}>
                <h4>Jurusan Baru PBS</h4>
                <p>Membuka kompetensi keahlian baru Perbankan Syariah.</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timeBadge}>2024</div>
              <div className={styles.timeContent}>
                <h4>Akreditasi A</h4>
                <p>Berhasil meraih predikat Akreditasi A (Unggul) dari BAN-S/M.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
