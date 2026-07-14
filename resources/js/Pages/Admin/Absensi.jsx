import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import Popup from '../../Components/Popup/Popup';
import Button from '../../Components/Button/Button';
import Input from '../../Components/Input/Input';
import Select from '../../Components/Select/Select';
import styles from './AdminDashboard.module.css';

const JURUSAN_LIST = [
  { value: 'teknik otomotif', label: 'Teknik Otomotif' },
  { value: 'manajemen dan bisnis', label: 'Manajemen dan Bisnis' },
];
const KELAS_LEVEL = [
  { value: 'X', label: 'Kelas X' },
  { value: 'XI', label: 'Kelas XI' },
  { value: 'XII', label: 'Kelas XII' },
];

const LEVEL_ORDER = { X: 0, XI: 1, XII: 2 };

const formatJurusan = (j) => {
  if (!j) return '-';
  return j.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const adminLinks = [
  { url: '/admin/dashboard', label: 'Dasbor' },
  { url: '/admin/verifikasi-berkas', label: 'Verifikasi Berkas' },
  { url: '/admin/penentuan-kelulusan', label: 'Kelulusan' },
  { url: '/admin/siswa', label: 'Manajemen Siswa' },
  { url: '/admin/absensi', label: 'Absensi' },
  {
    label: 'Data Master',
    dropdown: [
      { url: '/admin/schedules', label: 'Kelola Jadwal' },
      { url: '/admin/quotas', label: 'Kelola Kuota' },
      { url: '/admin/posts', label: 'Kelola Berita/Pengumuman' },
      { url: '/admin/achievements', label: 'Kelola Prestasi' },
    ],
  },
  { url: '/logout', label: 'Keluar', method: 'post' },
];

// ── Add Classroom Modal ─────────────────────────────────────────────────────
function AddClassroomModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ name: '', jurusan: 'teknik otomotif', kelas_level: 'X' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post('/admin/classrooms', form, {
      onSuccess: () => { onClose(); setForm({ name: '', jurusan: 'teknik otomotif', kelas_level: 'X' }); },
      onError: (err) => setErrors(err),
    });
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <h3 className={styles.modalTitle}>Tambah Kelas Baru</h3>
      </div>
      <form onSubmit={handleSubmit} className={styles.confirmModalForm} style={{ marginTop: '16px' }}>
        <div>
          <Input
            label="Nama Kelas"
            placeholder="Misal: X TKR 1, XI MB A, XII TKR 2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          {errors.name && <span className={styles.errorTextSmall}>{errors.name}</span>}
        </div>
        <div>
          <Select
            label="Jurusan"
            options={JURUSAN_LIST}
            value={form.jurusan}
            onChange={(e) => setForm({ ...form, jurusan: e.target.value })}
            required
          />
          {errors.jurusan && <span className={styles.errorTextSmall}>{errors.jurusan}</span>}
        </div>
        <div>
          <Select
            label="Tingkat Kelas"
            options={KELAS_LEVEL}
            value={form.kelas_level}
            onChange={(e) => setForm({ ...form, kelas_level: e.target.value })}
            required
          />
          {errors.kelas_level && <span className={styles.errorTextSmall}>{errors.kelas_level}</span>}
        </div>
        <div className={styles.btnRow}>
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit">Tambah Kelas</Button>
        </div>
      </form>
    </Popup>
  );
}

// ── Download Absensi Modal ──────────────────────────────────────────────────
function DownloadAbsensiModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    jurusan: 'teknik otomotif',
    kelas_level: 'all',
  });

  const handleDownload = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      jurusan: form.jurusan,
      kelas_level: form.kelas_level,
    });
    window.open(`/admin/siswa/absensi-major/pdf?${params.toString()}`, '_blank');
    onClose();
  };

  const tingkatOptions = [
    { value: 'all', label: 'Semua Tingkat' },
    ...KELAS_LEVEL,
  ];

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <h3 className={styles.modalTitle}>Cetak Absensi Per Jurusan</h3>
      </div>
      <form onSubmit={handleDownload} className={styles.confirmModalForm} style={{ marginTop: '16px' }}>
        <p className={styles.confirmModalText} style={{ marginBottom: '12px', fontSize: '13px', color: '#4A5568' }}>
          Unduh daftar hadir dalam format PDF untuk semua siswa di jurusan dan tingkat kelas tertentu.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <Select
              label="Jurusan"
              options={JURUSAN_LIST}
              value={form.jurusan}
              onChange={(e) => setForm({ ...form, jurusan: e.target.value })}
              required
            />
          </div>

          <div>
            <Select
              label="Tingkat Kelas"
              options={tingkatOptions}
              value={form.kelas_level}
              onChange={(e) => setForm({ ...form, kelas_level: e.target.value })}
              required
            />
          </div>
        </div>

        <div className={styles.btnRow} style={{ marginTop: '20px' }}>
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit">Download / Print PDF</Button>
        </div>
      </form>
    </Popup>
  );
}

