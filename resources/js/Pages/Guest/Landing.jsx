import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import styles from './Landing.module.css';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
    return path;
  }
  return `/${path}`;
};

export default function Landing({ announcements = [], news = [], achievements = [] }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [openSection, setOpenSection] = useState('fasilitas'); // Accordion state
  const [selectedYear, setSelectedYear] = useState('Semua');

  // Navigation Links
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

  // Auto-slide for announcement banner
  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % announcements.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [announcements]);

  // Unique years of achievements
  const years = ['Semua', ...new Set(achievements.map((a) => String(a.year)))];

  const filteredAchievements = selectedYear === 'Semua'
    ? achievements
    : achievements.filter((a) => String(a.year) === selectedYear);

  // Contents Renderers to avoid code duplication
  const renderFasilitas = () => (
    <div className={styles.accBody}>
      <div className={styles.perkItem}>
        <div className={styles.perkImg}>⚙️</div>
        <div>
          <h4>Bengkel Praktek TBSM Standar Astra</h4>
          <p>Ruang praktek khusus dengan fasilitas tools modern setara bengkel resmi untuk praktek motor injeksi.</p>
        </div>
      </div>
      <div className={styles.perkItem}>
        <div className={styles.perkImg}>💻</div>
        <div>
          <h4>Laboratorium Bank Mini Syariah</h4>
          <p>Aplikasi simulasi perbankan syariah riil bagi praktek teller, customer service, dan pembukuan.</p>
        </div>
      </div>
      <div className={styles.perkItem}>
        <div className={styles.perkImg}>📚</div>
        <div>
          <h4>Perpustakaan Lengkap & Wifi Area</h4>
          <p>Koleksi ribuan buku pelajaran, umum, keagamaan, serta layanan akses internet gratis.</p>
        </div>
      </div>
    </div>
  );

  const renderEkskul = () => (
    <div className={styles.accBody}>
      <div className={styles.ekskulGrid}>
        <div className={styles.ekskulItem}>
          <div className={styles.ekskulImg}>🕌</div>
          <h4>Ikatan Remaja Muhammadiyah (IRM)</h4>
        </div>
        <div className={styles.ekskulItem}>
          <div className={styles.ekskulImg}>⚽</div>
          <h4>Futsal & Sepakbola</h4>
        </div>
        <div className={styles.ekskulItem}>
          <div className={styles.ekskulImg}>🥋</div>
          <h4>Tapak Suci (Pencak Silat)</h4>
        </div>
        <div className={styles.ekskulItem}>
          <div className={styles.ekskulImg}>🏕️</div>
          <h4>Hizbul Wathan (Pramuka)</h4>
        </div>
      </div>
    </div>
  );

  const renderPrestasi = () => (
    <div className={styles.accBody}>
      {/* Horizontal Year Filter */}
      <div className={styles.yearFilters}>
        {years.map((year) => (
          <button
            key={year}
            className={`${styles.filterBtn} ${selectedYear === year ? styles.filterBtnActive : ''}`}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </button>
        ))}
      </div>

      <div className={styles.achievementsSlider}>
        {filteredAchievements.length > 0 ? (
          filteredAchievements.map((item) => (
            <div key={item.id} className={styles.achievementCard}>
              {item.image_path ? (
                <img
                  src={getImageUrl(item.image_path)}
                  alt={item.title}
                  className={styles.achImage}
                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                />
              ) : (
                <div className={styles.achImagePlaceholder}>🏆</div>
              )}
              <div className={styles.achContent}>
                <h4>{item.title}</h4>
                <p className={styles.achName}>{item.student_name}</p>
                <span className={styles.achYear}>{item.year}</span>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.emptyText}>Tidak ada prestasi terdata pada tahun ini.</p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Head title="Home - SMK Ahmad Dahlan Sukadamai" />
      <Navbar links={links} />

      <main className={styles.main}>
        {/* SECTION 1: Announcement Slider */}
        <section className={styles.sliderSection}>
          {announcements.length > 0 ? (
            <div className={styles.slider}>
              {announcements.map((slide, idx) => {
                const isActive = idx === activeSlide;
                const bgStyle = slide.image_path
                  ? {
                    backgroundImage: `linear-gradient(228deg, rgba(0, 0, 0, 0) 44.49%, rgba(0, 0, 0, 0.8) 94.37%), url('${encodeURI(getImageUrl(slide.image_path))}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                  : {};

                return (
                  <div
                    key={slide.id}
                    className={`${styles.slide} ${isActive ? styles.slideActive : ''}`}
                    style={bgStyle}
                  >
                    <div className={styles.slideContent}>
                      <span className={styles.slideTag}>PENGUMUMAN</span>
                      <h2 className={styles.slideTitle}>{slide.title}</h2>
                      <p className={styles.slideDesc}>
                        {slide.content.substring(0, 100)}{slide.content.length > 100 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div className={styles.sliderIndicators}>
                {announcements.map((_, idx) => (
                  <button
                    key={idx}
                    className={`${styles.indicator} ${idx === activeSlide ? styles.indicatorActive : ''}`}
                    onClick={() => setActiveSlide(idx)}
                  ></button>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.heroBanner}>
              <div className={styles.heroContent}>
                <h1>Selamat Datang di SPMB</h1>
                <h2>SMK Ahmad Dahlan Sukadamai</h2>
                <p>Membentuk generasi ahli kejuruan yang cerdas, kompeten, dan berkarakter islami.</p>
                <div className={styles.ctaGroup}>
                  <Link href="/siswa/formulir" className={styles.ctaBtnPrimary}>Daftar Sekarang</Link>
                  <Link href="/siswa/login" className={styles.ctaBtnSecondary}>Login Siswa</Link>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Hero CTA for when announcements are showing */}
        {announcements.length > 0 && (
          <section className={styles.quickCta}>
            <div className={styles.ctaGrid}>
              <Link href="/siswa/formulir" className={styles.ctaCard}>
                <h3>Daftar Calon Siswa</h3>
                <p>Isi formulir pendaftaran online di sini.</p>
                <span className={styles.cardArrow}>→</span>
              </Link>
              <Link href="/siswa/login" className={styles.ctaCard}>
                <h3>Dasbor Calon Siswa</h3>
                <p>Periksa hasil seleksi dan verifikasi berkas.</p>
                <span className={styles.cardArrow}>→</span>
              </Link>
            </div>
          </section>
        )}

        {/* SECTION 2: Tentang Kami */}
        <section className={styles.aboutSection}>
          <div className={styles.aboutContainer}>
            <h2>Kompetensi Keahlian</h2>
            <p className={styles.aboutSubtitle}>SMK Ahmad Dahlan Sukadamai berfokus pada dua pilar kompetensi utama yang dikembangkan secara intensif:</p>

            <div className={styles.departmentGrid}>
              <div className={styles.departmentCard}>
                <div className={styles.depIcon}>🏍️</div>
                <h3>Teknik & Bisnis Sepeda Motor (TBSM)</h3>
                <p>Membekali siswa dengan keahlian pemeliharaan, diagnosis kerusakan, kelistrikan, serta manajemen perbengkelan sepeda motor standar industri.</p>
              </div>
              <div className={styles.departmentCard}>
                <div className={styles.depIcon}>🏦</div>
                <h3>Perbankan Syariah (PBS)</h3>
                <p>Membentuk profesional muda di bidang keuangan syariah, administrasi bank, pengelolaan akuntansi syariah, dan dasar hukum transaksi muamalah.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Video Embed */}
        <section className={styles.videoSection}>
          <div className={styles.videoContainer}>
            <h2>Video Profil Sekolah</h2>
            <p>Saksikan sekilas kegiatan belajar mengajar dan fasilitas praktek di sekolah kami.</p>
            <div className={styles.videoWrapper}>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Profile Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* SECTION 4: Accordion Keunggulan */}
        <section className={styles.perksSection}>
          <div className={styles.perksContainer}>
            <h2>Keunggulan Sekolah</h2>

            {/* Desktop Tabs Layout */}
            <div className={styles.desktopTabs}>
              <div className={styles.tabSidebar}>
                <button
                  className={`${styles.tabBtn} ${openSection === 'fasilitas' ? styles.tabBtnActive : ''}`}
                  onClick={() => setOpenSection('fasilitas')}
                >
                  ⚙️ Fasilitas & Layanan
                </button>
                <button
                  className={`${styles.tabBtn} ${openSection === 'ekskul' ? styles.tabBtnActive : ''}`}
                  onClick={() => setOpenSection('ekskul')}
                >
                  ⚽ Ekstrakurikuler
                </button>
                <button
                  className={`${styles.tabBtn} ${openSection === 'prestasi' ? styles.tabBtnActive : ''}`}
                  onClick={() => setOpenSection('prestasi')}
                >
                  🏆 Prestasi Siswa
                </button>
              </div>
              <div className={styles.tabContent}>
                {openSection === 'fasilitas' && renderFasilitas()}
                {openSection === 'ekskul' && renderEkskul()}
                {openSection === 'prestasi' && renderPrestasi()}
              </div>
            </div>

            {/* Mobile Accordion Layout */}
            <div className={styles.mobileAccordion}>
              {/* Accordion Item 1: Fasilitas */}
              <div className={styles.accItem}>
                <button
                  className={styles.accHeader}
                  onClick={() => setOpenSection(openSection === 'fasilitas' ? '' : 'fasilitas')}
                >
                  <span>Fasilitas & Layanan</span>
                  <span className={styles.accArrow}>{openSection === 'fasilitas' ? '▲' : '▼'}</span>
                </button>
                {openSection === 'fasilitas' && renderFasilitas()}
              </div>

              {/* Accordion Item 2: Ekstrakurikuler */}
              <div className={styles.accItem}>
                <button
                  className={styles.accHeader}
                  onClick={() => setOpenSection(openSection === 'ekskul' ? '' : 'ekskul')}
                >
                  <span>Ekstrakurikuler</span>
                  <span className={styles.accArrow}>{openSection === 'ekskul' ? '▲' : '▼'}</span>
                </button>
                {openSection === 'ekskul' && renderEkskul()}
              </div>

              {/* Accordion Item 3: Prestasi */}
              <div className={styles.accItem}>
                <button
                  className={styles.accHeader}
                  onClick={() => setOpenSection(openSection === 'prestasi' ? '' : 'prestasi')}
                >
                  <span>Daftar Prestasi Siswa</span>
                  <span className={styles.accArrow}>{openSection === 'prestasi' ? '▲' : '▼'}</span>
                </button>
                {openSection === 'prestasi' && renderPrestasi()}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Berita Terkini */}
        <section className={styles.newsSection}>
          <div className={styles.newsContainer}>
            <h2>Berita Terkini</h2>
            <div className={styles.newsList}>
              {news.length > 0 ? (
                news.map((item) => (
                  <div key={item.id} className={styles.newsCard}>
                    {item.image_path ? (
                      <img
                        src={getImageUrl(item.image_path)}
                        alt={item.title}
                        className={styles.newsImg}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
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
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>Belum ada berita yang diunggah.</p>
              )}
            </div>
            <Link href="/berita" className={styles.allNewsBtn}>Tampilkan Semua Berita</Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <h3>SMK Ahmad Dahlan Sukadamai</h3>
          <p>Maju bersama, mencetak kader kejuruan tangguh, kreatif, dan islami.</p>
          <div className={styles.footerMeta}>
            <p>📍 Jl. KH Ahmad Dahlan No. 1 Sukadamai, Kabupaten Lampung Selatan</p>
            <p>📞 Hubungi Kami: 0852-XXXX-XXXX | ✉️ info@smkahmaddahlan.sch.id</p>
          </div>
          <div className={styles.developerCta}>
            <Link href="/admin/login" className={styles.adminLoginLink}>Portal Admin</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2026 SMK Ahmad Dahlan Sukadamai. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}
