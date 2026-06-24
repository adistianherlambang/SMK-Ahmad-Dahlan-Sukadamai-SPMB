import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import Popup from '../../Components/Popup/Popup';
import Button from '../../Components/Button/Button';
import Input from '../../Components/Input/Input';
import Select from '../../Components/Select/Select';
import styles from './AdminDashboard.module.css';
import formStyles from '../Student/Auth/Formulir.module.css';

export default function Siswa({ students = [], filters = {} }) {
  const { flash } = usePage().props;
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [jurusanFilter, setJurusanFilter] = useState(filters.jurusan || '');
  
  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: '',
    nis: '',
    jurusan: '',
    full_name: '',
    nisn: ''
  });
  
  const [errors, setErrors] = useState({});

  const links = [
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
        { url: '/admin/achievements', label: 'Kelola Prestasi' }
      ]
    },
    { url: '/logout', label: 'Keluar', method: 'post' }
  ];

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    triggerFilter(val, jurusanFilter);
  };

  const handleJurusanChange = (val) => {
    setJurusanFilter(val);
    triggerFilter(searchTerm, val);
  };

  const triggerFilter = (search, jurusan) => {
    router.get('/admin/siswa', { search, jurusan }, { preserveState: true });
  };

  const handleOpenEdit = (student) => {
    setEditData({
      id: student.id,
      nis: student.nis || '',
      jurusan: student.jurusan || 'teknik otomotif',
      full_name: student.full_name || '',
      nisn: student.nisn || ''
    });
    setErrors({});
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    router.put(`/admin/siswa/${editData.id}`, editData, {
      onSuccess: () => {
        setIsEditOpen(false);
      },
      onError: (err) => {
        setErrors(err);
      }
    });
  };

  const formatJurusan = (jurusan) => {
    if (!jurusan) return '-';
    return jurusan.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <>
      <Head title="Manajemen Siswa - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Manajemen Siswa</h1>
          <p>Kelola data siswa terdaftar yang telah dinyatakan lulus/diterima</p>
        </div>
      </header>

      <main className={styles.container}>
        {flash?.success && (
          <div className={styles.alertSuccess} style={{ backgroundColor: '#C6F6D5', color: '#22543D', padding: '12px 16px', borderRadius: '4px', textAlign: 'left' }}>
            {flash.success}
          </div>
        )}

        {/* Filters and Search */}
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
                  <option value="teknik otomotif">Teknik Otomotif</option>
                  <option value="manajemen dan bisnis">Manajemen dan Bisnis</option>
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

        {/* Students Table */}
        <section className={styles.tableSection}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>NIS</th>
                  <th>Nama Lengkap</th>
                  <th>Jurusan</th>
                  <th>NISN</th>
                  <th>Asal Sekolah</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.id}>
                      <td className={styles.boldCell}>{student.nis || '-'}</td>
                      <td>{student.full_name}</td>
                      <td>{formatJurusan(student.jurusan)}</td>
                      <td>{student.nisn}</td>
                      <td>{student.school_origin}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Button 
                          onClick={() => handleOpenEdit(student)}
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
                    <td colSpan="6" className={styles.emptyCell}>Tidak ada data siswa terdaftar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Edit Student Popup */}
      <Popup isOpen={isEditOpen} onClose={handleCloseEdit}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Edit Data Siswa</h3>
        </div>
        <form onSubmit={handleUpdate} className={styles.confirmModalForm} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              options={[
                { value: 'teknik otomotif', label: 'Teknik Otomotif' },
                { value: 'manajemen dan bisnis', label: 'Manajemen dan Bisnis' }
              ]}
              value={editData.jurusan}
              onChange={(e) => setEditData({ ...editData, jurusan: e.target.value })}
              required
            />
            {errors.jurusan && <span className={styles.errorTextSmall}>{errors.jurusan}</span>}
          </div>

          <div className={styles.btnRow}>
            <Button type="button" variant="secondary" onClick={handleCloseEdit}>
              Batal
            </Button>
            <Button type="submit">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Popup>

      <Footer />
    </>
  );
}
