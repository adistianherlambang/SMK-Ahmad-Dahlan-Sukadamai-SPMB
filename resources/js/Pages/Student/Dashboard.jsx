import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import Button from '../../Components/Button/Button';
import Footer from '../../Components/Footer/Footer';
import styles from './Dashboard.module.css';
import Batik from '../../Components/Batik/Batik';

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

  const date = new Date
  const year = date.getFullYear()

  return (
    <>
      <Head title="Dasbor Siswa - SPMB SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Dasbor Calon Siswa</h1>
          <p>Selamat datang kembali, <strong>{registration.full_name}!</strong></p>
        </div>
      </header>

      <main className={styles.container}>
        {/* Status Card Grid */}
        <section className={styles.statusSection}>
          <h2>Status Kelulusan</h2>
        </section>

        {/* Dynamic Alerts based on States */}
        <section className={styles.alertSection}>
          {registration.verification_status === 'Berkas Ditolak' && (
            <div>
              <div className={`${styles.alertBox} ${styles.alertDanger}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.14342 8.5715C7.93239 8.5715 8.57199 7.93191 8.57199 7.14293C8.57199 6.35395 7.93239 5.71436 7.14342 5.71436C6.35444 5.71436 5.71484 6.35395 5.71484 7.14293C5.71484 7.93191 6.35444 8.5715 7.14342 8.5715Z" fill="white" />
                  <path d="M12.8563 8.5715C13.6453 8.5715 14.2849 7.93191 14.2849 7.14293C14.2849 6.35395 13.6453 5.71436 12.8563 5.71436C12.0673 5.71436 11.4277 6.35395 11.4277 7.14293C11.4277 7.93191 12.0673 8.5715 12.8563 8.5715Z" fill="white" />
                  <path d="M10 20C4.48571 20 0 15.5143 0 10C0 4.48571 4.48571 0 10 0C15.5143 0 20 4.48571 20 10C20 15.5143 15.5143 20 10 20ZM10 1.42857C5.27143 1.42857 1.42857 5.27143 1.42857 10C1.42857 14.7286 5.27143 18.5714 10 18.5714C14.7286 18.5714 18.5714 14.7286 18.5714 10C18.5714 5.27143 14.7286 1.42857 10 1.42857Z" fill="white" />
                  <path d="M14.0428 15.0001C13.7428 15.0001 13.4713 14.8144 13.3713 14.5286C13.1256 13.8307 12.6693 13.2262 12.0654 12.7986C11.4616 12.371 10.7398 12.1414 9.9999 12.1414C9.25996 12.1414 8.53826 12.371 7.93438 12.7986C7.33049 13.2262 6.87421 13.8307 6.62847 14.5286C6.4999 14.9001 6.08562 15.1001 5.71419 14.9572C5.62523 14.9264 5.54335 14.8781 5.47338 14.8151C5.40341 14.7522 5.34677 14.6758 5.30682 14.5906C5.26686 14.5053 5.2444 14.413 5.24076 14.3189C5.23712 14.2248 5.25237 14.131 5.28562 14.0429C5.98562 12.0429 7.88562 10.7144 9.9999 10.7144C12.1142 10.7144 14.0142 12.0572 14.7142 14.0429C14.7532 14.1508 14.7656 14.2664 14.7505 14.3801C14.7354 14.4938 14.6931 14.6021 14.6272 14.696C14.5614 14.7899 14.4739 14.8665 14.3721 14.9194C14.2704 14.9724 14.1574 15 14.0428 15.0001Z" fill="white" />
                </svg>
                <div>
                  <h2>Berkas Pendaftaran Ditolak</h2>
                  <p>Terdapat data atau berkas yang belum sesuai, silakan lakukan perbaikan.</p>
                </div>
                <i>Pesan: "{registration.rejection_reason}"</i>
              </div>
              <div className={styles.batik}>
                <Batik section="atas" color="#FF0200" />
                <Batik section="bawah" color="#FF0200" />
              </div>
              <div className={styles.dashboardActionContainer}>
                <Button href="/dashboard/siswa/data-pendaftaran" variant="danger" className={styles.btnFullWidth}>
                  Upload Berkas Persyaratan
                </Button>
              </div>
            </div>
          )}

          {registration.verification_status === 'Menunggu Verifikasi' && (
            <div>
              <div className={`${styles.alertBox} ${styles.alertInfo} ${styles.alertInfoYellow}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0ZM10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2ZM10 4C10.2449 4.00003 10.4813 4.08996 10.6644 4.25272C10.8474 4.41547 10.9643 4.63975 10.993 4.883L11 5V9.586L13.707 12.293C13.8863 12.473 13.9905 12.7144 13.9982 12.9684C14.006 13.2223 13.9168 13.4697 13.7488 13.6603C13.5807 13.8508 13.3464 13.9703 13.0935 13.9944C12.8406 14.0185 12.588 13.9454 12.387 13.79L12.293 13.707L9.293 10.707C9.13758 10.5514 9.03776 10.349 9.009 10.131L9 10V5C9 4.73478 9.10536 4.48043 9.29289 4.29289C9.48043 4.10536 9.73478 4 10 4Z" fill="#1F1B18" />
                </svg>
                <h2>Menunggu Verifikasi Berkas</h2>
                <p>Data dan berkas pendaftaran Anda sedang diperiksa oleh panitia.</p>
              </div>
              <div className={styles.batik}>
                <Batik section="atas" color="#FDCD2D" />
                <Batik section="bawah" color="#FDCD2D" />
              </div>
              <div className={styles.dashboardActionContainer}>
                <Button
                  href="/dashboard/siswa/unduh-bukti"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  className={styles.btnFullWidth}
                >
                  Cetak Bukti Pendaftaran
                </Button>
              </div>
            </div>
          )}

          {registration.verification_status === 'Terverifikasi' && registration.graduation_status === 'Menunggu Kelulusan' && (
            <div>
              <div className={`${styles.alertBox} ${styles.alertInfo} ${styles.alertInfoYellow}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0ZM10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2ZM10 4C10.2449 4.00003 10.4813 4.08996 10.6644 4.25272C10.8474 4.41547 10.9643 4.63975 10.993 4.883L11 5V9.586L13.707 12.293C13.8863 12.473 13.9905 12.7144 13.9982 12.9684C14.006 13.2223 13.9168 13.4697 13.7488 13.6603C13.5807 13.8508 13.3464 13.9703 13.0935 13.9944C12.8406 14.0185 12.588 13.9454 12.387 13.79L12.293 13.707L9.293 10.707C9.13758 10.5514 9.03776 10.349 9.009 10.131L9 10V5C9 4.73478 9.10536 4.48043 9.29289 4.29289C9.48043 4.10536 9.73478 4 10 4Z" fill="#1F1B18" />
                </svg>
                <div>
                  <h2>Berkas Terverifikasi</h2>
                  <p>Hasil kelulusan belum diumumkan, silakan pantau informasi secara berkala.</p>
                </div>
              </div>
              <div className={styles.batik}>
                <Batik section="atas" color="#FDCD2D" />
                <Batik section="bawah" color="#FDCD2D" />
              </div>
            </div>
          )}

          {registration.graduation_status === 'Diterima' && (
            <div>
              <div className={`${styles.alertBox} ${styles.alertInfo} ${styles.alertGraduated}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M10 17.8571C12.0838 17.8571 14.0823 17.0293 15.5558 15.5558C17.0293 14.0823 17.8571 12.0838 17.8571 10C17.8571 7.91616 17.0293 5.91766 15.5558 4.44416C14.0823 2.97066 12.0838 2.14286 10 2.14286C7.91616 2.14286 5.91766 2.97066 4.44416 4.44416C2.97066 5.91766 2.14286 7.91616 2.14286 10C2.14286 12.0838 2.97066 14.0823 4.44416 15.5558C5.91766 17.0293 7.91616 17.8571 10 17.8571ZM10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10C20 7.34784 18.9464 4.8043 17.0711 2.92893C15.1957 1.05357 12.6522 0 10 0C7.34784 0 4.8043 1.05357 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 12.6522 1.05357 15.1957 2.92893 17.0711C4.8043 18.9464 7.34784 20 10 20ZM5.35714 11.7857C5.35714 11.5016 5.47003 11.229 5.67096 11.0281C5.87189 10.8272 6.14441 10.7143 6.42857 10.7143H13.5714C13.8556 10.7143 14.1281 10.8272 14.329 11.0281C14.53 11.229 14.6429 11.5016 14.6429 11.7857C14.6429 12.7657 14.0286 13.67 13.2514 14.28C12.4371 14.9186 11.3114 15.3571 10 15.3571C8.68857 15.3571 7.56286 14.9186 6.74857 14.28C5.97286 13.67 5.35714 12.7657 5.35714 11.7857ZM12.8571 9.28571C12.573 9.28571 12.3005 9.17283 12.0995 8.9719C11.8986 8.77097 11.7857 8.49845 11.7857 8.21429V6.78571C11.7857 6.50155 11.8986 6.22903 12.0995 6.0281C12.3005 5.82717 12.573 5.71429 12.8571 5.71429C13.1413 5.71429 13.4138 5.82717 13.6148 6.0281C13.8157 6.22903 13.9286 6.50155 13.9286 6.78571V8.21429C13.9286 8.49845 13.8157 8.77097 13.6148 8.9719C13.4138 9.17283 13.1413 9.28571 12.8571 9.28571ZM6.07143 8.21429C6.07143 8.49845 6.18431 8.77097 6.38524 8.9719C6.58617 9.17283 6.8587 9.28571 7.14286 9.28571C7.42702 9.28571 7.69954 9.17283 7.90047 8.9719C8.1014 8.77097 8.21429 8.49845 8.21429 8.21429V6.78571C8.21429 6.50155 8.1014 6.22903 7.90047 6.0281C7.69954 5.82717 7.42702 5.71429 7.14286 5.71429C6.8587 5.71429 6.58617 5.82717 6.38524 6.0281C6.18431 6.22903 6.07143 6.50155 6.07143 6.78571V8.21429Z" fill="white" />
                </svg>
                <div>
                  <h2>Selamat, Anda Lulus Seleksi!</h2>
                  <p>Berdasarkan hasil rapat pleno panitia penerimaan siswa baru, Anda secara resmi dinyatakan <b>DITERIMA</b> sebagai siswa baru di SMK Ahmad Dahlan Sukadamai Tahun Pelajaran {year}/{year + 1}</p>
                </div>
              </div>
              <div className={styles.batik}>
                <Batik section="atas" color="#18C927" />
                <Batik section="bawah" color="#18C927" />
              </div>
              <div className={styles.dashboardActionContainer}>
                <Button
                  href="/dashboard/siswa/unduh-bukti"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="success"
                  className={styles.btnFullWidth}
                >
                  Cetak Bukti Penerimaan
                </Button>
              </div>
            </div>
          )}

          {registration.graduation_status === 'Tidak Lulus' && (
            <div>
              <div className={`${styles.alertBox} ${styles.alertInfo} ${styles.alertDanger}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.14244 8.5715C7.93142 8.5715 8.57101 7.93191 8.57101 7.14293C8.57101 6.35395 7.93142 5.71436 7.14244 5.71436C6.35346 5.71436 5.71387 6.35395 5.71387 7.14293C5.71387 7.93191 6.35346 8.5715 7.14244 8.5715Z" fill="white" />
                  <path d="M12.8573 8.5715C13.6463 8.5715 14.2859 7.93191 14.2859 7.14293C14.2859 6.35395 13.6463 5.71436 12.8573 5.71436C12.0683 5.71436 11.4287 6.35395 11.4287 7.14293C11.4287 7.93191 12.0683 8.5715 12.8573 8.5715Z" fill="white" />
                  <path d="M10 20C4.48571 20 0 15.5143 0 10C0 4.48571 4.48571 0 10 0C15.5143 0 20 4.48571 20 10C20 15.5143 15.5143 20 10 20ZM10 1.42857C5.27143 1.42857 1.42857 5.27143 1.42857 10C1.42857 14.7286 5.27143 18.5714 10 18.5714C14.7286 18.5714 18.5714 14.7286 18.5714 10C18.5714 5.27143 14.7286 1.42857 10 1.42857Z" fill="white" />
                  <path d="M14.0428 15.0001C13.7428 15.0001 13.4713 14.8144 13.3713 14.5286C13.1256 13.8307 12.6693 13.2262 12.0654 12.7986C11.4616 12.371 10.7398 12.1414 9.9999 12.1414C9.25996 12.1414 8.53826 12.371 7.93438 12.7986C7.33049 13.2262 6.87421 13.8307 6.62847 14.5286C6.4999 14.9001 6.08562 15.1001 5.71419 14.9572C5.62523 14.9264 5.54335 14.8781 5.47338 14.8151C5.40341 14.7522 5.34677 14.6758 5.30682 14.5906C5.26686 14.5053 5.2444 14.413 5.24076 14.3189C5.23712 14.2248 5.25237 14.131 5.28562 14.0429C5.98562 12.0429 7.88562 10.7144 9.9999 10.7144C12.1142 10.7144 14.0142 12.0572 14.7142 14.0429C14.7532 14.1508 14.7656 14.2664 14.7505 14.3801C14.7354 14.4938 14.6931 14.6021 14.6272 14.696C14.5614 14.7899 14.4739 14.8665 14.3721 14.9194C14.2704 14.9724 14.1574 15 14.0428 15.0001Z" fill="white" />
                </svg>
                <div>
                  <h2>Dinyatakan Tidak Lulus</h2>
                  <p>Mohon maaf, berdasarkan hasil keputusan panitia seleksi penerimaan siswa baru, Anda dinyatakan <b>Tidak Lulus</b> seleksi masuk SMK Ahmad Dahlan Sukadamai gelombang ini.</p>
                </div>
              </div>
              <div className={styles.batik}>
                <Batik section="atas" color="#FF0200" />
                <Batik section="bawah" color="#FF0200" />
              </div>
            </div>
          )}
        </section>

        {/* Quick Details Card */}
        <section className={styles.detailsSection}>
          <h2>Rincian Singkat Akun</h2>
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

      <Footer />
    </>
  );
}
