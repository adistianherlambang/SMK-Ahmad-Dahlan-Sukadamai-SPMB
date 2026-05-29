import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import styles from './Sambutan.module.css';

export default function Sambutan() {
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
      <Head title="Sambutan Kepala Sekolah - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Sambutan Kepala Sekolah</h1>
          <p className={styles.breadcrumb}>
            <Link href="/">Beranda</Link> / Profil / Sambutan Kepala Sekolah
          </p>
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.profileSection}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarPlaceholder}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className={styles.nameCard}>
            <h2>H. Muhammad Sobri, M.Pd.</h2>
            <p>Kepala SMK Ahmad Dahlan Sukadamai</p>
          </div>
        </div>

        <article className={styles.speechContent}>
          <h3>Assalamualaikum Warahmatullahi Wabarakatuh,</h3>
          
          <p>Puji syukur senantiasa kita panjatkan kehadirat Allah SWT atas limpahan rahmat, hidayah, dan karunia-Nya yang tiada henti. Shalawat beserta salam semoga selalu tercurahkan kepada uswatun hasanah kita, Nabi Agung Muhammad SAW.</p>
          
          <p>Selamat datang di portal Sistem Pendaftaran Mahasiswa/Siswa Baru (SPMB) SMK Ahmad Dahlan Sukadamai. Kami merasa sangat terhormat atas ketertarikan dan kepercayaan Bapak/Ibu sekalian yang memilih lembaga kami sebagai wadah perjuangan menuntut ilmu dan mengasah keterampilan putra-putri tercinta.</p>
          
          <p>Di era globalisasi yang sarat dengan persaingan teknologi dan industri, SMK Ahmad Dahlan Sukadamai berkomitmen untuk menyelenggarakan pendidikan vokasi kejuruan yang bermutu tinggi dan relevan dengan industri. Kami membina dua jurusan unggulan, yaitu Teknik & Bisnis Sepeda Motor (TBSM) serta Perbankan Syariah (PBS).</p>
          
          <p>Tidak hanya membekali kompetensi teknis (hardskills) yang siap kerja, kami juga menanamkan akhlakul karimah, jiwa kedisiplinan, kemandirian, dan ketakwaan berkarakter islami (softskills) bagi seluruh kader Muhammadiyah.</p>
          
          <p>Pendaftaran secara online mandiri ini dirancang untuk memudahkan para calon siswa baru dalam melakukan proses registrasi di mana saja dan kapan saja. Kami berharap sistem ini memberikan pengalaman pendaftaran yang transparan, profesional, dan efisien.</p>
          
          <p>Mari bergabung bersama keluarga besar SMK Ahmad Dahlan Sukadamai. Mari maju bersama, tumbuh berprestasi, dan bersiap menjadi generasi emas yang mandiri dan berdaya saing global.</p>
          
          <p className={styles.closing}>Nasrun Minallah Wa Fathun Qarib,<br /><strong>Wassalamualaikum Warahmatullahi Wabarakatuh.</strong></p>
        </article>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2026 SMK Ahmad Dahlan Sukadamai. All Rights Reserved.</p>
      </footer>
    </>
  );
}
