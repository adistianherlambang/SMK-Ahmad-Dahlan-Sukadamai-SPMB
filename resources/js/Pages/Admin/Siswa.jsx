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
  { value: 'teknik otomotif',      label: 'Teknik Otomotif' },
  { value: 'manajemen dan bisnis', label: 'Manajemen dan Bisnis' },
];

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

// ── Assign to Classroom Modal ───────────────────────────────────────────────
function AssignModal({ isOpen, onClose, selectedIds, classrooms = [] }) {
  const [classroomId, setClassroomId] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!classroomId) { setErrors({ classroom_id: 'Pilih kelas terlebih dahulu.' }); return; }
    router.post('/admin/siswa/assign-classroom', {
      student_ids: selectedIds,
      classroom_id: classroomId,
    }, {
      onSuccess: () => { onClose(); setClassroomId(''); setErrors({}); },
      onError: (err) => setErrors(err),
    });
  };

  const classroomOptions = classrooms.map(c => ({
    value: String(c.id),
    label: `${c.name} (${formatJurusan(c.jurusan)} — Kelas ${c.kelas_level})`,
  }));

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <h3 className={styles.modalTitle}>Masukkan ke Kelas</h3>
      </div>
      <form onSubmit={handleSubmit} className={styles.confirmModalForm} style={{ marginTop: '16px' }}>
        <p className={styles.confirmModalText}>
          <strong>{selectedIds.length} siswa</strong> akan dimasukkan ke dalam kelas yang dipilih.
        </p>
        <div>
          <Select
            label="Pilih Kelas"
            options={[{ value: '', label: '— Pilih Kelas —' }, ...classroomOptions]}
            value={classroomId}
            onChange={(e) => setClassroomId(e.target.value)}
            required
          />
          {errors.classroom_id && <span className={styles.errorTextSmall}>{errors.classroom_id}</span>}
        </div>
        <div className={styles.btnRow}>
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit">Masukkan ke Kelas</Button>
        </div>
      </form>
    </Popup>
  );
}

