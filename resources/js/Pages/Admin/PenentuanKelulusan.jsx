import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import Popup from '../../Components/Popup/Popup';
import Button from '../../Components/Button/Button';
import styles from './AdminDashboard.module.css'; // Re-use styles
import formStyles from '../Student/Auth/Formulir.module.css'; // Re-use sections

export default function PenentuanKelulusan({ applicants = [], quotas = [], years = [], filters = {} }) {
  const { flash } = usePage().props;
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Premium action confirmation states
  const [confirmPopup, setConfirmPopup] = useState({
    isOpen: false,
    student: null,
    type: '' // 'delete', 'accept', 'reject', 'undo', 'undo_verif'
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
    if (actionType === 'delete' || actionType === 'accept' || actionType === 'reject' || actionType === 'undo' || actionType === 'undo_verif') {
      setConfirmPopup({
        isOpen: true,
        student,
        type: actionType
      });
      return;
    }

    router.post(`/admin/penentuan-kelulusan/${student.id}/aksi`, {
      action: actionType
    });
  };

  const handleAction = (actionType) => {
    if (actionType === 'delete') {
      setIsPopupOpen(false); // Close detail drawer first
      setConfirmPopup({
        isOpen: true,
        student: selectedStudent,
        type: 'delete'
      });
      return;
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
                      <td>{student.graduation_status}</td>
                      <td>
                        <div className={styles.actionBtnGrid}>
                          {student.graduation_status !== 'Diterima' && (
                            <button
                              className={`${styles.iconBtn} ${styles.iconBtnSuccess}`}
                              title="Nyatakan Diterima"
                              onClick={() => handleDirectAction(student, 'accept')}
                            >
                              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.59509 12L0 6.31185L1.39877 4.88981L5.59509 9.15592L14.6012 0L16 1.42204L5.59509 12Z" fill="white" />
                              </svg>
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
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.99999 14C5.04583 14 3.39062 13.3219 2.03437 11.9656C0.678124 10.6094 0 8.95417 0 7C0 5.04584 0.678124 3.39063 2.03437 2.03438C3.39062 0.678128 5.04583 3.01724e-06 6.99999 3.01724e-06C8.00624 3.01724e-06 8.96874 0.20767 9.88749 0.623003C10.8062 1.03834 11.5937 1.63275 12.25 2.40625V0.875003C12.25 0.627086 12.334 0.41942 12.502 0.252003C12.67 0.0845864 12.8777 0.00058635 13.125 3.01724e-06C13.3723 -0.000580316 13.5803 0.0834198 13.7489 0.252003C13.9174 0.420586 14.0012 0.628253 14 0.875003V5.25C14 5.49792 13.916 5.70588 13.748 5.87388C13.58 6.04188 13.3723 6.12559 13.125 6.125H8.74999C8.50208 6.125 8.29441 6.041 8.12699 5.873C7.95958 5.705 7.87558 5.49733 7.87499 5.25C7.87441 5.00267 7.95841 4.795 8.12699 4.627C8.29558 4.459 8.50324 4.375 8.74999 4.375H11.55C11.0833 3.55834 10.4454 2.91667 9.63637 2.45C8.82728 1.98334 7.94849 1.75 6.99999 1.75C5.54166 1.75 4.30208 2.26042 3.28125 3.28125C2.26041 4.30209 1.75 5.54167 1.75 7C1.75 8.45833 2.26041 9.69792 3.28125 10.7188C4.30208 11.7396 5.54166 12.25 6.99999 12.25C7.99166 12.25 8.89962 11.9986 9.72387 11.4958C10.5481 10.9929 11.186 10.3183 11.6375 9.47188C11.7542 9.26771 11.9184 9.12567 12.1301 9.04575C12.3419 8.96584 12.5568 8.96204 12.775 9.03438C13.0083 9.10729 13.176 9.26042 13.2781 9.49375C13.3802 9.72709 13.3729 9.94584 13.2562 10.15C12.6583 11.3167 11.8052 12.25 10.6969 12.95C9.58853 13.65 8.35624 14 6.99999 14Z" fill="white" />
                              </svg>
                            </button>
                          )}
                          <button
                            className={`${styles.iconBtn} ${styles.iconBtnInfo}`}
                            title="Kembalikan ke Verifikasi Berkas"
                            onClick={() => handleDirectAction(student, 'undo_verif')}
                          >
                            <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6.41667 0.75L10.0833 4.41667V12.0833C10.0833 12.45 9.78333 12.75 9.41667 12.75H1.41667C1.05 12.75 0.75 12.45 0.75 12.0833V1.41667C0.75 1.05 1.05 0.75 1.41667 0.75H6.41667Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M6.75 1.0835V4.0835H9.75L6.75 1.0835Z" fill="white" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </button>
                          <button
                            className={`${styles.iconBtn} ${styles.iconBtnWarning}`}
                            title="Hapus Pendaftaran"
                            onClick={() => handleDirectAction(student, 'delete')}
                          >
                            <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0.75 3.55H13.75M12.3056 3.55V13.35C12.3056 13.7213 12.1534 14.0774 11.8825 14.3399C11.6116 14.6025 11.2442 14.75 10.8611 14.75H3.63889C3.2558 14.75 2.8884 14.6025 2.61751 14.3399C2.34663 14.0774 2.19444 13.7213 2.19444 13.35V3.55M3.63889 3.55L5.08333 0.75H9.41667L10.8611 3.55" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
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
            <div style={{ maxHeight: '75vh', overflowY: 'auto', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px', fontWeight: '400' }}>
              <div style={{ borderBottom: '1px solid #EDF2F7', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '400', color: 'var(--color-primary-dark)', margin: 0 }}>
                  Aksi Penentuan Kelulusan
                </h2>
              </div>

              {/* Status Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '4px', fontWeight: '400' }}>
                <span style={{ fontSize: '12px', fontWeight: '400', color: '#718096' }}>STATUS SELEKSI AKHIR:</span>
                <span className={`${styles.badge} ${selectedStudent.graduation_status === 'Diterima' ? styles.badgeSuccess :
                  selectedStudent.graduation_status === 'Tidak Lulus' ? styles.badgeDanger :
                    styles.badgeSecondary
                  }`} style={{ fontWeight: '400' }}>{selectedStudent.graduation_status}</span>
              </div>

              {/* Details table */}
              <div className={formStyles.section} style={{ fontWeight: '400' }}>
                <h4 className={formStyles.sectionTitle} style={{ fontSize: '12px', fontWeight: '400' }}>Rangkuman Profil Calon Siswa</h4>
                <table className={styles.detailsTable} style={{ fontSize: '12px', fontWeight: '400' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '110px', fontWeight: '400' }}>No Registrasi</td>
                      <td style={{ width: '10px' }}>:</td>
                      <td style={{ fontWeight: '400' }}>{selectedStudent.registration_number}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: '400' }}>Nama Lengkap</td>
                      <td>:</td>
                      <td style={{ fontWeight: '400' }}>{selectedStudent.full_name}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: '400' }}>NISN</td>
                      <td>:</td>
                      <td style={{ fontWeight: '400' }}>{selectedStudent.nisn}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: '400' }}>Sekolah Asal</td>
                      <td>:</td>
                      <td style={{ fontWeight: '400' }}>{selectedStudent.school_origin}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: '400' }}>Jalur Pendaftaran</td>
                      <td>:</td>
                      <td style={{ fontWeight: '400' }}>{selectedStudent.quota?.name}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div style={{ borderTop: '1px solid #EDF2F7', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontWeight: '400' }}>
                {selectedStudent.graduation_status !== 'Diterima' && (
                  <Button
                    onClick={() => handleAction('accept')}
                    variant="success"
                    style={{ width: '100%', fontWeight: '400' }}
                  >
                    Nyatakan DITERIMA (Lulus Seleksi)
                  </Button>
                )}

                {selectedStudent.graduation_status !== 'Tidak Lulus' && (
                  <Button
                    onClick={() => handleAction('reject')}
                    variant="secondary"
                    style={{ width: '100%', backgroundColor: '#D69E2E', border: 'none', color: 'white', fontWeight: '400' }}
                  >
                    Nyatakan TIDAK LULUS Seleksi
                  </Button>
                )}

                {selectedStudent.graduation_status !== 'Menunggu Kelulusan' && (
                  <Button
                    onClick={() => handleAction('undo')}
                    variant="outline"
                    style={{ width: '100%', fontWeight: '400' }}
                  >
                    Kembalikan Status Ke Menunggu Kelulusan
                  </Button>
                )}

                <Button
                  onClick={() => handleAction('delete')}
                  variant="danger"
                  style={{ width: '100%', fontWeight: '400' }}
                >
                  Hapus Pendaftaran Calon Siswa
                </Button>
              </div>
            </div>
          )}
        </Popup>

        {/* Action Confirmation Popup */}
        <Popup isOpen={confirmPopup.isOpen} onClose={() => setConfirmPopup({ ...confirmPopup, isOpen: false })}>
          {confirmPopup.student && (
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '15px', fontWeight: '400' }}>
              <div style={{ borderBottom: '1px solid #EDF2F7', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '400', color: 'var(--color-primary-dark)', margin: 0 }}>
                  {confirmPopup.type === 'delete' && 'Konfirmasi Hapus Pendaftaran'}
                  {confirmPopup.type === 'accept' && 'Konfirmasi Kelulusan'}
                  {confirmPopup.type === 'reject' && 'Konfirmasi Tidak Lulus'}
                  {confirmPopup.type === 'undo' && 'Batal Status Kelulusan'}
                  {confirmPopup.type === 'undo_verif' && 'Kembalikan ke Verifikasi'}
                </h2>
              </div>

              {confirmPopup.type === 'delete' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontWeight: '400' }}>
                  <p style={{ fontSize: '13px', color: '#4A5568', margin: 0, lineHeight: '1.5', fontWeight: '400' }}>
                    Apakah Anda yakin ingin menghapus data pendaftaran <span style={{ color: 'var(--color-primary-dark)' }}>{confirmPopup.student.full_name}</span> secara permanen? Akun portal siswa juga akan ikut terhapus.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <Button onClick={() => setConfirmPopup({ ...confirmPopup, isOpen: false })} variant="outline" style={{ flex: 1, fontWeight: '400' }}>Batal</Button>
                    <Button onClick={() => {
                      router.post(`/admin/penentuan-kelulusan/${confirmPopup.student.id}/aksi`, { action: 'delete' });
                      setConfirmPopup({ ...confirmPopup, isOpen: false });
                    }} variant="danger" style={{ flex: 1, fontWeight: '400' }}>Hapus Permanen</Button>
                  </div>
                </div>
              )}

              {confirmPopup.type === 'accept' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontWeight: '400' }}>
                  <p style={{ fontSize: '13px', color: '#4A5568', margin: 0, lineHeight: '1.5', fontWeight: '400' }}>
                    Apakah Anda yakin ingin menyatakan <span style={{ color: 'var(--color-primary-dark)' }}>{confirmPopup.student.full_name}</span> secara resmi <strong>DITERIMA</strong> sebagai siswa baru?
                  </p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <Button onClick={() => setConfirmPopup({ ...confirmPopup, isOpen: false })} variant="outline" style={{ flex: 1, fontWeight: '400' }}>Batal</Button>
                    <Button onClick={() => {
                      router.post(`/admin/penentuan-kelulusan/${confirmPopup.student.id}/aksi`, { action: 'accept' });
                      setConfirmPopup({ ...confirmPopup, isOpen: false });
                    }} variant="success" style={{ flex: 1, fontWeight: '400' }}>Nyatakan Diterima</Button>
                  </div>
                </div>
              )}

              {confirmPopup.type === 'reject' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontWeight: '400' }}>
                  <p style={{ fontSize: '13px', color: '#4A5568', margin: 0, lineHeight: '1.5', fontWeight: '400' }}>
                    Apakah Anda yakin ingin menyatakan <span style={{ color: 'var(--color-primary-dark)' }}>{confirmPopup.student.full_name}</span> secara resmi <strong>TIDAK LULUS</strong> seleksi?
                  </p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <Button onClick={() => setConfirmPopup({ ...confirmPopup, isOpen: false })} variant="outline" style={{ flex: 1, fontWeight: '400' }}>Batal</Button>
                    <Button onClick={() => {
                      router.post(`/admin/penentuan-kelulusan/${confirmPopup.student.id}/aksi`, { action: 'reject' });
                      setConfirmPopup({ ...confirmPopup, isOpen: false });
                    }} variant="secondary" style={{ flex: 1, backgroundColor: '#FF0200', border: 'none', color: 'white', fontWeight: '400' }}>Nyatakan Tidak Lulus</Button>
                  </div>
                </div>
              )}

              {confirmPopup.type === 'undo' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontWeight: '400' }}>
                  <p style={{ fontSize: '13px', color: '#4A5568', margin: 0, lineHeight: '1.5', fontWeight: '400' }}>
                    Apakah Anda yakin ingin membatalkan status kelulusan <span style={{ color: 'var(--color-primary-dark)' }}>{confirmPopup.student.full_name}</span> dan mengembalikannya ke status <strong>Menunggu Kelulusan</strong>?
                  </p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <Button onClick={() => setConfirmPopup({ ...confirmPopup, isOpen: false })} variant="outline" style={{ flex: 1, fontWeight: '400' }}>Batal</Button>
                    <Button onClick={() => {
                      router.post(`/admin/penentuan-kelulusan/${confirmPopup.student.id}/aksi`, { action: 'undo' });
                      setConfirmPopup({ ...confirmPopup, isOpen: false });
                    }} variant="primary" style={{ flex: 1, fontWeight: '400' }}>Batalkan Status</Button>
                  </div>
                </div>
              )}

              {confirmPopup.type === 'undo_verif' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontWeight: '400' }}>
                  <p style={{ fontSize: '13px', color: '#4A5568', margin: 0, lineHeight: '1.5', fontWeight: '400' }}>
                    Apakah Anda yakin ingin mengembalikan data pendaftaran <span style={{ color: 'var(--color-primary-dark)' }}>{confirmPopup.student.full_name}</span> kembali ke antrean <strong>Verifikasi Berkas</strong>?
                  </p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <Button onClick={() => setConfirmPopup({ ...confirmPopup, isOpen: false })} variant="outline" style={{ flex: 1, fontWeight: '400' }}>Batal</Button>
                    <Button onClick={() => {
                      router.post(`/admin/penentuan-kelulusan/${confirmPopup.student.id}/aksi`, { action: 'undo_verif' });
                      setConfirmPopup({ ...confirmPopup, isOpen: false });
                    }} variant="primary" style={{ flex: 1, fontWeight: '400' }}>Kembalikan ke Verifikasi</Button>
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
