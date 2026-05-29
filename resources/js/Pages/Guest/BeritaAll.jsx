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
    { url: '/berita', label: 'Berita' },
    { url: '/siswa/login', label: 'Daftar Sekarang', method: 'post' }
  ];

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const firstNews = news[0]
  const restNews = news.slice(1)

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
        <div className={styles.title}>Berita Terkini</div>
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
        {searchTerm ? (
          filteredNews.length > 0 ? (
            <div className={styles.newsList}>
              {filteredNews.map((item) => (
                <Link key={item.id} href={`/berita/${item.id}`} className={styles.newsCard}>
                  {item.image_path ? (
                    <img
                      src={getImageUrl(item.image_path)}
                      alt={item.title}
                      className={styles.newsImg}
                    />
                  ) : (
                    <div className={styles.newsImgPlaceholder}></div>
                  )}
                  <div className={styles.newsContent}>
                    <h3>{item.title}</h3>
                    <p>{item.content.substring(0, 80)}...</p>
                    <span className={styles.newsDate}>
                      {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>Tidak ada berita yang cocok dengan pencarian Anda.</p>
          )
        ) : (
          firstNews ? (
            <div className={styles.newsList}>
              <Link key={firstNews.id} href={`/berita/${firstNews.id}`} className={styles.firstNewsCard}>
                {firstNews.image_path ? (
                  <img
                    src={getImageUrl(firstNews.image_path)}
                    alt={firstNews.title}
                    className={styles.firstNewsImg}
                  />
                ) : (
                  <div className={styles.firstNewsPlaceholder}></div>
                )}
                <div className={styles.firstNewsOverlay}></div>
                <div className={styles.firstNewsContent}>
                  <span className={styles.firstNewsDate}>
                    {new Date(firstNews.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <h3>{firstNews.title}</h3>
                  <p>{firstNews.content.substring(0, 150)}...</p>
                </div>
              </Link>
              {restNews.map((item) => (
                <Link key={item.id} href={`/berita/${item.id}`} className={styles.newsCard}>
                  {item.image_path ? (
                    <img
                      src={getImageUrl(item.image_path)}
                      alt={item.title}
                      className={styles.newsImg}
                    />
                  ) : (
                    <div className={styles.newsImgPlaceholder}></div>
                  )}
                  <div className={styles.newsContent}>
                    <h3>{item.title}</h3>
                    <p>{item.content.substring(0, 80)}...</p>
                    <span className={styles.newsDate}>
                      {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>Tidak ada berita yang diunggah.</p>
          )
        )}
      </main>

      <Footer />
    </>
  );
}
