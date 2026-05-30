import React from 'react';
import { Head, router } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import styles from './AdminDashboard.module.css';

export default function Dashboard({ registrations = [], quotas = [], years = [], stats = {}, filters = {} }) {
  const links = [
    { url: '/admin/dashboard', label: 'Dasbor' },
    { url: '/admin/verifikasi-berkas', label: 'Verifikasi Berkas' },
    { url: '/admin/penentuan-kelulusan', label: 'Kelulusan' },
    {
      label: 'Data Master',
      dropdown: [
        { url: '/admin/schedules', label: 'Kelola Jadwal' },
        { url: '/admin/quotas', label: 'Kelola Kuota' },
        { url: '/admin/posts', label: 'Kelola Berita/Pengumuman' },
        { url: '/admin/achievements', label: 'Kelola Prestasi' }
      ]
    },
    { url: '/logout', label: 'Keluar', method: 'post' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    router.get('/admin/dashboard', updatedFilters, { preserveState: true });
  };

  const getUnifiedStatus = (student) => {
    if (student.verification_status === 'Menunggu Verifikasi') {
      return 'Menunggu Verifikasi';
    }
    if (student.verification_status === 'Berkas Ditolak') {
      return 'Berkas Ditolak';
    }
    if (student.verification_status === 'Terverifikasi') {
      if (student.graduation_status === 'Diterima') {
        return 'Diterima';
      }
      if (student.graduation_status === 'Tidak Lulus') {
        return 'Tidak Lulus';
      }
      return 'Terverifikasi';
    }
    return 'Menunggu Verifikasi';
  };

  const getUnifiedStatusClass = (student) => {
    if (student.verification_status === 'Menunggu Verifikasi') {
      return styles.badgeWarning;
    }
    if (student.verification_status === 'Berkas Ditolak') {
      return styles.badgeDanger;
    }
    if (student.verification_status === 'Terverifikasi') {
      if (student.graduation_status === 'Diterima') {
        return styles.badgeSuccess;
      }
      if (student.graduation_status === 'Tidak Lulus') {
        return styles.badgeDanger;
      }
      return styles.badgeSecondary;
    }
    return styles.badgeWarning;
  };

  return (
    <>
      <Head title="Admin Dasbor - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Dasbor Admin</h1>
          <p>Sistem Pemantauan & Verifikasi Data Calon Siswa Baru</p>
        </div>
      </header>

      <main className={styles.container}>
        {/* Statistics Grid */}
        <section className={styles.statsSection}>

          <div className={styles.statsGrid}>
            <div className={styles.statsCard}>
              <span className={styles.statLabel}>Total Pendaftar</span>
              <span className={styles.statValue}>{stats.total}</span>
            </div>
            <div className={styles.statsCard}>
              <span className={styles.statLabel}>Belum Diverifikasi</span>
              <span className={styles.statValue}>{stats.menunggu}</span>
            </div>
            <div className={styles.statsCard}>
              <span className={styles.statLabel}>Terverifikasi</span>
              <span className={styles.statValue}>{stats.terverifikasi}</span>
            </div>
            <div className={styles.statsCard}>
              <span className={styles.statLabel}>Berkas Ditolak</span>
              <span className={styles.statValue}>{stats.ditolak}</span>
            </div>
            <div className={styles.statsCard}>
              <span className={styles.statLabel}>Dinyatakan Lulus</span>
              <span className={styles.statValue}>{stats.lulus}</span>
            </div>
            <div className={styles.statsCard}>
              <span className={styles.statLabel}>Tidak Lulus</span>
              <span className={styles.statValue}>{stats.tidak_lulus}</span>
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className={styles.filterSection}>
          <div className={styles.filtersGrid}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div className={styles.filterGroup}>
                <label>Tahun Registrasi</label>
                <select
                  value={filters.year ?? ''}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className={styles.filterSelect}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Jalur Pendaftaran</label>
                <select
                  value={filters.quota_id ?? ''}
                  onChange={(e) => handleFilterChange('quota_id', e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="">Semua Jalur</option>
                  {quotas.map((q) => (
                    <option key={q.id} value={q.id}>{q.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.filterGroup} style={{ flex: 2 }}>
              <label>Cari Calon Siswa</label>
              <input
                type="text"
                placeholder="Cari Nama, No Registrasi atau NISN..."
                value={filters.search ?? ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className={styles.filterInput}
              />
            </div>
          </div>
        </section>

        {/* Student Data Table */}
        <section className={styles.tableSection}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No Registrasi</th>
                  <th>Nama Lengkap</th>
                  <th>NISN</th>
                  <th>Jalur</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {registrations.length > 0 ? (
                  registrations.map((student) => (
                    <tr key={student.id}>
                      <td className={styles.boldCell}>{student.registration_number}</td>
                      <td>{student.full_name}</td>
                      <td>{student.nisn}</td>
                      <td>{student.quota?.name}</td>
                      <td>
                        {getUnifiedStatus(student)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.emptyCell}>Tidak ada data calon siswa terdaftar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
