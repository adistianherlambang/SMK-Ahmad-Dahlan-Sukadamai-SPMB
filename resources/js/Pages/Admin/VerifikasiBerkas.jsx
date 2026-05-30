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

  // Premium action confirmation states
  const [confirmPopup, setConfirmPopup] = useState({
    isOpen: false,
    student: null,
    type: '', // 'delete', 'reject', 'approve'
    reason: ''
  });

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

  const handleDirectAction = (student, actionType) => {
    if (actionType === 'delete' || actionType === 'reject' || actionType === 'approve' || actionType === 'verify') {
      setConfirmPopup({
        isOpen: true,
        student,
        type: actionType === 'verify' ? 'approve' : actionType,
        reason: ''
      });
      return;
    }

    router.post(`/admin/verifikasi-berkas/${student.id}/aksi`, {
      action: actionType
    });
  };

  const handleAction = (actionType, additionalData = {}) => {
    if (actionType === 'delete') {
      setIsPopupOpen(false); // Close detail drawer first
      setConfirmPopup({
        isOpen: true,
        student: selectedStudent,
        type: 'delete',
        reason: ''
      });
      return;
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
                        <div className={styles.actionBtnGrid}>
                          <button
                            type="button"
                            className={`${styles.iconBtn} ${styles.iconBtnInfo}`}
                            onClick={() => handleOpenDetail(student)}
                            title="Tinjau Berkas & Detail"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="16" x2="12" y2="12" />
                              <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                          </button>
                          
                          {student.verification_status !== 'Terverifikasi' && (
                            <button
                              type="button"
                              className={`${styles.iconBtn} ${styles.iconBtnSuccess}`}
                              onClick={() => handleDirectAction(student, 'verify')}
                              title="Setujui Berkas"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </button>
                          )}
                          
                          {student.verification_status !== 'Berkas Ditolak' && (
                            <button
                              type="button"
                              className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                              onClick={() => handleDirectAction(student, 'reject')}
                              title="Tolak Berkas"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className={styles.emptyCell}>Tidak ada data calon siswa terdaftar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Detail Popup Drawer */}
        <Popup isOpen={isPopupOpen} onClose={handleClosePopup}>
          {selectedStudent && (
            <div style={{ maxHeight: '75vh', overflowY: 'auto', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px', fontWeight: '400' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EDF2F7', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '400', color: 'var(--color-primary-dark)', margin: 0 }}>
                  Detail Berkas Pendaftaran
                </h2>
                <button onClick={handleClosePopup} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', fontWeight: '400' }}>×</button>
              </div>

              {/* Status Indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '4px', fontWeight: '400' }}>
                <span style={{ fontSize: '12px', fontWeight: '400', color: '#718096' }}>STATUS BERKAS:</span>
                <span className={`${styles.badge} ${
                  selectedStudent.verification_status === 'Terverifikasi' ? styles.badgeSuccess :
                  selectedStudent.verification_status === 'Berkas Ditolak' ? styles.badgeDanger :
                  styles.badgeWarning
                }`} style={{ fontWeight: '400' }}>{selectedStudent.verification_status}</span>
              </div>

              {/* Student details summary */}
              <div className={formStyles.section} style={{ fontWeight: '400' }}>
                <h4 className={formStyles.sectionTitle} style={{ fontSize: '12px', fontWeight: '400' }}>Data Identitas Calon Siswa</h4>
                <table className={styles.detailsTable} style={{ fontSize: '12px', fontWeight: '400' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '110px', fontWeight: '400' }}>Nama Lengkap</td>
                      <td style={{ width: '10px' }}>:</td>
                      <td style={{ fontWeight: '400' }}>{selectedStudent.full_name}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: '400' }}>NISN</td>
                      <td>:</td>
                      <td style={{ fontWeight: '400' }}>{selectedStudent.nisn}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: '400' }}>Tempat/Tgl Lahir</td>
                      <td>:</td>
                      <td style={{ fontWeight: '400' }}>{selectedStudent.birth_place} / {formatDate(selectedStudent.birth_date)}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: '400' }}>Sekolah Asal</td>
                      <td>:</td>
                      <td style={{ fontWeight: '400' }}>{selectedStudent.school_origin}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: '400' }}>No HP / WA</td>
                      <td>:</td>
                      <td style={{ fontWeight: '400' }}>{selectedStudent.phone_number}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* File list checklist */}
              <div className={formStyles.section} style={{ fontWeight: '400' }}>
                <h4 className={formStyles.sectionTitle} style={{ fontSize: '12px', fontWeight: '400' }}>Dokumen Berkas Unggahan (PDF)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedStudent.document?.file_kk ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '12px', fontWeight: '400' }}>
                      <span>Kartu Keluarga (KK)</span>
                      <a href={selectedStudent.document.file_kk} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-dark)', fontWeight: '400' }}>Lihat File</a>
                    </div>
                  ) : <span style={{ fontSize: '11px', color: 'red', fontWeight: '400' }}>File KK Hilang/Tidak diunggah</span>}

                  {selectedStudent.document?.file_akta ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '12px', fontWeight: '400' }}>
                      <span>Akta Kelahiran</span>
                      <a href={selectedStudent.document.file_akta} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-dark)', fontWeight: '400' }}>Lihat File</a>
                    </div>
                  ) : <span style={{ fontSize: '11px', color: 'red', fontWeight: '400' }}>File Akta Hilang/Tidak diunggah</span>}

                  {selectedStudent.document?.file_skhu_skl ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '12px', fontWeight: '400' }}>
                      <span>SKHU / SKL</span>
                      <a href={selectedStudent.document.file_skhu_skl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-dark)', fontWeight: '400' }}>Lihat File</a>
                    </div>
                  ) : <span style={{ fontSize: '11px', color: 'red', fontWeight: '400' }}>File SKHU/SKL Hilang/Tidak diunggah</span>}

                  {selectedStudent.document?.file_sktm ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '12px', fontWeight: '400' }}>
                      <span>SKTM / KIP / PKH</span>
                      <a href={selectedStudent.document.file_sktm} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-dark)', fontWeight: '400' }}>Lihat File</a>
                    </div>
                  ) : <span style={{ fontSize: '11px', color: '#718096', fontStyle: 'italic', fontWeight: '400' }}>- File SKTM tidak dilampirkan</span>}
                </div>
              </div>

              {/* Rejection notice box */}
              {selectedStudent.verification_status === 'Berkas Ditolak' && (
                <div style={{ backgroundColor: '#FFF5F5', border: '1px solid #FED7D7', borderRadius: '4px', padding: '12px', fontSize: '12px', color: '#742A2A', fontWeight: '400' }}>
                  <span style={{ display: 'block', marginBottom: '4px' }}>Alasan Penolakan Berkas Panitia:</span>
                  <p style={{ margin: 0, fontStyle: 'italic' }}>"{selectedStudent.rejection_reason}"</p>
                </div>
              )}

              {/* Action Buttons Area */}
              <div style={{ borderTop: '1px solid #EDF2F7', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontWeight: '400' }}>
                {!showRejectForm ? (
                  <>
                    {selectedStudent.verification_status !== 'Terverifikasi' && (
                      <Button 
                        onClick={() => handleAction('approve')} 
                        variant="success"
                        style={{ width: '100%', fontWeight: '400' }}
                      >
                        Setujui & Verifikasi Berkas
                      </Button>
                    )}

                    {selectedStudent.verification_status === 'Menunggu Verifikasi' && (
                      <Button 
                        onClick={() => setShowRejectForm(true)} 
                        variant="secondary"
                        style={{ width: '100%', backgroundColor: '#D69E2E', border: 'none', color: 'white', fontWeight: '400' }}
                      >
                        Tolak Berkas Persyaratan
                      </Button>
                    )}

                    {selectedStudent.verification_status !== 'Menunggu Verifikasi' && (
                      <Button 
                        onClick={() => handleAction('undo')} 
                        variant="outline"
                        style={{ width: '100%', fontWeight: '400' }}
                      >
                        Kembalikan Status Ke Menunggu
                      </Button>
                    )}

                    <Button 
                      onClick={() => handleAction('delete')} 
                      variant="danger"
                      style={{ width: '100%', fontWeight: '400' }}
                    >
                      Hapus Pendaftaran Calon Siswa
                    </Button>
                  </>
                ) : (
                  <form onSubmit={submitRejection} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', fontWeight: '400' }}>
                    <label style={{ fontSize: '12px', color: '#4A5568', fontWeight: '400' }}>Alasan Penolakan Berkas:</label>
                    <textarea 
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Contoh: Berkas Kartu Keluarga buram dan tidak terbaca..."
                      style={{ width: '100%', minHeight: '80px', padding: '10px', border: '1px solid #CBD5E0', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', fontWeight: '400' }}
                      required
                    ></textarea>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button 
                        variant="outline"
                        onClick={() => setShowRejectForm(false)} 
                        style={{ flex: 1, fontWeight: '400' }}
                      >
                        Batal
                      </Button>
                      <Button 
                        type="submit" 
                        variant="danger"
                        style={{ flex: 1, fontWeight: '400' }}
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

        {/* Action Confirmation Popup */}
        <Popup isOpen={confirmPopup.isOpen} onClose={() => setConfirmPopup({ ...confirmPopup, isOpen: false })}>
          {confirmPopup.student && (
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '15px', fontWeight: '400' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EDF2F7', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '400', color: 'var(--color-primary-dark)', margin: 0 }}>
                  {confirmPopup.type === 'delete' && 'Konfirmasi Hapus Pendaftaran'}
                  {confirmPopup.type === 'reject' && 'Tolak Berkas Persyaratan'}
                  {confirmPopup.type === 'approve' && 'Setujui Berkas Pendaftaran'}
                </h2>
                <button onClick={() => setConfirmPopup({ ...confirmPopup, isOpen: false })} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', fontWeight: '400' }}>×</button>
              </div>

              {confirmPopup.type === 'delete' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontWeight: '400' }}>
                  <p style={{ fontSize: '13px', color: '#4A5568', margin: 0, lineHeight: '1.5', fontWeight: '400' }}>
                    Apakah Anda yakin ingin menghapus data pendaftaran <span style={{ color: 'var(--color-primary-dark)' }}>{confirmPopup.student.full_name}</span> secara permanen? Akun portal siswa juga akan ikut terhapus.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <Button onClick={() => setConfirmPopup({ ...confirmPopup, isOpen: false })} variant="outline" style={{ flex: 1, fontWeight: '400' }}>Batal</Button>
                    <Button onClick={() => {
                      router.post(`/admin/verifikasi-berkas/${confirmPopup.student.id}/aksi`, { action: 'delete' });
                      setConfirmPopup({ ...confirmPopup, isOpen: false });
                    }} variant="danger" style={{ flex: 1, fontWeight: '400' }}>Hapus Permanen</Button>
                  </div>
                </div>
              )}

              {confirmPopup.type === 'reject' && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!confirmPopup.reason.trim()) {
                    alert('Alasan penolakan berkas wajib diisi.');
                    return;
                  }
                  router.post(`/admin/verifikasi-berkas/${confirmPopup.student.id}/aksi`, { action: 'reject', reason: confirmPopup.reason });
                  setConfirmPopup({ ...confirmPopup, isOpen: false });
                }} style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontWeight: '400' }}>
                  <p style={{ fontSize: '13px', color: '#4A5568', margin: 0, lineHeight: '1.5', fontWeight: '400' }}>
                    Masukkan alasan penolakan berkas untuk <span style={{ color: 'var(--color-primary-dark)' }}>{confirmPopup.student.full_name}</span>:
                  </p>
                  <textarea
                    rows="3"
                    className={formStyles.textareaField}
                    placeholder="Contoh: Kartu Keluarga tidak terbaca jelas atau file rusak."
                    value={confirmPopup.reason}
                    onChange={(e) => setConfirmPopup({ ...confirmPopup, reason: e.target.value })}
                    style={{ width: '100%', minHeight: '80px', padding: '10px', border: '1px solid #CBD5E0', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', fontWeight: '400' }}
                    required
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <Button type="button" onClick={() => setConfirmPopup({ ...confirmPopup, isOpen: false })} variant="outline" style={{ flex: 1, fontWeight: '400' }}>Batal</Button>
                    <Button type="submit" variant="danger" style={{ flex: 1, fontWeight: '400' }}>Kirim Penolakan</Button>
                  </div>
                </form>
              )}

              {confirmPopup.type === 'approve' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontWeight: '400' }}>
                  <p style={{ fontSize: '13px', color: '#4A5568', margin: 0, lineHeight: '1.5', fontWeight: '400' }}>
                    Apakah Anda yakin ingin menyetujui berkas pendaftaran atas nama <span style={{ color: 'var(--color-primary-dark)' }}>{confirmPopup.student.full_name}</span> dan memindahkannya ke antrean kelulusan?
                  </p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <Button onClick={() => setConfirmPopup({ ...confirmPopup, isOpen: false })} variant="outline" style={{ flex: 1, fontWeight: '400' }}>Batal</Button>
                    <Button onClick={() => {
                      router.post(`/admin/verifikasi-berkas/${confirmPopup.student.id}/aksi`, { action: 'approve' });
                      setConfirmPopup({ ...confirmPopup, isOpen: false });
                    }} variant="success" style={{ flex: 1, fontWeight: '400' }}>Setujui & Verifikasi</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Popup>
      </main>
    </>
  );
}
