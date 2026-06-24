import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
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
          <div className={`${styles.alertBox} ${styles.alertSuccess}`}>
            {flash.success}
          </div>
        )}

        {/* Filters Grid */}
        <section className={styles.filterSection}>
          <div className={styles.filtersGrid}>
            <div className={styles.filterWrapper}>
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
                  <th>Jurusan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {applicants.length > 0 ? (
                  applicants.map((student) => (
                    <tr key={student.id}>
                      <td className={styles.boldCell}>{student.registration_number}</td>
                      <td>{student.full_name}</td>
                      <td>{student.jurusan ? student.jurusan.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '-'}</td>
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
                              className={`${styles.iconBtn} ${styles.iconBtnWarning}`}
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
            <div className={styles.popupDetailContainer}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  Detail Berkas Pendaftaran
                </h2>
              </div>

              {/* Student details summary */}
              <div className={`${formStyles.section} ${styles.sectionWrapper}`}>
                <h4 className={`${formStyles.sectionTitle} ${styles.modalSectionTitle}`}>Data Identitas Calon Siswa</h4>
                <table className={styles.detailsTable}>
                  <tbody>
                    <tr>
                      <td className={styles.detailsLabel}>Nama Lengkap</td>
                      <td className={styles.detailsSeparator}>:</td>
                      <td>{selectedStudent.full_name}</td>
                    </tr>
                    <tr>
                      <td className={styles.detailsLabel}>NISN</td>
                      <td className={styles.detailsSeparator}>:</td>
                      <td>{selectedStudent.nisn}</td>
                    </tr>
                    <tr>
                      <td className={styles.detailsLabel}>Tempat/Tgl Lahir</td>
                      <td className={styles.detailsSeparator}>:</td>
                      <td>{selectedStudent.birth_place} / {formatDate(selectedStudent.birth_date)}</td>
                    </tr>
                    <tr>
                      <td className={styles.detailsLabel}>Sekolah Asal</td>
                      <td className={styles.detailsSeparator}>:</td>
                      <td>{selectedStudent.school_origin}</td>
                    </tr>
                    <tr>
                      <td className={styles.detailsLabel}>No HP / WA</td>
                      <td className={styles.detailsSeparator}>:</td>
                      <td>{selectedStudent.phone_number}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={`${formStyles.section} ${styles.sectionWrapper}`}>
                <h4 className={`${formStyles.sectionTitle} ${styles.modalSectionTitle}`}>Keterangan Orang Tua / Wali</h4>
                <table className={styles.detailsTable}>
                  <tbody>
                    <tr>
                      <td className={styles.detailsLabel}>Nama Ortu / Wali</td>
                      <td className={styles.detailsSeparator}>:</td>
                      <td>{selectedStudent.parent_name}</td>
                    </tr>
                    <tr>
                      <td className={styles.detailsLabel}>Pekerjaan Ortu / Wali</td>
                      <td className={styles.detailsSeparator}>:</td>
                      <td>{selectedStudent.parent_occupation}</td>
                    </tr>
                    <tr>
                      <td className={styles.detailsLabel}>Status</td>
                      <td className={styles.detailsSeparator}>:</td>
                      <td>{selectedStudent.parent_status}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={`${formStyles.section} ${styles.sectionWrapper}`}>
                <h4 className={`${formStyles.sectionTitle} ${styles.modalSectionTitle}`}>Keterangan Sekolah Asal</h4>
                <table className={styles.detailsTable}>
                  <tbody>
                    <tr>
                      <td className={styles.detailsLabel}>Nama Sekolah</td>
                      <td className={styles.detailsSeparator}>:</td>
                      <td>{selectedStudent.school_origin}</td>
                    </tr>
                    <tr>
                      <td className={styles.detailsLabel}>Alamat</td>
                      <td className={styles.detailsSeparator}>:</td>
                      <td>{selectedStudent.school_address}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={`${formStyles.section} ${styles.sectionWrapper}`}>
                <h4 className={`${formStyles.sectionTitle} ${styles.modalSectionTitle}`}>Alamat</h4>
                <table className={styles.detailsTable}>
                  <tbody>
                    <tr>
                      <td className={styles.detailsLabel}>No. Telp / WA</td>
                      <td className={styles.detailsSeparator}>:</td>
                      <td>{selectedStudent.phone_number}</td>
                    </tr>
                    <tr>
                      <td className={styles.detailsLabel}>Alamat</td>
                      <td className={styles.detailsSeparator}>:</td>
                      <td>{selectedStudent.address}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* File list checklist */}
              <div className={`${formStyles.section} ${styles.sectionWrapper}`}>
                <h4 className={`${formStyles.sectionTitle} ${styles.modalSectionTitle}`}>Berkas Ter-Upload</h4>
                <div className={styles.documentList}>
                  {selectedStudent.document?.file_kk ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "50%" }}>
                      <p style={{ fontSize: "12px" }}>Kartu Keluarga (KK)</p>
                      <a href={selectedStudent.document.file_kk} target="_blank" rel="noopener noreferrer" className={styles.documentRow}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 5.7C7.50632 5.7 7.99191 5.88964 8.34993 6.22721C8.70796 6.56477 8.90909 7.02261 8.90909 7.5C8.90909 7.97739 8.70796 8.43523 8.34993 8.77279C7.99191 9.11036 7.50632 9.3 7 9.3C6.49368 9.3 6.00809 9.11036 5.65007 8.77279C5.29204 8.43523 5.09091 7.97739 5.09091 7.5C5.09091 7.02261 5.29204 6.56477 5.65007 6.22721C6.00809 5.88964 6.49368 5.7 7 5.7ZM7 3C10.1818 3 12.8991 4.866 14 7.5C12.8991 10.134 10.1818 12 7 12C3.81818 12 1.10091 10.134 0 7.5C1.10091 4.866 3.81818 3 7 3ZM1.38727 7.5C1.90162 8.49018 2.70029 9.32445 3.69249 9.90795C4.68469 10.4915 5.83062 10.8008 7 10.8008C8.16938 10.8008 9.31531 10.4915 10.3075 9.90795C11.2997 9.32445 12.0984 8.49018 12.6127 7.5C12.0984 6.50982 11.2997 5.67555 10.3075 5.09205C9.31531 4.50854 8.16938 4.19921 7 4.19921C5.83062 4.19921 4.68469 4.50854 3.69249 5.09205C2.70029 5.67555 1.90162 6.50982 1.38727 7.5Z" fill="#1F1B18" />
                        </svg>
                        <p className={styles.modalLink}>Lihat File</p>
                      </a>
                    </div>
                  ) : <span className={styles.errorTextSmall}>File KK Hilang/Tidak diunggah</span>}

                  {selectedStudent.document?.file_akta ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "50%" }}>
                      <p style={{ fontSize: "12px" }}>Akta Kelahiran</p>
                      <a href={selectedStudent.document.file_akta} target="_blank" rel="noopener noreferrer" className={styles.documentRow}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 5.7C7.50632 5.7 7.99191 5.88964 8.34993 6.22721C8.70796 6.56477 8.90909 7.02261 8.90909 7.5C8.90909 7.97739 8.70796 8.43523 8.34993 8.77279C7.99191 9.11036 7.50632 9.3 7 9.3C6.49368 9.3 6.00809 9.11036 5.65007 8.77279C5.29204 8.43523 5.09091 7.97739 5.09091 7.5C5.09091 7.02261 5.29204 6.56477 5.65007 6.22721C6.00809 5.88964 6.49368 5.7 7 5.7ZM7 3C10.1818 3 12.8991 4.866 14 7.5C12.8991 10.134 10.1818 12 7 12C3.81818 12 1.10091 10.134 0 7.5C1.10091 4.866 3.81818 3 7 3ZM1.38727 7.5C1.90162 8.49018 2.70029 9.32445 3.69249 9.90795C4.68469 10.4915 5.83062 10.8008 7 10.8008C8.16938 10.8008 9.31531 10.4915 10.3075 9.90795C11.2997 9.32445 12.0984 8.49018 12.6127 7.5C12.0984 6.50982 11.2997 5.67555 10.3075 5.09205C9.31531 4.50854 8.16938 4.19921 7 4.19921C5.83062 4.19921 4.68469 4.50854 3.69249 5.09205C2.70029 5.67555 1.90162 6.50982 1.38727 7.5Z" fill="#1F1B18" />
                        </svg>
                        <p className={styles.modalLink}>Lihat File</p>
                      </a>
                    </div>
                  ) : <span className={styles.errorTextSmall}>File Akta Hilang/Tidak diunggah</span>}
                </div>
                <div className={styles.documentList}>
                  {selectedStudent.document?.file_skhu_skl ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "50%" }}>
                      <p style={{ fontSize: "12px" }}>SKHU / SKL</p>
                      <a href={selectedStudent.document.file_skhu_skl} target="_blank" rel="noopener noreferrer" className={styles.documentRow}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 5.7C7.50632 5.7 7.99191 5.88964 8.34993 6.22721C8.70796 6.56477 8.90909 7.02261 8.90909 7.5C8.90909 7.97739 8.70796 8.43523 8.34993 8.77279C7.99191 9.11036 7.50632 9.3 7 9.3C6.49368 9.3 6.00809 9.11036 5.65007 8.77279C5.29204 8.43523 5.09091 7.97739 5.09091 7.5C5.09091 7.02261 5.29204 6.56477 5.65007 6.22721C6.00809 5.88964 6.49368 5.7 7 5.7ZM7 3C10.1818 3 12.8991 4.866 14 7.5C12.8991 10.134 10.1818 12 7 12C3.81818 12 1.10091 10.134 0 7.5C1.10091 4.866 3.81818 3 7 3ZM1.38727 7.5C1.90162 8.49018 2.70029 9.32445 3.69249 9.90795C4.68469 10.4915 5.83062 10.8008 7 10.8008C8.16938 10.8008 9.31531 10.4915 10.3075 9.90795C11.2997 9.32445 12.0984 8.49018 12.6127 7.5C12.0984 6.50982 11.2997 5.67555 10.3075 5.09205C9.31531 4.50854 8.16938 4.19921 7 4.19921C5.83062 4.19921 4.68469 4.50854 3.69249 5.09205C2.70029 5.67555 1.90162 6.50982 1.38727 7.5Z" fill="#1F1B18" />
                        </svg>
                        <p className={styles.modalLink}>Lihat File</p>
                      </a>
                    </div>
                  ) : <span className={styles.errorTextSmall}>File SKHU/SKL Hilang/Tidak diunggah</span>}

                  {selectedStudent.document?.file_sktm ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "50%" }}>
                      <p style={{ fontSize: "12px" }}>SKTM</p>
                      <a href={selectedStudent.document.file_sktm} target="_blank" rel="noopener noreferrer" className={styles.documentRow}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 5.7C7.50632 5.7 7.99191 5.88964 8.34993 6.22721C8.70796 6.56477 8.90909 7.02261 8.90909 7.5C8.90909 7.97739 8.70796 8.43523 8.34993 8.77279C7.99191 9.11036 7.50632 9.3 7 9.3C6.49368 9.3 6.00809 9.11036 5.65007 8.77279C5.29204 8.43523 5.09091 7.97739 5.09091 7.5C5.09091 7.02261 5.29204 6.56477 5.65007 6.22721C6.00809 5.88964 6.49368 5.7 7 5.7ZM7 3C10.1818 3 12.8991 4.866 14 7.5C12.8991 10.134 10.1818 12 7 12C3.81818 12 1.10091 10.134 0 7.5C1.10091 4.866 3.81818 3 7 3ZM1.38727 7.5C1.90162 8.49018 2.70029 9.32445 3.69249 9.90795C4.68469 10.4915 5.83062 10.8008 7 10.8008C8.16938 10.8008 9.31531 10.4915 10.3075 9.90795C11.2997 9.32445 12.0984 8.49018 12.6127 7.5C12.0984 6.50982 11.2997 5.67555 10.3075 5.09205C9.31531 4.50854 8.16938 4.19921 7 4.19921C5.83062 4.19921 4.68469 4.50854 3.69249 5.09205C2.70029 5.67555 1.90162 6.50982 1.38727 7.5Z" fill="#1F1B18" />
                        </svg>
                        <p className={styles.modalLink}>Lihat File</p>
                      </a>
                    </div>
                  ) : <span className={styles.infoTextSmall}>- File SKTM tidak dilampirkan</span>}
                </div>
              </div>

              {/* Rejection notice box */}
              {selectedStudent.verification_status === 'Berkas Ditolak' && (
                <div className={styles.rejectionBox}>
                  <span className={styles.rejectionTitle}>Alasan Penolakan Berkas Panitia:</span>
                  <p>"{selectedStudent.rejection_reason}"</p>
                </div>
              )}

              <Button onClick={handleClosePopup} variant="primary">
                Tutup
              </Button>
            </div>
          )}
        </Popup>

        {/* Action Confirmation Popup */}
        <Popup isOpen={confirmPopup.isOpen} onClose={() => setConfirmPopup({ ...confirmPopup, isOpen: false })}>
          {confirmPopup.student && (
            <div className={styles.confirmModalContainer}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {confirmPopup.type === 'delete' && 'Konfirmasi Hapus Pendaftaran'}
                  {confirmPopup.type === 'reject' && 'Tolak Berkas Persyaratan'}
                  {confirmPopup.type === 'approve' && 'Setujui Berkas Pendaftaran'}
                </h2>
              </div>

              {confirmPopup.type === 'delete' && (
                <div className={styles.confirmModalContent}>
                  <p className={styles.confirmModalText}>
                    Apakah Anda yakin ingin menghapus data pendaftaran <span className={styles.highlightText}>{confirmPopup.student.full_name}</span> secara permanen? Akun portal siswa juga akan ikut terhapus.
                  </p>
                  <div className={styles.btnRow}>
                    <Button onClick={() => setConfirmPopup({ ...confirmPopup, isOpen: false })} variant="outline" className={styles.flex1Btn}>Batal</Button>
                    <Button onClick={() => {
                      router.post(`/admin/verifikasi-berkas/${confirmPopup.student.id}/aksi`, { action: 'delete' });
                      setConfirmPopup({ ...confirmPopup, isOpen: false });
                    }} variant="danger" className={styles.flex1Btn}>Hapus Permanen</Button>
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
                }} className={styles.confirmModalForm}>
                  <p className={styles.confirmModalText}>
                    Masukkan alasan penolakan berkas untuk <span className={styles.highlightText}>{confirmPopup.student.full_name}</span>:
                  </p>
                  <textarea
                    rows="3"
                    className={styles.modalTextarea}
                    placeholder="Contoh: Kartu Keluarga tidak terbaca jelas atau file rusak."
                    value={confirmPopup.reason}
                    onChange={(e) => setConfirmPopup({ ...confirmPopup, reason: e.target.value })}
                    required
                  />
                  <div className={styles.btnRow}>
                    <Button type="button" onClick={() => setConfirmPopup({ ...confirmPopup, isOpen: false })} variant="outline" className={styles.flex1Btn}>Batal</Button>
                    <Button type="submit" variant="danger" className={styles.flex1Btn}>Kirim Penolakan</Button>
                  </div>
                </form>
              )}

              {confirmPopup.type === 'approve' && (
                <div className={styles.confirmModalContent}>
                  <p className={styles.confirmModalText}>
                    Apakah Anda yakin ingin menyetujui berkas pendaftaran atas nama <span className={styles.highlightText}>{confirmPopup.student.full_name}</span> dan memindahkannya ke antrean kelulusan?
                  </p>
                  <div className={styles.btnRow}>
                    <Button onClick={() => setConfirmPopup({ ...confirmPopup, isOpen: false })} variant="outline" className={styles.flex1Btn}>Batal</Button>
                    <Button onClick={() => {
                      router.post(`/admin/verifikasi-berkas/${confirmPopup.student.id}/aksi`, { action: 'approve' });
                      setConfirmPopup({ ...confirmPopup, isOpen: false });
                    }} variant="success" className={styles.flex1Btn}>Setujui & Verifikasi</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Popup>
      </main>
      <Footer />
    </>
  );
}
