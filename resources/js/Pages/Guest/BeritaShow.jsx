import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import styles from './BeritaShow.module.css';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
    return path;
  }
  return `/${path}`;
};

export default function BeritaShow({ post }) {
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

  if (!post) {
    return (
      <>
        <Head title="Berita Tidak Ditemukan" />
        <Navbar links={links} />
        <div className={styles.container}>
          <p className={styles.emptyText}>Berita tidak ditemukan atau telah dihapus.</p>
          <Link href="/berita" className={styles.backBtn}>Kembali ke Berita</Link>
        </div>
      </>
    );
  }

  // Format date beautifully
  const formattedDate = new Date(post.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <>
      <Head title={`${post.title} - SMK Ahmad Dahlan`} />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <p className={styles.breadcrumb}>
            <Link href="/">Beranda</Link> / <Link href="/berita">Berita</Link> / {post.title}
          </p>
        </div>
      </header>

      <main className={styles.container}>
        <article className={styles.article}>
          <h1 className={styles.title}>{post.title}</h1>
          
          <div className={styles.meta}>
            <span className={styles.date}>📅 {formattedDate}</span>
            <span className={styles.type}>🏷️ {post.type === 'pengumuman' ? 'Pengumuman' : 'Berita'}</span>
          </div>

          {post.image_path && (
            <div className={styles.imageWrapper}>
              <img 
                src={getImageUrl(post.image_path)} 
                alt={post.title} 
                className={styles.image}
              />
            </div>
          )}

          <div className={styles.content}>
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className={styles.actions}>
            <Link href="/berita" className={styles.backBtn}>
              ← Kembali ke Berita
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
