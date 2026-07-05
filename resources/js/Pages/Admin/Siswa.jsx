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
  { value: 'teknik otomotif',     label: 'Teknik Otomotif' },
  { value: 'manajemen dan bisnis', label: 'Manajemen dan Bisnis' },
];

const KELAS_LIST = ['X', 'XI', 'XII'];

const formatJurusan = (j) => {
  if (!j) return '-';
  return j.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

// ── PDF Download ────────────────────────────────────────────────────────────
function PdfModal({ isOpen, onClose, jurusan, kelas }) {
  const [mapel, setMapel] = useState('');

  const handleDownload = () => {
    const params = new URLSearchParams({ jurusan, kelas, mapel });
    window.open(`/admin/siswa/pdf?${params.toString()}`, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <h3 className={styles.modalTitle}>
          Download Absensi — {formatJurusan(jurusan)} Kelas {kelas}
        </h3>
      </div>
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p className={styles.confirmModalText}>
          Akan mencetak daftar hadir berupa tabel nama siswa dan kolom tanda tangan.
        </p>
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

// ── Siswa Table per kelas ───────────────────────────────────────────────────
function KelasSection({ jurusan, kelas, students, onOpenEdit, onOpenPdf }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Kelas header bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--color-primary-dark)',
        color: '#fff',
        padding: '10px 16px',
        borderRadius: '6px 6px 0 0',
      }}>
        <span style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '0.5px' }}>
          KELAS {kelas}
          <span style={{ marginLeft: '12px', fontWeight: 400, fontSize: '12px', opacity: 0.8 }}>
            ({students.length} siswa)
          </span>
        </span>
        <button
          onClick={() => onOpenPdf(jurusan, kelas)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--color-accent-yellow)',
            color: 'var(--color-primary-dark)',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.3px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download Absensi PDF
        </button>
      </div>

      <div className={styles.tableContainer} style={{ borderRadius: '0 0 6px 6px' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '50px', textAlign: 'center' }}>No.</th>
              <th style={{ width: '130px' }}>NIS</th>
              <th>Nama Lengkap</th>
              <th>NISN</th>
              <th>Asal Sekolah</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student, idx) => (
                <tr key={student.id}>
                  <td style={{ textAlign: 'center', color: '#718096', fontSize: '12px' }}>{idx + 1}</td>
                  <td className={styles.boldCell}>{student.nis || '-'}</td>
                  <td>{student.full_name}</td>
                  <td>{student.nisn}</td>
                  <td>{student.school_origin}</td>
                  <td style={{ textAlign: 'center' }}>
                    <Button
                      onClick={() => onOpenEdit(student)}
                      variant="secondary"
                      size="sm"
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className={styles.emptyCell}>Belum ada siswa di kelas ini.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function Siswa({ students = [], grouped = {}, filters = {} }) {
  const { flash } = usePage().props;
  const [searchTerm, setSearchTerm]     = useState(filters.search  || '');
  const [jurusanFilter, setJurusanFilter] = useState(filters.jurusan || '');

  // Edit state
  const [isEditOpen, setIsEditOpen]   = useState(false);
  const [editData, setEditData]       = useState({ id: '', nis: '', jurusan: '', kelas: '', full_name: '', nisn: '' });
  const [errors, setErrors]           = useState({});

  // PDF modal state
  const [isPdfOpen, setIsPdfOpen]     = useState(false);
  const [pdfJurusan, setPdfJurusan]   = useState('');
  const [pdfKelas, setPdfKelas]       = useState('');

  const links = [
    { url: '/admin/dashboard',           label: 'Dasbor' },
    { url: '/admin/verifikasi-berkas',   label: 'Verifikasi Berkas' },
    { url: '/admin/penentuan-kelulusan', label: 'Kelulusan' },
    { url: '/admin/siswa',               label: 'Manajemen Siswa' },
    {
      label: 'Data Master',
      dropdown: [
        { url: '/admin/schedules',    label: 'Kelola Jadwal' },
        { url: '/admin/quotas',       label: 'Kelola Kuota' },
        { url: '/admin/posts',        label: 'Kelola Berita/Pengumuman' },
        { url: '/admin/achievements', label: 'Kelola Prestasi' },
      ]
    },
    { url: '/logout', label: 'Keluar', method: 'post' },
  ];

  const triggerFilter = (search, jurusan) => {
    router.get('/admin/siswa', { search, jurusan }, { preserveState: true });
  };

  const handleSearchChange  = (val) => { setSearchTerm(val);     triggerFilter(val, jurusanFilter); };
  const handleJurusanChange = (val) => { setJurusanFilter(val);  triggerFilter(searchTerm, val);   };

  const handleOpenEdit = (student) => {
    setEditData({
      id:        student.id,
      nis:       student.nis        || '',
      jurusan:   student.jurusan    || 'teknik otomotif',
      kelas:     student.kelas      || '',
      full_name: student.full_name  || '',
      nisn:      student.nisn       || '',
    });
    setErrors({});
    setIsEditOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    router.put(`/admin/siswa/${editData.id}`, editData, {
      onSuccess: () => setIsEditOpen(false),
      onError:   (err) => setErrors(err),
    });
  };

  const handleOpenPdf = (jurusan, kelas) => {
    setPdfJurusan(jurusan);
    setPdfKelas(kelas);
    setIsPdfOpen(true);
  };

  // ── Render grouped content ──────────────────────────────────────────────
  // Filter grouped by jurusanFilter if active
  const jurusanKeys = jurusanFilter
    ? Object.keys(grouped).filter(j => j === jurusanFilter)
    : Object.keys(grouped);

  const hasStudents = students.length > 0;

  return (
    <>
      <Head title="Manajemen Siswa - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Manajemen Siswa</h1>
          <p>Kelola data siswa terdaftar — dikelompokkan per jurusan dan kelas</p>
        </div>
      </header>

      <main className={styles.container}>
        {flash?.success && (
          <div className={styles.alertSuccess}>
            {flash.success}
          </div>
        )}

        {/* Filters */}
        <section className={styles.filterSection}>
          <div className={styles.filtersGrid}>
            <div className={styles.filterWrapper}>
              <div className={styles.filterGroup}>
                <label>Filter Jurusan</label>
                <select
                  value={jurusanFilter}
                  onChange={(e) => handleJurusanChange(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="">Semua Jurusan</option>
                  {JURUSAN_LIST.map(j => (
                    <option key={j.value} value={j.value}>{j.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.filterGroup} style={{ flex: 2 }}>
              <label>Cari Siswa</label>
              <input
                type="text"
                placeholder="Cari Nama, NIS, atau NISN..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={styles.filterInput}
              />
            </div>
          </div>
        </section>

        {/* Grouped Tables */}
        {hasStudents ? (
          jurusanKeys.length > 0 ? (
            jurusanKeys.map(jurusanKey => {
              const kelasByJurusan = grouped[jurusanKey] || {};
              const kelasSorted = KELAS_LIST.filter(k => kelasByJurusan[k])
                .concat(Object.keys(kelasByJurusan).filter(k => !KELAS_LIST.includes(k)));

              return (
                <section key={jurusanKey} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {/* Jurusan Label */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '16px',
                  }}>
                    <div style={{
                      width: '4px',
                      height: '22px',
                      background: 'var(--color-accent-yellow)',
                      borderRadius: '2px',
                      flexShrink: 0,
                    }} />
                    <h2 style={{
                      fontSize: '14px',
                      fontWeight: 800,
                      color: 'var(--color-primary-dark)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                    }}>
                      Jurusan {formatJurusan(jurusanKey)}
                    </h2>
                    <span style={{
                      fontSize: '12px',
                      color: '#718096',
                      fontWeight: 400,
                    }}>
                      — {Object.values(kelasByJurusan).flat().length} siswa total
                    </span>
                  </div>

                  {kelasSorted.map(kelas => (
                    <KelasSection
                      key={kelas}
                      jurusan={jurusanKey}
                      kelas={kelas}
                      students={kelasByJurusan[kelas] || []}
                      onOpenEdit={handleOpenEdit}
                      onOpenPdf={handleOpenPdf}
                    />
                  ))}
                </section>
              );
            })
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <td className={styles.emptyCell}>Tidak ada data untuk filter yang dipilih.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.emptyCell}>Tidak ada data siswa terdaftar.</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Siswa belum ada kelas — ungrouped fallback */}
        {hasStudents && students.some(s => !s.kelas) && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '4px', height: '22px', background: '#E2E8F0', borderRadius: '2px' }} />
              <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#718096', textTransform: 'uppercase' }}>
                Belum Ditetapkan Kelasnya
              </h2>
            </div>
            <div className={styles.tableContainer} style={{ borderRadius: '6px' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: '50px', textAlign: 'center' }}>No.</th>
                    <th style={{ width: '130px' }}>NIS</th>
                    <th>Nama Lengkap</th>
                    <th>Jurusan</th>
                    <th>NISN</th>
                    <th style={{ width: '80px', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {students.filter(s => !s.kelas && (!jurusanFilter || s.jurusan === jurusanFilter)).map((student, idx) => (
                    <tr key={student.id}>
                      <td style={{ textAlign: 'center', color: '#718096', fontSize: '12px' }}>{idx + 1}</td>
                      <td className={styles.boldCell}>{student.nis || '-'}</td>
                      <td>{student.full_name}</td>
                      <td>{formatJurusan(student.jurusan)}</td>
                      <td>{student.nisn}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Button onClick={() => handleOpenEdit(student)} variant="secondary" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Edit Student Popup */}
      <Popup isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Edit Data Siswa</h3>
        </div>
        <form onSubmit={handleUpdate} className={styles.confirmModalForm} style={{ marginTop: '16px' }}>
          <div>
            <Input
              label="Nomor Induk Siswa (NIS)"
              value={editData.nis}
              onChange={(e) => setEditData({ ...editData, nis: e.target.value })}
              required
            />
            {errors.nis && <span className={styles.errorTextSmall}>{errors.nis}</span>}
          </div>

          <div>
            <Input
              label="Nama Lengkap"
              value={editData.full_name}
              onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
              required
            />
            {errors.full_name && <span className={styles.errorTextSmall}>{errors.full_name}</span>}
          </div>

          <div>
            <Input
              label="NISN"
              value={editData.nisn}
              onChange={(e) => setEditData({ ...editData, nisn: e.target.value })}
              required
              maxLength={10}
            />
            {errors.nisn && <span className={styles.errorTextSmall}>{errors.nisn}</span>}
          </div>

          <div>
            <Select
              label="Jurusan"
              options={JURUSAN_LIST}
              value={editData.jurusan}
              onChange={(e) => setEditData({ ...editData, jurusan: e.target.value })}
              required
            />
            {errors.jurusan && <span className={styles.errorTextSmall}>{errors.jurusan}</span>}
          </div>

          <div>
            <Select
              label="Kelas"
              options={[
                { value: '',    label: '— Belum Ditentukan —' },
                { value: 'X',   label: 'Kelas X' },
                { value: 'XI',  label: 'Kelas XI' },
                { value: 'XII', label: 'Kelas XII' },
              ]}
              value={editData.kelas}
              onChange={(e) => setEditData({ ...editData, kelas: e.target.value })}
            />
            {errors.kelas && <span className={styles.errorTextSmall}>{errors.kelas}</span>}
          </div>

          <div className={styles.btnRow}>
            <Button type="button" variant="secondary" onClick={() => setIsEditOpen(false)}>Batal</Button>
            <Button type="submit">Simpan Perubahan</Button>
          </div>
        </form>
      </Popup>

      {/* PDF Modal */}
      <PdfModal
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
        jurusan={pdfJurusan}
        kelas={pdfKelas}
      />

      <Footer />
    </>
  );
}
