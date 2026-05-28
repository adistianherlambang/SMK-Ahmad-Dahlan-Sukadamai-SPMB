import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import styles from './Struktur.module.css';

export default function Struktur() {
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
      <Head title="Struktur Organisasi - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Struktur Organisasi</h1>
          <p className={styles.breadcrumb}>
            <Link href="/">Beranda</Link> / Profil / Struktur Organisasi
          </p>
        </div>
      </header>

      <main className={styles.container}>
        <section className={styles.intro}>
          <h2>Susunan Organisasi Sekolah</h2>
          <p>Tata kelola kepemimpinan dan manajemen operasional di SMK Ahmad Dahlan Sukadamai Tahun Ajaran 2026/2027.</p>
        </section>

        {/* Hierarchical flowchart nodes rendered with clean CSS flexboxes */}
        <section className={styles.hierarchyTree}>
          {/* Level 1: Kepala Sekolah */}
          <div className={styles.treeLevel}>
            <div className={`${styles.node} ${styles.nodeRoot}`}>
              <span className={styles.nodeRole}>KEPALA SEKOLAH</span>
              <span className={styles.nodeName}>H. Muhammad Sobri, M.Pd.</span>
            </div>
          </div>

          <div className={styles.treeConnector}></div>

          {/* Level 2: Komite Sekolah (Sideway helper) */}
          <div className={styles.treeLevel}>
            <div className={`${styles.node} ${styles.nodeSub}`}>
              <span className={styles.nodeRole}>KOMITE SEKOLAH</span>
              <span className={styles.nodeName}>Drs. H. Ahmad Dahlan, M.S.i.</span>
            </div>
          </div>

          <div className={styles.treeConnector}></div>

          {/* Level 3: Waka & Tata Usaha */}
          <div className={styles.treeLevelGrid}>
            <div className={styles.node}>
              <span className={styles.nodeRole}>WAKA KURIKULUM</span>
              <span className={styles.nodeName}>Zainal Abidin, S.Pd.</span>
            </div>
            <div className={styles.node}>
              <span className={styles.nodeRole}>WAKA KESISWAAN</span>
              <span className={styles.nodeName}>Hadi Prabowo, S.H.</span>
            </div>
            <div className={styles.node}>
              <span className={styles.nodeRole}>KAPALA TATA USAHA</span>
              <span className={styles.nodeName}>Fatimah Az-Zahra, A.Md.</span>
            </div>
          </div>

          <div className={styles.treeConnector}></div>

          {/* Level 4: Program Studi */}
          <div className={styles.treeLevelGrid}>
            <div className={`${styles.node} ${styles.nodeDept}`}>
              <span className={styles.nodeRole}>KAPROG TBSM</span>
              <span className={styles.nodeName}>Rahmat Hidayat, S.T.</span>
            </div>
            <div className={`${styles.node} ${styles.nodeDept}`}>
              <span className={styles.nodeRole}>KAPROG PBS</span>
              <span className={styles.nodeName}>Siti Nurhaliza, S.E., Sy.</span>
            </div>
          </div>

          <div className={styles.treeConnector}></div>

          {/* Level 5: Guru & Siswa */}
          <div className={styles.treeLevel}>
            <div className={`${styles.node} ${styles.nodeLeaf}`}>
              <span className={styles.nodeRole}>GURU, INSTRUKTUR & STAF</span>
              <span className={styles.nodeName}>Seluruh Tenaga Pendidik & Kependidikan</span>
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
