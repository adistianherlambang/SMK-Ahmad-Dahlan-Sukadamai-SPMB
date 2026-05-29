import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import styles from './BeritaAll.module.css';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
    return path;
  }
  return `/${path}`;
};

export default function BeritaAll({ news = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head title="Berita & Informasi - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Berita & Informasi</h1>
          <p className={styles.breadcrumb}>
            <Link href="/">Beranda</Link> / Berita
          </p>
        </div>
      </header>

      <main className={styles.container}>
        {/* Search Bar */}
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Cari berita atau pengumuman..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* News Grid */}
        <section className={styles.newsList}>
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => (
              <Link key={item.id} href={`/berita/${item.id}`} className={styles.newsCard}>
                {item.image_path ? (
                  <img 
                    src={getImageUrl(item.image_path)} 
                    alt={item.title} 
                    className={styles.newsImg} 
                  />
                ) : (
                  <div className={styles.newsImgPlaceholder}>📰</div>
                )}
                <div className={styles.newsContent}>
                  <h3>{item.title}</h3>
                  <p>{item.content.substring(0, 80)}...</p>
                  <span className={styles.newsDate}>
                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className={styles.emptyText}>Tidak ada berita yang cocok dengan pencarian Anda.</p>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
