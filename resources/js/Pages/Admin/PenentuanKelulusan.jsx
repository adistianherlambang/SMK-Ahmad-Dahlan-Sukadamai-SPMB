import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import Popup from '../../Components/Popup/Popup';
import Button from '../../Components/Button/Button';
import styles from './AdminDashboard.module.css'; // Re-use styles
import formStyles from '../Student/Auth/Formulir.module.css'; // Re-use sections

export default function PenentuanKelulusan({ applicants = [], quotas = [], years = [], filters = {} }) {
  const { flash } = usePage().props;
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
    router.get('/admin/penentuan-kelulusan', updatedFilters, { preserveState: true });
  };

  const handleOpenDetail = (student) => {
    setSelectedStudent(student);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setSelectedStudent(null);
    setIsPopupOpen(false);
  };

  const handleDirectAction = (student, actionType) => {
    if (actionType === 'delete') {
      if (!window.confirm(`Apakah Anda yakin ingin menghapus data pendaftaran ${student.full_name} secara permanen? Akun portal siswa juga akan ikut terhapus.`)) {
        return;
      }
    }

    router.post(`/admin/penentuan-kelulusan/${student.id}/aksi`, {
      action: actionType
    });
  };

  const handleAction = (actionType) => {
    if (actionType === 'delete') {
      if (!window.confirm(`Apakah Anda yakin ingin menghapus data pendaftaran ${selectedStudent.full_name} secara permanen? Akun portal siswa juga akan ikut terhapus.`)) {
        return;
      }
    }

    router.post(`/admin/penentuan-kelulusan/${selectedStudent.id}/aksi`, {
      action: actionType
    }, {
      onSuccess: () => handleClosePopup(),
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <>
      <Head title="Penentuan Kelulusan Seleksi - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Penentuan Kelulusan</h1>
          <p>Tentukan status kelulusan akhir bagi calon siswa baru yang berkasnya telah terverifikasi.</p>
        </div>
      </header>

      <main className={styles.container}>
        {/* Flash Notifications */}
        {flash?.success && (
          <div className={`${styles.alertBox} ${styles.alertSuccess}`} style={{ marginBottom: '16px' }}>
            {flash.success}
          </div>
        )}

        {/* Filters Grid */}
        <section className={styles.filterSection}>
          <div className={styles.filtersGrid}>
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

            <div className={styles.filterGroup}>
              <label>Status Seleksi</label>
              <select 
                value={filters.status ?? ''} 
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Semua Status</option>
                <option value="Menunggu Kelulusan">Menunggu Kelulusan</option>
                <option value="Diterima">Diterima / Lulus</option>
                <option value="Tidak Lulus">Tidak Lulus</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Cari Calon Siswa</label>
              <input 
                type="text" 
                placeholder="Cari Nama..." 
                value={filters.search ?? ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className={styles.filterInput}
              />
            </div>
          </div>
        </section>

        {/* Verified list table */}
        <section className={styles.tableSection}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No Registrasi</th>
                  <th>Nama Lengkap</th>
                  <th>Jalur</th>
                  <th>Status Seleksi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {applicants.length > 0 ? (
                  applicants.map((student) => (
                    <tr key={student.id}>
                      <td className={styles.boldCell}>{student.registration_number}</td>
                      <td>{student.full_name}</td>
                      <td>{student.quota?.name}</td>
                      <td>
                        <span className={`${styles.badge} ${
                          student.graduation_status === 'Diterima' ? styles.badgeSuccess :
                          student.graduation_status === 'Tidak Lulus' ? styles.badgeDanger :
                          styles.badgeSecondary
                        }`}>
                          {student.graduation_status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionBtnGrid}>
                          {student.graduation_status !== 'Diterima' && (
                            <button
                              className={`${styles.iconBtn} ${styles.iconBtnSuccess}`}
                              title="Nyatakan Diterima"
                              onClick={() => handleDirectAction(student, 'accept')}
                            >
                              ✓
                            </button>
                          )}
                          {student.graduation_status !== 'Tidak Lulus' && (
                            <button
                              className={`${styles.iconBtn} ${styles.iconBtnWarning}`}
                              title="Nyatakan Tidak Lulus"
                              onClick={() => handleDirectAction(student, 'reject')}
                            >
                              ✗
                            </button>
                          )}
                          {student.graduation_status !== 'Menunggu Kelulusan' && (
                            <button
                              className={`${styles.iconBtn} ${styles.iconBtnSecondary}`}
                              title="Kembalikan ke Menunggu Kelulusan"
                              onClick={() => handleDirectAction(student, 'undo')}
                            >
                              ↩
                            </button>
                          )}
                          <button
                            className={`${styles.iconBtn} ${styles.iconBtnInfo}`}
                            title="Kembalikan ke Verifikasi Berkas"
                            onClick={() => handleDirectAction(student, 'undo_verif')}
                          >
                            📂
                          </button>
                          <button
                            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                            title="Hapus Pendaftaran"
                            onClick={() => handleDirectAction(student, 'delete')}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.emptyCell}>Tidak ada data calon siswa terverifikasi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Graduation Action Popup */}
        <Popup isOpen={isPopupOpen} onClose={handleClosePopup}>
          {selectedStudent && (
            <div style={{ maxHeight: '75vh', overflowY: 'auto', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EDF2F7', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-primary-dark)', margin: 0, textTransform: 'uppercase' }}>
                  Aksi Penentuan Kelulusan
                </h3>
                <button onClick={handleClosePopup} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
              </div>

              {/* Status Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096' }}>STATUS SELEKSI AKHIR:</span>
                <span className={`${styles.badge} ${
                  selectedStudent.graduation_status === 'Diterima' ? styles.badgeSuccess :
                  selectedStudent.graduation_status === 'Tidak Lulus' ? styles.badgeDanger :
                  styles.badgeSecondary
                }`}>{selectedStudent.graduation_status}</span>
              </div>

              {/* Details table */}
              <div className={formStyles.section}>
                <h4 className={formStyles.sectionTitle} style={{ fontSize: '12px' }}>Rangkuman Profil Calon Siswa</h4>
                <table className={styles.detailsTable} style={{ fontSize: '12px' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '110px' }}>No Registrasi</td>
                      <td style={{ width: '10px' }}>:</td>
                      <td><strong>{selectedStudent.registration_number}</strong></td>
                    </tr>
                    <tr>
                      <td>Nama Lengkap</td>
                      <td>:</td>
                      <td>{selectedStudent.full_name}</td>
                    </tr>
                    <tr>
                      <td>NISN</td>
                      <td>:</td>
                      <td>{selectedStudent.nisn}</td>
                    </tr>
                    <tr>
                      <td>Sekolah Asal</td>
                      <td>:</td>
                      <td>{selectedStudent.school_origin}</td>
                    </tr>
                    <tr>
                      <td>Jalur Pendaftaran</td>
                      <td>:</td>
                      <td>{selectedStudent.quota?.name}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div style={{ borderTop: '1px solid #EDF2F7', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedStudent.graduation_status !== 'Diterima' && (
                  <Button 
                    onClick={() => handleAction('accept')} 
                    variant="success"
                    style={{ width: '100%' }}
                  >
                    Nyatakan DITERIMA (Lulus Seleksi)
                  </Button>
                )}

                {selectedStudent.graduation_status !== 'Tidak Lulus' && (
                  <Button 
                    onClick={() => handleAction('reject')} 
                    variant="secondary"
                    style={{ width: '100%', backgroundColor: '#D69E2E', border: 'none', color: 'white' }}
                  >
                    Nyatakan TIDAK LULUS Seleksi
                  </Button>
                )}

                {selectedStudent.graduation_status !== 'Menunggu Kelulusan' && (
                  <Button 
                    onClick={() => handleAction('undo')} 
                    variant="outline"
                    style={{ width: '100%' }}
                  >
                    Kembalikan Status Ke Menunggu Kelulusan
                  </Button>
                )}

                <Button 
                  onClick={() => handleAction('delete')} 
                  variant="danger"
                  style={{ width: '100%' }}
                >
                  Hapus Pendaftaran Calon Siswa
                </Button>
              </div>
            </div>
          )}
        </Popup>
      </main>
    </>
  );
}
