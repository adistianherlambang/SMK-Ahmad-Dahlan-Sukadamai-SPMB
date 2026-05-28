import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import styles from './Dashboard.module.css';

export default function Dashboard({ registration = {} }) {
  const links = [
    { url: '/dashboard/siswa', label: 'Dasbor Saya' },
    { url: '/dashboard/siswa/data-pendaftaran', label: 'Data Pendaftaran' },
    { url: '/logout', label: 'Keluar', method: 'post' }
  ];

  const getVerificationClass = (status) => {
    if (status === 'Terverifikasi') return styles.badgeSuccess;
    if (status === 'Berkas Ditolak') return styles.badgeDanger;
    return styles.badgeWarning;
  };

  const getGraduationClass = (status) => {
    if (status === 'Diterima') return styles.badgeSuccess;
    if (status === 'Tidak Lulus') return styles.badgeDanger;
    return styles.badgeWarning;
  };

  return (
    <>
      <Head title="Dasbor Siswa - SPMB SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Dasbor Calon Siswa</h1>
          <p>Selamat datang kembali, <strong>{registration.full_name}</strong></p>
        </div>
      </header>

      <main className={styles.container}>
        {/* Status Card Grid */}
        <section className={styles.statusSection}>
          <h2>Status Pendaftaran Anda</h2>
          <div className={styles.statusGrid}>
            <div className={styles.statusCard}>
              <span className={styles.cardTitle}>Verifikasi Berkas</span>
              <div className={`${styles.badge} ${getVerificationClass(registration.verification_status)}`}>
                {registration.verification_status}
              </div>
            </div>
            <div className={styles.statusCard}>
              <span className={styles.cardTitle}>Hasil Seleksi</span>
              <div className={`${styles.badge} ${getGraduationClass(registration.graduation_status)}`}>
                {registration.graduation_status}
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Alerts based on States */}
        <section className={styles.alertSection}>
          {registration.verification_status === 'Berkas Ditolak' && (
            <div className={`${styles.alertBox} ${styles.alertDanger}`}>
              <h3>⚠️ Berkas Pendaftaran Ditolak</h3>
              <p>Mohon maaf, berkas persyaratan yang Anda unggah ditolak oleh panitia dengan alasan:</p>
              <div className={styles.rejectionReason}>
                "{registration.rejection_reason}"
              </div>
              <p style={{ marginTop: '12px' }}>Silakan perbaiki dokumen Anda dan lakukan kirim ulang berkas yang valid sekarang.</p>
              <Link href="/dashboard/siswa/data-pendaftaran" className={styles.alertBtnDanger}>
                Ubah & Kirim Berkas
              </Link>
            </div>
          )}

          {registration.verification_status === 'Menunggu Verifikasi' && (
            <div className={`${styles.alertBox} ${styles.alertInfo}`}>
              <h3>⏳ Menunggu Verifikasi Berkas</h3>
              <p>Berkas pendaftaran Anda telah berhasil terunggah dan saat ini sedang berada dalam antrean peninjauan oleh panitia SPMB SMK Ahmad Dahlan Sukadamai.</p>
              <p style={{ marginTop: '8px' }}>Mohon lakukan pemeriksaan berkala pada halaman dasbor ini untuk melihat perkembangan status verifikasi Anda.</p>
            </div>
          )}

          {registration.verification_status === 'Terverifikasi' && registration.graduation_status === 'Menunggu Kelulusan' && (
            <div className={`${styles.alertBox} ${styles.alertSuccess}`}>
              <h3>✓ Berkas Terverifikasi</h3>
              <p>Selamat! Berkas persyaratan fisik & digital Anda telah dinyatakan <strong>Lengkap & Terverifikasi</strong> oleh panitia.</p>
              <p style={{ marginTop: '8px' }}>Tahap selanjutnya adalah menunggu pengumuman hasil kelulusan seleksi penerimaan siswa baru sesuai tanggal agenda yang ditentukan.</p>
            </div>
          )}

          {registration.graduation_status === 'Diterima' && (
            <div className={`${styles.alertBox} ${styles.alertGraduated}`}>
              <div style={{ fontSize: '32px' }}>🎉</div>
              <h3>Selamat, Anda Lulus Seleksi!</h3>
              <p>Berdasarkan hasil rapat pleno panitia penerimaan siswa baru, Anda secara resmi dinyatakan <strong>DITERIMA</strong> sebagai siswa baru di SMK Ahmad Dahlan Sukadamai Tahun Pelajaran 2026/2027.</p>
              <p style={{ marginTop: '12px', fontSize: '12px', opacity: 0.9 }}>Silakan cetak bukti kelulusan pendaftaran resmi Anda untuk ditunjukkan saat melakukan proses daftar ulang fisik di sekolah:</p>
              <a 
                href="/dashboard/siswa/unduh-bukti" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.alertBtnGraduated}
              >
                📥 Cetak Bukti Pendaftaran
              </a>
            </div>
          )}

          {registration.graduation_status === 'Tidak Lulus' && (
            <div className={`${styles.alertBox} ${styles.alertDanger}`}>
              <h3>😞 Dinyatakan Tidak Lulus</h3>
              <p>Mohon maaf, berdasarkan hasil keputusan panitia seleksi penerimaan siswa baru, Anda dinyatakan <strong>Tidak Lulus</strong> seleksi masuk SMK Ahmad Dahlan Sukadamai gelombang ini.</p>
              <p style={{ marginTop: '8px' }}>Kami sangat mengapresiasi minat dan perjuangan yang telah Anda tunjukkan. Tetap semangat dan jangan berputus asa dalam menuntut ilmu di tempat lainnya.</p>
            </div>
          )}
        </section>

        {/* Quick Details Card */}
        <section className={styles.detailsSection}>
          <h3>Rincian Singkat Akun</h3>
          <table className={styles.detailsTable}>
            <tbody>
              <tr>
                <td>No Registrasi</td>
                <td>:</td>
                <td><strong>{registration.registration_number}</strong></td>
              </tr>
              <tr>
                <td>NISN</td>
                <td>:</td>
                <td>{registration.nisn}</td>
              </tr>
              <tr>
                <td>Jalur Masuk</td>
                <td>:</td>
                <td>{registration.quota?.name}</td>
              </tr>
              <tr>
                <td>Sekolah Asal</td>
                <td>:</td>
                <td>{registration.school_origin}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2026 SMK Ahmad Dahlan Sukadamai. All Rights Reserved.</p>
      </footer>
    </>
  );
}
