import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import Button from '../../Components/Button/Button';
import styles from './AdminDashboard.module.css';

export default function Absensi({ students = [], attendances = {}, date = '', jurusan = 'teknik otomotif' }) {
  const { flash } = usePage().props;
  const [selectedDate, setSelectedDate] = useState(date);
  const [selectedJurusan, setSelectedJurusan] = useState(jurusan);
  const [records, setRecords] = useState({});

  // Initialize records when students or attendances change
  useEffect(() => {
    const initialRecords = {};
    students.forEach((student) => {
      // Set to existing attendance status, or default empty/none (or 'Hadir' if you prefer, let's keep it empty or default to 'Hadir' to save click effort)
      initialRecords[student.id] = attendances[student.id] || 'Hadir';
    });
    setRecords(initialRecords);
  }, [students, attendances]);

  const links = [
    { url: '/admin/dashboard', label: 'Dasbor' },
    { url: '/admin/verifikasi-berkas', label: 'Verifikasi Berkas' },
    { url: '/admin/penentuan-kelulusan', label: 'Kelulusan' },
    { url: '/admin/siswa', label: 'Manajemen Siswa' },
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

  const handleDateChange = (val) => {
    setSelectedDate(val);
    triggerReload(val, selectedJurusan);
  };

  const handleJurusanChange = (val) => {
    setSelectedJurusan(val);
    triggerReload(selectedDate, val);
  };

  const triggerReload = (dateVal, jurusanVal) => {
    router.get('/admin/absensi', { date: dateVal, jurusan: jurusanVal }, { preserveState: true });
  };

  const handleStatusChange = (studentId, status) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post('/admin/absensi', {
      date: selectedDate,
      jurusan: selectedJurusan,
      records: records
    });
  };

  const formatJurusan = (jurusan) => {
    if (!jurusan) return '-';
    return jurusan.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <>
      <Head title="Absensi Siswa - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Absensi Siswa</h1>
          <p>Kelola rekam kehadiran harian siswa per jurusan</p>
        </div>
      </header>

      <main className={styles.container}>
        {flash?.success && (
          <div className={styles.alertSuccess} style={{ backgroundColor: '#C6F6D5', color: '#22543D', padding: '12px 16px', borderRadius: '4px', textAlign: 'left' }}>
            {flash.success}
          </div>
        )}

        {/* Filters and Date Picker */}
        <section className={styles.filterSection}>
          <div className={styles.filtersGrid}>
            <div className={styles.filterWrapper}>
              <div className={styles.filterGroup}>
                <label>Pilih Jurusan</label>
                <select
                  value={selectedJurusan}
                  onChange={(e) => handleJurusanChange(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="teknik otomotif">Teknik Otomotif</option>
                  <option value="manajemen dan bisnis">Manajemen dan Bisnis</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Pilih Tanggal</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className={styles.filterInput}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Attendance Form */}
        <form onSubmit={handleSubmit}>
          <section className={styles.tableSection}>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: '150px' }}>NIS</th>
                    <th>Nama Lengkap</th>
                    <th style={{ width: '320px', textAlign: 'center' }}>Kehadiran</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((student) => {
                      const currentStatus = records[student.id] || 'Hadir';
                      return (
                        <tr key={student.id}>
                          <td className={styles.boldCell}>{student.nis || '-'}</td>
                          <td>{student.full_name}</td>
                          <td>
                            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '8px' }}>
                              {['Hadir', 'Sakit', 'Izin', 'Alpa'].map((status) => (
                                <label 
                                  key={status} 
                                  style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '6px', 
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: currentStatus === status ? '700' : '400',
                                    color: currentStatus === status ? 'var(--color-primary-dark)' : '#4A5568'
                                  }}
                                >
                                  <input
                                    type="radio"
                                    name={`attendance_${student.id}`}
                                    value={status}
                                    checked={currentStatus === status}
                                    onChange={() => handleStatusChange(student.id, status)}
                                    style={{ accentColor: 'var(--color-primary-dark)' }}
                                  />
                                  {status}
                                </label>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" className={styles.emptyCell}>Tidak ada siswa terdaftar untuk jurusan ini.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {students.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button type="submit">
                Simpan Absensi
              </Button>
            </div>
          )}
        </form>
      </main>

      <Footer />
    </>
  );
}
