import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import Button from '../../Components/Button/Button';
import styles from './Landing.module.css';

import Batik from '../../Components/Batik/Batik';

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
    { url: '/berita', label: 'Berita' },
    { url: '/siswa/login', label: 'Daftar Sekarang', method: 'post' },
    { url: '/admin/login', label: 'Login Admin' }
  ];

  const fasilitas = [
    {
      "title": "Gedung Sekolah",
      "desc": "Gedung sekolah dan fasilitas pendukung digunakan untuk menunjang kegiatan belajar mengajar secara optimal.",
      "img": "/landingPage/landing/dummy.png",
    },
    {
      "title": "Laboratorium Komputer",
      "desc": "Laboratorium komputer digunakan untuk praktik teknologi informasi dan pembelajaran berbasis digital.",
      "img": "/landingPage/landing/dummy.png",
    },
    {
      "title": "Perpustakaan",
      "desc": "Perpustakaan menyediakan sumber belajar dan ruang membaca yang nyaman bagi siswa dan guru.",
      "img": "/landingPage/landing/dummy.png",
    },
    {
      "title": "Sarana Ibadah",
      "desc": "Sarana ibadah digunakan untuk kegiatan keagamaan dan pembinaan karakter spiritual siswa.",
      "img": "/landingPage/landing/dummy.png",
    },
    {
      "title": "Kantin Sekolah",
      "desc": "Kantin sekolah menyediakan makanan dan minuman yang bersih, sehat, dan terjangkau.",
      "img": "/landingPage/landing/dummy.png",
    }
  ]

  const ekstra = [
    {
      "title": "Fulsal",
      "img": "/landingPage/landing/dummy.png",
    },
    {
      "title": "Paskibra",
      "img": "/landingPage/landing/dummy.png",
    },
    {
      "title": "Rohis",
      "img": "/landingPage/landing/dummy.png",
    },
    {
      "title": "PMR",
      "img": "/landingPage/landing/dummy.png",
    },
    {
      "title": "Pramuka",
      "img": "/landingPage/landing/dummy.png",
    }
  ]

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
      <div className={styles.perkList}>
        {fasilitas.map((item, index) => (
          <div className={styles.perkItem} key={index}>
            <div className={styles.perkImg}>
              <img src={item.img} alt={item.title} />
            </div>
            <div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const renderEkskul = () => (
    <div className={styles.accBody}>
      <div className={styles.perkList}>
        {ekstra.map((item, index) => (
          <div className={styles.perkItem} key={index}>
            <div className={styles.perkImg}>
              <img src={item.img} alt={item.title} />
            </div>
            <div>
              <h4>{item.title}</h4>
            </div>
          </div>
        ))}
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
              <div className={styles.perkImg}>
                {item.image_path ? (
                  <img src={getImageUrl(item.image_path)} alt={item.student_name} />
                ) : (
                  <div className={styles.achImagePlaceholder}>{item.student_name}</div>
                )}
              </div>
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

  const firstNews = news[0]
  const restNews = news.slice(1)

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
                    backgroundImage: `url('${encodeURI(getImageUrl(slide.image_path))}')`,
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
                      <h2 className={styles.slideTitle}>{slide.title}</h2>
                      <p className={styles.slideDesc}>
                        {slide.content.substring(0, 50)}{slide.content.length > 50 ? '...' : ''}
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
                  <Button href="/siswa/formulir" size="lg">Daftar Sekarang</Button>
                  <Button href="/siswa/login" variant="secondary" size="lg">Login Siswa</Button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 2: Tentang Kami */}
        <section className={styles.aboutSection}>
          <div className={styles.aboutContainer}>
            <h2>Tentang Kami</h2>
            <p className={styles.aboutSubtitle}>
              <b>SMK Ahmad Dahlan Sukadamai</b> merupakan sekolah menengah kejuruan yang berdiri pada tanggal <i>18 April 2018</i> di Jalan KH. Ahmad Dahlan No. 01 Sukadamai, Kecamatan Natar, Kabupaten Lampung Selatan. Sekolah ini didirikan untuk menyediakan pendidikan kejuruan yang berkualitas dengan mengintegrasikan pembelajaran teori dan praktik secara seimbang guna mempersiapkan peserta didik yang kompeten, profesional, dan siap menghadapi dunia kerja. SMK Ahmad Dahlan Sukadamai memiliki dua bidang keahlian utama, yaitu <b>Teknik</b> dan <b>Ekonomi</b>, serta didukung oleh tenaga pendidik yang berkomitmen dalam membentuk lulusan yang unggul dalam prestasi, teknologi, dan berakhlak mulia sesuai dengan visi sekolah. Selain fokus pada pengembangan akademik dan keterampilan, sekolah juga terus meningkatkan mutu pelayanan pendidikan melalui pemanfaatan teknologi informasi dalam penyebaran informasi dan pengelolaan data sekolah secara terintegrasi.
            </p>
          </div>
          <div className={styles.batik}>
            <Batik section="atas" color="var(--color-primary-dark)" />
            <Batik section="bawah" color="var(--color-primary-dark)" />
          </div>
        </section>

        {/* SECTION 3: Video Embed */}
        {/* <section className={styles.videoSection}>
          <div className={styles.videoContainer}>
            <div className={styles.videoWrapper}>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Profile Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section> */}

        {/* SECTION 4: Accordion Keunggulan */}
        <section className={styles.perksSection}>
          <div className={styles.perksContainer}>
            <h2>Keunggulan Sekolah</h2>

            {/* Mobile Accordion Layout */}
            <div className={styles.mobileAccordion}>
              {/* Accordion Item 1: Fasilitas */}
              <div className={styles.accItem}>
                <button
                  className={styles.accHeader}
                  onClick={() => setOpenSection(openSection === 'fasilitas' ? '' : 'fasilitas')}
                >
                  <div className={styles.accTitle}>
                    <span>Fasilitas & Layanan</span>
                    <p>Meliputi gedung sekolah, ruang belajar, laboratorium, lapangan olahraga, ruang ibadah, dll. </p>
                  </div>
                  <span className={styles.accArrow}>{openSection === 'fasilitas' ?
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.6924 3.39763L16 4.78573L8.8734 12.3464C8.75921 12.4683 8.62342 12.565 8.47384 12.631C8.32426 12.697 8.16386 12.731 8.00185 12.731C7.83985 12.731 7.67944 12.697 7.52986 12.631C7.38029 12.565 7.2445 12.4683 7.1303 12.3464L1.04668e-06 4.78573L1.30763 3.39893L8 10.4951L14.6924 3.39763Z" fill="currentColor" />
                    </svg>
                    :
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.30763 12.6024L-9.47459e-08 11.2143L7.1266 3.65362C7.24079 3.53174 7.37658 3.43502 7.52616 3.36902C7.67574 3.30302 7.83614 3.26904 7.99815 3.26904C8.16016 3.26904 8.32056 3.30302 8.47014 3.36902C8.61971 3.43502 8.75551 3.53174 8.8697 3.65362L16 11.2143L14.6924 12.6011L8 5.50486L1.30763 12.6024Z" fill="currentColor" />
                    </svg>
                  }</span>
                </button>
                <div className={`${styles.accCollapse} ${openSection === 'fasilitas' ? styles.accCollapseOpen : ''}`}>
                  <div className={styles.accCollapseInner}>
                    {renderFasilitas()}
                  </div>
                </div>
              </div>

              {/* Accordion Item 2: Ekstrakurikuler */}
              <div className={styles.accItem}>
                <button
                  className={styles.accHeader}
                  onClick={() => setOpenSection(openSection === 'ekskul' ? '' : 'ekskul')}
                >
                  <div className={styles.accTitle}>
                    <span>Ekstrakurikuler</span>
                    <p>Ekstrakurikuler untuk mengembangkan potensi dan keterampilan siswa.</p>
                  </div>
                  <span className={styles.accArrow}>{openSection === 'ekskul' ?
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.6924 3.39763L16 4.78573L8.8734 12.3464C8.75921 12.4683 8.62342 12.565 8.47384 12.631C8.32426 12.697 8.16386 12.731 8.00185 12.731C7.83985 12.731 7.67944 12.697 7.52986 12.631C7.38029 12.565 7.2445 12.4683 7.1303 12.3464L1.04668e-06 4.78573L1.30763 3.39893L8 10.4951L14.6924 3.39763Z" fill="currentColor" />
                    </svg>
                    :
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.30763 12.6024L-9.47459e-08 11.2143L7.1266 3.65362C7.24079 3.53174 7.37658 3.43502 7.52616 3.36902C7.67574 3.30302 7.83614 3.26904 7.99815 3.26904C8.16016 3.26904 8.32056 3.30302 8.47014 3.36902C8.61971 3.43502 8.75551 3.53174 8.8697 3.65362L16 11.2143L14.6924 12.6011L8 5.50486L1.30763 12.6024Z" fill="currentColor" />
                    </svg>
                  }</span>
                </button>
                <div className={`${styles.accCollapse} ${openSection === 'ekskul' ? styles.accCollapseOpen : ''}`}>
                  <div className={styles.accCollapseInner}>
                    {renderEkskul()}
                  </div>
                </div>
              </div>

              {/* Accordion Item 3: Prestasi */}
              <div className={styles.accItem}>
                <button
                  className={styles.accHeader}
                  onClick={() => setOpenSection(openSection === 'prestasi' ? '' : 'prestasi')}
                >
                  <div className={styles.accTitle}>
                    <span>Daftar Prestasi Siswa</span>
                    <p>Banyak prestasi yang telah diraih oleh sekolah kami, baik prestasi tingkat nasional maupun internasional.</p>
                  </div>
                  <span className={styles.accArrow}>{openSection === 'prestasi' ?
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.6924 3.39763L16 4.78573L8.8734 12.3464C8.75921 12.4683 8.62342 12.565 8.47384 12.631C8.32426 12.697 8.16386 12.731 8.00185 12.731C7.83985 12.731 7.67944 12.697 7.52986 12.631C7.38029 12.565 7.2445 12.4683 7.1303 12.3464L1.04668e-06 4.78573L1.30763 3.39893L8 10.4951L14.6924 3.39763Z" fill="currentColor" />
                    </svg>
                    :
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.30763 12.6024L-9.47459e-08 11.2143L7.1266 3.65362C7.24079 3.53174 7.37658 3.43502 7.52616 3.36902C7.67574 3.30302 7.83614 3.26904 7.99815 3.26904C8.16016 3.26904 8.32056 3.30302 8.47014 3.36902C8.61971 3.43502 8.75551 3.53174 8.8697 3.65362L16 11.2143L14.6924 12.6011L8 5.50486L1.30763 12.6024Z" fill="currentColor" />
                    </svg>
                  }</span>
                </button>
                <div className={`${styles.accCollapse} ${openSection === 'prestasi' ? styles.accCollapseOpen : ''}`}>
                  <div className={styles.accCollapseInner}>
                    {renderPrestasi()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Berita Terkini */}
        <section className={styles.newsSection}>
          <div className={styles.newsContainer}>
            <h2>Berita Terkini</h2>
            {news.length > 0 ? (
              <div className={styles.newsList}>
                {firstNews &&
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
                }
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
              <p className={styles.emptyText}>Belum ada berita yang diunggah.</p>
            )}
            <Link href="/berita" className={styles.allNewsBtn}>Tampilkan Semua Berita</Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
