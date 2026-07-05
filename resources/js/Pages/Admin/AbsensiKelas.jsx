import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import Button from '../../Components/Button/Button';
import Popup from '../../Components/Popup/Popup';
import styles from './AdminDashboard.module.css';

const STATUS_LIST = ['Hadir', 'Sakit', 'Izin', 'Alpa'];

const STATUS_COLOR = {
  Hadir: { bg: '#C6F6D5', color: '#22543D' },
  Sakit: { bg: '#BEE3F8', color: '#2A4365' },
  Izin:  { bg: '#FEFCBF', color: '#744210' },
  Alpa:  { bg: '#FED7D7', color: '#742A2A' },
};

const formatJurusan = (j) => {
  if (!j) return '-';
  return j.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const adminLinks = [
  { url: '/admin/dashboard',           label: 'Dasbor' },
  { url: '/admin/verifikasi-berkas',   label: 'Verifikasi Berkas' },
  { url: '/admin/penentuan-kelulusan', label: 'Kelulusan' },
  { url: '/admin/siswa',               label: 'Manajemen Siswa' },
  { url: '/admin/absensi',             label: 'Absensi' },
  {
    label: 'Data Master',
    dropdown: [
      { url: '/admin/schedules',    label: 'Kelola Jadwal' },
      { url: '/admin/quotas',       label: 'Kelola Kuota' },
      { url: '/admin/posts',        label: 'Kelola Berita/Pengumuman' },
      { url: '/admin/achievements', label: 'Kelola Prestasi' },
    ],
  },
  { url: '/logout', label: 'Keluar', method: 'post' },
];

// ── PDF Modal ───────────────────────────────────────────────────────────────
function PdfModal({ isOpen, onClose, classroomId }) {
  const [mapel, setMapel] = useState('');
  const handleDownload = () => {
    const params = new URLSearchParams({ classroom_id: classroomId, mapel });
    window.open(`/admin/siswa/pdf?${params.toString()}`, '_blank');
    onClose();
  };
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <h3 className={styles.modalTitle}>Download Absensi PDF</h3>
      </div>
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p className={styles.confirmModalText}>Cetak daftar hadir tanda tangan untuk kelas ini.</p>
        <div>
          <label className={styles.modalLabel}>Mata Pelajaran (opsional)</label>
          <input
            type="text"
            placeholder="Misal: Matematika, PKn, ..."
            value={mapel}
            onChange={(e) => setMapel(e.target.value)}
            className={styles.filterInput}
            style={{ marginTop: '6px' }}
          />
        </div>
        <div className={styles.btnRow}>
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="button" onClick={handleDownload}>Download / Print PDF</Button>
        </div>
      </div>
    </Popup>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────
export default function AbsensiKelas({ classroom, students = [], attendances = {}, date = '' }) {
  const { flash } = usePage().props;
  const [selectedDate, setSelectedDate] = useState(date);
  const [records, setRecords] = useState({});
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  // Init records from server attendances
  useEffect(() => {
    const init = {};
    students.forEach(s => { init[s.id] = attendances[s.id] || 'Hadir'; });
    setRecords(init);
  }, [students, attendances]);

  const handleDateChange = (val) => {
    setSelectedDate(val);
    router.get(`/admin/absensi/${classroom.id}`, { date: val }, { preserveState: true });
  };

  const handleStatusChange = (studentId, status) => {
    setRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post(`/admin/absensi/${classroom.id}`, { date: selectedDate, records });
  };

  // Summary counts
  const summary = STATUS_LIST.reduce((acc, s) => {
    acc[s] = Object.values(records).filter(v => v === s).length;
    return acc;
  }, {});

  return (
    <>
      <Head title={`Absensi ${classroom.name} - SMK Ahmad Dahlan`} />
      <Navbar links={adminLinks} />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '12px', color: '#718096' }}>
              <button
                onClick={() => router.get('/admin/absensi')}
                style={{ background: 'none', border: 'none', color: '#718096', cursor: 'pointer', fontSize: '12px', padding: 0, textDecoration: 'underline' }}
              >
                Absensi
              </button>
              <span>›</span>
              <span style={{ color: 'var(--color-primary-dark)', fontWeight: 600 }}>{classroom.name}</span>
            </div>
            <h1>{classroom.name}</h1>
            <p>{formatJurusan(classroom.jurusan)} · Tingkat {classroom.kelas_level}</p>
          </div>
          <Button onClick={() => setIsPdfOpen(true)} style={{ whiteSpace: 'nowrap' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download PDF
          </Button>
        </div>
      </header>

      <main className={styles.container}>
        {flash?.success && (
          <div className={styles.alertSuccess}>{flash.success}</div>
        )}

        {/* Date picker */}
        <section className={styles.filterSection}>
          <div className={styles.filtersGrid} style={{ alignItems: 'flex-end' }}>
            <div className={styles.filterGroup}>
              <label>Pilih Tanggal</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className={styles.filterInput}
              />
            </div>

            {/* Summary pills */}
            {students.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingBottom: '2px' }}>
                {STATUS_LIST.map(s => (
                  <span key={s} style={{
                    background: STATUS_COLOR[s].bg,
                    color: STATUS_COLOR[s].color,
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    whiteSpace: 'nowrap',
                  }}>
                    {s}: {summary[s]}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Attendance table */}
        <form onSubmit={handleSubmit}>
          <section className={styles.tableSection}>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: '44px', textAlign: 'center' }}>No.</th>
                    <th style={{ width: '120px' }}>NIS</th>
                    <th>Nama Lengkap</th>
                    <th style={{ width: '340px', textAlign: 'center' }}>Kehadiran</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((student, idx) => {
                      const current = records[student.id] || 'Hadir';
                      return (
                        <tr key={student.id}>
                          <td style={{ textAlign: 'center', color: '#718096', fontSize: '12px' }}>{idx + 1}</td>
                          <td className={styles.boldCell}>{student.nis || '-'}</td>
                          <td>{student.full_name}</td>
                          <td>
                            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '8px' }}>
                              {STATUS_LIST.map(status => (
                                <label
                                  key={status}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: current === status ? 700 : 400,
                                    color: current === status ? STATUS_COLOR[status].color : '#4A5568',
                                    background: current === status ? STATUS_COLOR[status].bg : 'transparent',
                                    padding: '3px 8px',
                                    borderRadius: '20px',
                                    transition: 'all 0.12s ease',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  <input
                                    type="radio"
                                    name={`att_${student.id}`}
                                    value={status}
                                    checked={current === status}
                                    onChange={() => handleStatusChange(student.id, status)}
                                    style={{ accentColor: 'var(--color-primary-dark)', width: '13px', height: '13px' }}
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
                      <td colSpan="4" className={styles.emptyCell}>
                        Belum ada siswa di kelas ini.{' '}
                        <button
                          type="button"
                          onClick={() => router.get('/admin/siswa')}
                          style={{ background: 'none', border: 'none', color: 'var(--color-primary-dark)', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' }}
                        >
                          Tambahkan dari Manajemen Siswa
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {students.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button type="submit">Simpan Absensi</Button>
            </div>
          )}
        </form>
      </main>

      <PdfModal isOpen={isPdfOpen} onClose={() => setIsPdfOpen(false)} classroomId={classroom.id} />
      <Footer />
    </>
  );
}
