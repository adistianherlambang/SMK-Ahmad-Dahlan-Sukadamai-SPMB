import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import Button from '../../Components/Button/Button';
import Popup from '../../Components/Popup/Popup';
import styles from './AdminDashboard.module.css';

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

// ── Main Component ──────────────────────────────────────────────────────────
export default function AbsensiKelas({ classroom, students = [] }) {
  const { flash } = usePage().props;
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  return (
    <>
      <Head title={`Daftar Murid ${classroom.name} - SMK Ahmad Dahlan`} />
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
            <h1>Daftar Murid {classroom.name}</h1>
            <p>{formatJurusan(classroom.jurusan)} · Tingkat {classroom.kelas_level}</p>
          </div>
          {students.length > 0 && (
            <Button onClick={() => setIsPdfOpen(true)} style={{ whiteSpace: 'nowrap' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Cetak / Download PDF
            </Button>
          )}
        </div>
      </header>

      <main className={styles.container}>
        {flash?.success && (
          <div className={styles.alertSuccess}>{flash.success}</div>
        )}

        <section className={styles.tableSection}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '44px', textAlign: 'center' }}>No.</th>
                  <th style={{ width: '150px' }}>NIS</th>
                  <th>Nama Lengkap</th>
                  <th>NISN</th>
                  <th>Jurusan</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student, idx) => (
                    <tr key={student.id}>
                      <td style={{ textAlign: 'center', color: '#718096', fontSize: '12px' }}>{idx + 1}</td>
                      <td className={styles.boldCell}>{student.nis || '-'}</td>
                      <td>{student.full_name}</td>
                      <td>{student.nisn || '-'}</td>
                      <td>{formatJurusan(student.jurusan)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.emptyCell}>
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
      </main>

      <PdfModal isOpen={isPdfOpen} onClose={() => setIsPdfOpen(false)} classroomId={classroom.id} />
      <Footer />
    </>
  );
}
