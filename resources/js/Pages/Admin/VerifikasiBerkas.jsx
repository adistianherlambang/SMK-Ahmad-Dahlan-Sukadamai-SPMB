import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import Popup from '../../Components/Popup/Popup';
import Button from '../../Components/Button/Button';
import styles from './AdminDashboard.module.css'; // Re-use general tables/headers/badges
import formStyles from '../Student/Auth/Formulir.module.css'; // Re-use forms styling inside popup

export default function VerifikasiBerkas({ applicants = [], quotas = [], years = [], filters = {} }) {
  const { flash } = usePage().props;
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  // Rejection input states
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

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
    router.get('/admin/verifikasi-berkas', updatedFilters, { preserveState: true });
  };

  const handleOpenDetail = (student) => {
    setSelectedStudent(student);
    setShowRejectForm(false);
    setRejectReason('');
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setSelectedStudent(null);
    setIsPopupOpen(false);
  };

  const handleAction = (actionType, additionalData = {}) => {
    if (actionType === 'delete') {
      if (!window.confirm(`Apakah Anda yakin ingin menghapus data pendaftaran ${selectedStudent.full_name} secara permanen? Akun portal siswa juga akan ikut terhapus.`)) {
        return;
      }
    }

    router.post(`/admin/verifikasi-berkas/${selectedStudent.id}/aksi`, {
      action: actionType,
      ...additionalData
    }, {
      onSuccess: () => handleClosePopup(),
    });
  };

  const submitRejection = (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      alert('Alasan penolakan berkas wajib diisi.');
      return;
    }
    handleAction('reject', { reason: rejectReason });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <>
      <Head title="Verifikasi Berkas Calon Siswa - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Verifikasi Berkas</h1>
          <p>Tinjau kelengkapan berkas fisik & digital calon siswa baru.</p>
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
              <label>Status Verifikasi</label>
              <select 
                value={filters.status ?? ''} 
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Semua Status</option>
                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                <option value="Terverifikasi">Terverifikasi</option>
                <option value="Berkas Ditolak">Berkas Ditolak</option>
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

        {/* Applicant list table */}
        <section className={styles.tableSection}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No Registrasi</th>
                  <th>Nama Lengkap</th>
                  <th>Jalur</th>
                  <th>Status Berkas</th>
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
                          student.verification_status === 'Terverifikasi' ? styles.badgeSuccess :
                          student.verification_status === 'Berkas Ditolak' ? styles.badgeDanger :
                          styles.badgeWarning
                        }`}>
                          {student.verification_status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionBtnGrid}>
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDetail(student)}
                          >
                            Tinjau
                          </Button>
                        </div>
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

        {/* Detail Popup Drawer */}
        <Popup isOpen={isPopupOpen} onClose={handleClosePopup}>
          {selectedStudent && (
            <div style={{ maxHeight: '75vh', overflowY: 'auto', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EDF2F7', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-primary-dark)', margin: 0, textTransform: 'uppercase' }}>
                  Detail Berkas Pendaftaran
                </h3>
                <button onClick={handleClosePopup} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
              </div>

              {/* Status Indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096' }}>STATUS BERKAS CURRENTLY:</span>
                <span className={`${styles.badge} ${
                  selectedStudent.verification_status === 'Terverifikasi' ? styles.badgeSuccess :
                  selectedStudent.verification_status === 'Berkas Ditolak' ? styles.badgeDanger :
                  styles.badgeWarning
                }`}>{selectedStudent.verification_status}</span>
              </div>

              {/* Student details summary */}
              <div className={formStyles.section}>
                <h4 className={formStyles.sectionTitle} style={{ fontSize: '12px' }}>Data Identitas Calon Siswa</h4>
                <table className={styles.detailsTable} style={{ fontSize: '12px' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '110px' }}>Nama Lengkap</td>
                      <td style={{ width: '10px' }}>:</td>
                      <td>{selectedStudent.full_name}</td>
                    </tr>
                    <tr>
                      <td>NISN</td>
                      <td>:</td>
                      <td>{selectedStudent.nisn}</td>
                    </tr>
                    <tr>
                      <td>Tempat/Tgl Lahir</td>
                      <td>:</td>
                      <td>{selectedStudent.birth_place} / {formatDate(selectedStudent.birth_date)}</td>
                    </tr>
                    <tr>
                      <td>Sekolah Asal</td>
                      <td>:</td>
                      <td>{selectedStudent.school_origin}</td>
                    </tr>
                    <tr>
                      <td>No HP / WA</td>
                      <td>:</td>
                      <td>{selectedStudent.phone_number}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* File list checklist */}
              <div className={formStyles.section}>
                <h4 className={formStyles.sectionTitle} style={{ fontSize: '12px' }}>Dokumen Berkas Unggahan (PDF)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedStudent.document?.file_kk ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '12px' }}>
                      <span>Kartu Keluarga (KK)</span>
                      <a href={selectedStudent.document.file_kk} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-dark)', fontWeight: 'bold' }}>Lihat File</a>
                    </div>
                  ) : <span style={{ fontSize: '11px', color: 'red' }}>File KK Hilang/Tidak diunggah</span>}

                  {selectedStudent.document?.file_akta ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '12px' }}>
                      <span>Akta Kelahiran</span>
                      <a href={selectedStudent.document.file_akta} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-dark)', fontWeight: 'bold' }}>Lihat File</a>
                    </div>
                  ) : <span style={{ fontSize: '11px', color: 'red' }}>File Akta Hilang/Tidak diunggah</span>}

                  {selectedStudent.document?.file_skhu_skl ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '12px' }}>
                      <span>SKHU / SKL</span>
                      <a href={selectedStudent.document.file_skhu_skl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-dark)', fontWeight: 'bold' }}>Lihat File</a>
                    </div>
                  ) : <span style={{ fontSize: '11px', color: 'red' }}>File SKHU/SKL Hilang/Tidak diunggah</span>}

                  {selectedStudent.document?.file_sktm ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '12px' }}>
                      <span>SKTM / KIP / PKH</span>
                      <a href={selectedStudent.document.file_sktm} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-dark)', fontWeight: 'bold' }}>Lihat File</a>
                    </div>
                  ) : <span style={{ fontSize: '11px', color: '#718096', fontStyle: 'italic' }}>- File SKTM tidak dilampirkan</span>}
                </div>
              </div>

              {/* Rejection notice box */}
              {selectedStudent.verification_status === 'Berkas Ditolak' && (
                <div style={{ backgroundColor: '#FFF5F5', border: '1px solid #FED7D7', borderRadius: '4px', padding: '12px', fontSize: '12px', color: '#742A2A' }}>
                  <strong>Alasan Penolakan Berkas Panitia:</strong>
                  <p style={{ margin: '4px 0 0 0', fontStyle: 'italic' }}>"{selectedStudent.rejection_reason}"</p>
                </div>
              )}

              {/* Action Buttons Area */}
              <div style={{ borderTop: '1px solid #EDF2F7', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {!showRejectForm ? (
                  <>
                    {selectedStudent.verification_status !== 'Terverifikasi' && (
                      <Button 
                        onClick={() => handleAction('approve')} 
                        variant="success"
                        style={{ width: '100%' }}
                      >
                        Setujui & Verifikasi Berkas
                      </Button>
                    )}

                    {selectedStudent.verification_status === 'Menunggu Verifikasi' && (
                      <Button 
                        onClick={() => setShowRejectForm(true)} 
                        variant="secondary"
                        style={{ width: '100%', backgroundColor: '#D69E2E', border: 'none', color: 'white' }}
                      >
                        Tolak Berkas Persyaratan
                      </Button>
                    )}

                    {selectedStudent.verification_status !== 'Menunggu Verifikasi' && (
                      <Button 
                        onClick={() => handleAction('undo')} 
                        variant="outline"
                        style={{ width: '100%' }}
                      >
                        Kembalikan Status Ke Menunggu
                      </Button>
                    )}

                    <Button 
                      onClick={() => handleAction('delete')} 
                      variant="danger"
                      style={{ width: '100%' }}
                    >
                      Hapus Pendaftaran Calon Siswa
                    </Button>
                  </>
                ) : (
                  <form onSubmit={submitRejection} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568' }}>Alasan Penolakan Berkas:</label>
                    <textarea 
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Contoh: Berkas Kartu Keluarga buram dan tidak terbaca..."
                      style={{ width: '100%', minHeight: '80px', padding: '10px', border: '1px solid #CBD5E0', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                      required
                    ></textarea>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button 
                        variant="outline"
                        onClick={() => setShowRejectForm(false)} 
                        style={{ flex: 1 }}
                      >
                        Batal
                      </Button>
                      <Button 
                        type="submit" 
                        variant="danger"
                        style={{ flex: 1 }}
                      >
                        Kirim Penolakan
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </Popup>
      </main>
    </>
  );
}