// ── Classroom Card ──────────────────────────────────────────────────────────
function ClassroomCard({ classroom, onDelete }) {
  const handleOpen = () => {
    router.get(`/admin/absensi/${classroom.id}`);
  };

  const handleDelete = () => {
    if (confirm(`Hapus kelas "${classroom.name}"? Semua siswa di kelas ini akan dikeluarkan.`)) {
      router.delete(`/admin/classrooms/${classroom.id}`);
    }
  };

  return (
    <div
      style={{
        background: '#fff',
        border: '1.5px solid #E2E8F0',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'box-shadow 0.15s ease',
        cursor: 'default',
      }}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Kelas level badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{
          background: 'var(--color-accent-yellow)',
          color: 'var(--color-primary-dark)',
          fontSize: '10px',
          fontWeight: 800,
          padding: '3px 8px',
          borderRadius: '3px',
        }}>
          Kelas{classroom.kelas_level}
        </span>
        <button
          onClick={handleDelete}
          title="Hapus kelas"
          style={{
            background: 'none',
            border: 'none',
            color: '#CBD5E0',
            cursor: 'pointer',
            fontSize: '16px',
            lineHeight: 1,
            padding: '0 2px',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#E53E3E'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#CBD5E0'}
        >
          ✕
        </button>
      </div>

      {/* Name */}
      <div>
        <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--color-primary-dark)' }}>
          {classroom.name}
        </div>
        <div style={{ fontSize: '12px', color: '#718096', marginTop: '2px' }}>
          {formatJurusan(classroom.jurusan)}
        </div>
      </div>

      {/* Student count */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: '#4A5568',
        background: '#F7FAFC',
        padding: '6px 10px',
        borderRadius: '4px',
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span><strong>{classroom.student_count}</strong> siswa</span>
      </div>

      {/* Action */}
      <button
        onClick={handleOpen}
        style={{
          width: '100%',
          background: 'var(--color-primary-dark)',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          padding: '9px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
          letterSpacing: '0.3px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        Lihat Kelas & Cetak
      </button>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function Absensi({ classrooms = [] }) {
  const { flash } = usePage().props;
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  // Group by jurusan then kelas_level
  const grouped = {};
  classrooms.forEach(c => {
    if (!grouped[c.jurusan]) grouped[c.jurusan] = {};
    if (!grouped[c.jurusan][c.kelas_level]) grouped[c.jurusan][c.kelas_level] = [];
    grouped[c.jurusan][c.kelas_level].push(c);
  });

  const jurusanKeys = Object.keys(grouped).sort();

  return (
    <>
      <Head title="Absensi Siswa - SMK Ahmad Dahlan" />
      <Navbar links={adminLinks} />

      <header className={styles.header}>
        <div className={styles.headerContent} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Absensi Siswa</h1>
            <p>Kelola kelas dan rekam kehadiran siswa per kelas</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setIsDownloadOpen(true)} style={{ whiteSpace: 'nowrap' }}>
              Cetak Per Jurusan
            </Button>
            <Button onClick={() => setIsAddOpen(true)} style={{ whiteSpace: 'nowrap' }}>
              + Tambah Kelas
            </Button>
          </div>
        </div>
      </header>

      <main className={styles.container}>
        {flash?.success && (
          <div className={styles.alertSuccess}>{flash.success}</div>
        )}

        {classrooms.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#fff',
            borderRadius: '8px',
            border: '1.5px solid #CBD5E0',
          }}>
            <p style={{ color: '#718096', fontSize: '14px' }}>Belum ada kelas. Klik <strong>"+ Tambah Kelas"</strong> untuk mulai.</p>
          </div>
        ) : (
          jurusanKeys.map(jurusan => {
            const kelasByLevel = grouped[jurusan];
            const levelKeys = Object.keys(kelasByLevel).sort((a, b) => LEVEL_ORDER[a] - LEVEL_ORDER[b]);

            return (
              <section key={jurusan} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Jurusan heading */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary-dark)', textTransform: 'uppercase', }}>
                    Jurusan {formatJurusan(jurusan)}
                  </h2>
                </div>

                {levelKeys.map(level => (
                  <div key={level}>
                    {/* Level sub-heading */}
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#718096', marginBottom: '10px' }}>
                      Tingkat {level}
                    </p>
                    {/* Cards grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: '12px',
                    }}>
                      {kelasByLevel[level].map(c => (
                        <ClassroomCard key={c.id} classroom={c} />
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            );
          })
        )}
      </main>

      <AddClassroomModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <DownloadAbsensiModal isOpen={isDownloadOpen} onClose={() => setIsDownloadOpen(false)} />
      <Footer />
    </>
  );
}