// ── PDF Modal ───────────────────────────────────────────────────────────────
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
        <h3 className={styles.modalTitle}>Download Absensi — {formatJurusan(jurusan)} Kelas {kelas}</h3>
      </div>
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
export default function Siswa({ students = [], grouped = {}, classrooms = [], filters = {} }) {
  const { flash } = usePage().props;
  const [searchTerm, setSearchTerm]       = useState(filters.search  || '');
  const [jurusanFilter, setJurusanFilter] = useState(filters.jurusan || '');

  // Edit state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData]     = useState({ id: '', nis: '', jurusan: '', kelas: '', full_name: '', nisn: '' });
  const [errors, setErrors]         = useState({});

  // Checkbox state (batch assign)
  const [selected, setSelected]     = useState(new Set());
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  // PDF modal
  const [isPdfOpen, setIsPdfOpen]   = useState(false);
  const [pdfJurusan, setPdfJurusan] = useState('');
  const [pdfKelas, setPdfKelas]     = useState('');

  const triggerFilter = (search, jurusan) => {
    router.get('/admin/siswa', { search, jurusan }, { preserveState: true });
  };

  const handleSearchChange  = (val) => { setSearchTerm(val);    triggerFilter(val, jurusanFilter); };
  const handleJurusanChange = (val) => { setJurusanFilter(val); triggerFilter(searchTerm, val);   };

  const handleOpenEdit = (student) => {
    setEditData({
      id:        student.id,
      nis:       student.nis       || '',
      jurusan:   student.jurusan   || 'teknik otomotif',
      kelas:     student.kelas     || '',
      full_name: student.full_name || '',
      nisn:      student.nisn      || '',
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

  // Checkbox handlers
  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (studentsInGroup) => {
    const ids = studentsInGroup.map(s => s.id);
    const allSelected = ids.every(id => selected.has(id));
    setSelected(prev => {
      const next = new Set(prev);
      if (allSelected) { ids.forEach(id => next.delete(id)); }
      else             { ids.forEach(id => next.add(id)); }
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  // Derived data
  const jurusanKeys = jurusanFilter
    ? Object.keys(grouped).filter(j => j === jurusanFilter)
    : Object.keys(grouped).sort();

  const hasStudents = students.length > 0;
  const KELAS_ORDER = ['X', 'XI', 'XII'];

  return (
    <>
      <Head title="Manajemen Siswa - SMK Ahmad Dahlan" />
      <Navbar links={adminLinks} />

      <header className={styles.header}>
        <div className={styles.headerContent} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Manajemen Siswa</h1>
            <p>Kelola data siswa — centang siswa lalu masukkan ke kelas</p>
          </div>
          {selected.size > 0 && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#4A5568' }}>{selected.size} dipilih</span>
              <Button onClick={() => setIsAssignOpen(true)} style={{ whiteSpace: 'nowrap' }}>
                Masukkan ke Kelas
              </Button>
              <button
                onClick={clearSelection}
                style={{ background: 'none', border: 'none', color: '#718096', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}
              >
                Batal Pilih
              </button>
            </div>
          )}
        </div>
      </header>

      <main className={styles.container}>
        {flash?.success && (
          <div className={styles.alertSuccess}>{flash.success}</div>
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

        {/* Batch assign tip */}
        {hasStudents && selected.size === 0 && (
          <div style={{ fontSize: '12px', color: '#718096', fontStyle: 'italic', textAlign: 'left', marginTop: '-8px' }}>
            💡 Centang siswa untuk mengelompokkan mereka ke dalam kelas
          </div>
        )}

        {/* Flat student table */}
        {hasStudents ? (
          <div className={styles.tableContainer} style={{ borderRadius: '6px' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={students.length > 0 && students.every(s => selected.has(s.id))}
                      onChange={() => toggleSelectAll(students)}
                      style={{ accentColor: 'var(--color-primary-dark)', width: '15px', height: '15px', cursor: 'pointer' }}
                    />
                  </th>
                  <th style={{ width: '44px', textAlign: 'center' }}>No.</th>
                  <th style={{ width: '120px' }}>NIS</th>
                  <th>Nama Lengkap</th>
                  <th>Jurusan</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Tingkat</th>
                  <th>Kelas Saat Ini</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={student.id} style={{ background: selected.has(student.id) ? '#FEFCBF' : undefined }}>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={selected.has(student.id)}
                        onChange={() => toggleSelect(student.id)}
                        style={{ accentColor: 'var(--color-primary-dark)', width: '14px', height: '14px', cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center', color: '#718096', fontSize: '12px' }}>{idx + 1}</td>
                    <td className={styles.boldCell}>{student.nis || '-'}</td>
                    <td>{student.full_name}</td>
                    <td>{formatJurusan(student.jurusan)}</td>
                    <td style={{ textAlign: 'center' }}>{student.kelas || '-'}</td>
                    <td>
                      {student.classroom
                        ? <span className={`${styles.badge} ${styles.badgeSuccess}`}>{student.classroom.name}</span>
                        : <span className={`${styles.badge} ${styles.badgeSecondary}`}>Belum ada</span>
                      }
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Button onClick={() => handleOpenEdit(student)} variant="secondary" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
      </main>

      {/* Edit Student Popup */}
      <Popup isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Edit Data Siswa</h3>
        </div>
        <form onSubmit={handleUpdate} className={styles.confirmModalForm} style={{ marginTop: '16px' }}>
          <div>
            <Input label="Nomor Induk Siswa (NIS)" value={editData.nis} onChange={(e) => setEditData({ ...editData, nis: e.target.value })} required />
            {errors.nis && <span className={styles.errorTextSmall}>{errors.nis}</span>}
          </div>
          <div>
            <Input label="Nama Lengkap" value={editData.full_name} onChange={(e) => setEditData({ ...editData, full_name: e.target.value })} required />
            {errors.full_name && <span className={styles.errorTextSmall}>{errors.full_name}</span>}
          </div>
          <div>
            <Input label="NISN" value={editData.nisn} onChange={(e) => setEditData({ ...editData, nisn: e.target.value })} required maxLength={10} />
            {errors.nisn && <span className={styles.errorTextSmall}>{errors.nisn}</span>}
          </div>
          <div>
            <Select label="Jurusan" options={JURUSAN_LIST} value={editData.jurusan} onChange={(e) => setEditData({ ...editData, jurusan: e.target.value })} required />
            {errors.jurusan && <span className={styles.errorTextSmall}>{errors.jurusan}</span>}
          </div>
          <div>
            <Select
              label="Kelas (Tingkat)"
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

      {/* Assign to Classroom Modal */}
      <AssignModal
        isOpen={isAssignOpen}
        onClose={() => { setIsAssignOpen(false); clearSelection(); }}
        selectedIds={[...selected]}
        classrooms={classrooms}
      />

      {/* PDF Modal */}
      <PdfModal isOpen={isPdfOpen} onClose={() => setIsPdfOpen(false)} jurusan={pdfJurusan} kelas={pdfKelas} />

      <Footer />
    </>
  );
}
