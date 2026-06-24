import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import FileInput from '../../Components/FileInput/FileInput';
import Button from '../../Components/Button/Button';
import Footer from '../../Components/Footer/Footer';
import styles from './Dashboard.module.css'; // Re-use general layouts
import formStyles from '../Student/Auth/Formulir.module.css'; // Re-use form sections styling

export default function DataPendaftaran({ registration = {} }) {
  const { flash } = usePage().props;

  const { data, setData, post, processing, errors } = useForm({
    file_kk: null,
    file_akta: null,
    file_skhu_skl: null,
    file_sktm: null,
  });

  const links = [
    { url: '/dashboard/siswa', label: 'Dasbor Saya' },
    { url: '/dashboard/siswa/data-pendaftaran', label: 'Data Pendaftaran' },
    { url: '/logout', label: 'Keluar', method: 'post' }
  ];

  const handleReuploadSubmit = (e) => {
    e.preventDefault();
    post('/dashboard/siswa/kirim-ulang-berkas');
  };

  const handleFileChange = (field, file) => {
    setData(field, file);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <>
      <Head title="Data Pendaftaran Saya - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Data Pendaftaran Saya</h1>
          <p>Tinjau rincian lengkap berkas formulir pendaftaran Anda.</p>
        </div>
      </header>

      <main className={styles.container}>
        {/* Flash Notifications */}
        {flash?.success && (
          <div className={`${styles.alertBox} ${styles.alertSuccess} ${styles.flashAlert}`}>
            {flash.success}
          </div>
        )}
        {flash?.error && (
          <div className={`${styles.alertBox} ${styles.alertDanger} ${styles.flashAlert}`}>
            {flash.error}
          </div>
        )}

        {/* Reupload Section: active ONLY when rejected */}
        {registration.verification_status === 'Berkas Ditolak' && (
          <section className={`${formStyles.formCard}`}>
            <h3 className={styles.reuploadTitle}>
              Upload berkas persyaratan
            </h3>
            <p className={styles.reuploadDesc}>
              Silakan pilih dokumen baru berformat PDF (Maks 2MB) untuk menggantikan berkas yang ditolak oleh panitia. Kosongkan berkas yang tidak ingin diubah.
            </p>

            <form onSubmit={handleReuploadSubmit} className={formStyles.form}>
              <div className={styles.inputRow}>
                <div className={styles.inputWrapper}>
                  <FileInput
                    label="Kartu Keluarga (KK)"
                    isUploaded={!!data.file_kk}
                    onFileView={() => window.open(URL.createObjectURL(data.file_kk))}
                    onChange={(e) => handleFileChange('file_kk', e.target.files[0])}
                  />
                  {errors.file_kk && <div className={styles.fieldError}>{errors.file_kk}</div>}
                </div>
                <div className={styles.inputWrapper}>
                  <FileInput
                    label="Kelahiran"
                    isUploaded={!!data.file_akta}
                    onFileView={() => window.open(URL.createObjectURL(data.file_akta))}
                    onChange={(e) => handleFileChange('file_akta', e.target.files[0])}
                  />
                  {errors.file_akta && <div className={styles.fieldError}>{errors.file_akta}</div>}
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputWrapper}>
                  <FileInput
                    label="SKHU / SKL"
                    isUploaded={!!data.file_skhu_skl}
                    onFileView={() => window.open(URL.createObjectURL(data.file_skhu_skl))}
                    onChange={(e) => handleFileChange('file_skhu_skl', e.target.files[0])}
                  />
                  {errors.file_skhu_skl && <div className={styles.fieldError}>{errors.file_skhu_skl}</div>}
                </div>
                <div className={styles.inputWrapper}>
                  <FileInput
                    label="SKTM / KIP / PKH (Opsional)"
                    isUploaded={!!data.file_sktm}
                    onFileView={() => window.open(URL.createObjectURL(data.file_sktm))}
                    onChange={(e) => handleFileChange('file_sktm', e.target.files[0])}
                  />
                  {errors.file_sktm && <div className={styles.fieldError}>{errors.file_sktm}</div>}
                </div>
              </div>

              <Button type="submit" loading={processing} variant="danger" className={styles.btnFullWidth}>
                Kirim Ulang Berkas Persyaratan
              </Button>
            </form>
          </section>
        )}

        {/* Detailed Info Categories */}
        <div className={formStyles.formCard}>
          {/* Section A: Identitas */}
          <div className={`${formStyles.section} ${styles.sectionSpacer}`}>
            <h2 className={formStyles.sectionTitle}>Informasi Calon Peserta Didik</h2>
            <table className={styles.detailsTable}>
              <tbody>
                <tr>
                  <td>Pilihan Jurusan</td>
                  <td>:</td>
                  <td>{registration.jurusan ? registration.jurusan.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '-'}</td>
                </tr>
                <tr>
                  <td>NISN</td>
                  <td>:</td>
                  <td>{registration.nisn}</td>
                </tr>
                <tr>
                  <td>Nama Lengkap</td>
                  <td>:</td>
                  <td>{registration.full_name}</td>
                </tr>
                <tr>
                  <td>Jenis Kelamin</td>
                  <td>:</td>
                  <td>{registration.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                </tr>
                <tr>
                  <td>Tempat Lahir</td>
                  <td>:</td>
                  <td>{registration.birth_place}</td>
                </tr>
                <tr>
                  <td>Tanggal Lahir</td>
                  <td>:</td>
                  <td>{formatDate(registration.birth_date)}</td>
                </tr>
                <tr>
                  <td>Agama</td>
                  <td>:</td>
                  <td>{registration.religion}</td>
                </tr>
                <tr>
                  <td>Anak Ke-</td>
                  <td>:</td>
                  <td>{registration.child_order}</td>
                </tr>
                <tr>
                  <td>Status Keluarga</td>
                  <td>:</td>
                  <td>{registration.family_status}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section B: Orang Tua */}
          <div className={`${formStyles.section} ${styles.sectionSpacer}`}>
            <h2 className={formStyles.sectionTitle}>Keterangan Orang Tua / Wali</h2>
            <table className={styles.detailsTable}>
              <tbody>
                <tr>
                  <td>Nama Orang Tua</td>
                  <td>:</td>
                  <td>{registration.parent_name}</td>
                </tr>
                <tr>
                  <td>Pekerjaan</td>
                  <td>:</td>
                  <td>{registration.parent_occupation}</td>
                </tr>
                <tr>
                  <td>Hubungan</td>
                  <td>:</td>
                  <td>{registration.parent_status}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section C: Asal Sekolah */}
          <div className={`${formStyles.section} ${styles.sectionSpacer}`}>
            <h2 className={formStyles.sectionTitle}>Keterangan Sekolah Asal</h2>
            <table className={styles.detailsTable}>
              <tbody>
                <tr>
                  <td>Nama Sekolah</td>
                  <td>:</td>
                  <td>{registration.school_origin}</td>
                </tr>
                <tr>
                  <td>Alamat Sekolah</td>
                  <td>:</td>
                  <td>{registration.school_address}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section D: Kontak & Alamat */}
          <div className={`${formStyles.section} ${styles.sectionSpacer}`}>
            <h2 className={formStyles.sectionTitle}>Keterangan Alamat</h2>
            <table className={styles.detailsTable}>
              <tbody>
                <tr>
                  <td>Nomor Telp / WA</td>
                  <td>:</td>
                  <td>{registration.phone_number}</td>
                </tr>
                <tr>
                  <td>Alamat Domisili</td>
                  <td>:</td>
                  <td>{registration.address}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section E: Berkas Terunggah */}
          <div className={formStyles.section}>
            <h2 className={formStyles.sectionTitle}>Berkas Ter-Upload</h2>
            <div className={styles.fileList}>
              <div style={{ width: "100%", display: "flex", gap: "8px" }}>
                {registration.document?.file_kk && (
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <p>Kartu Keluarga</p>
                    <a href={registration.document.file_kk} target="_blank" rel="noopener noreferrer" className={styles.fileRow}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 5.7C7.50632 5.7 7.99191 5.88964 8.34993 6.22721C8.70796 6.56477 8.90909 7.02261 8.90909 7.5C8.90909 7.97739 8.70796 8.43523 8.34993 8.77279C7.99191 9.11036 7.50632 9.3 7 9.3C6.49368 9.3 6.00809 9.11036 5.65007 8.77279C5.29204 8.43523 5.09091 7.97739 5.09091 7.5C5.09091 7.02261 5.29204 6.56477 5.65007 6.22721C6.00809 5.88964 6.49368 5.7 7 5.7ZM7 3C10.1818 3 12.8991 4.866 14 7.5C12.8991 10.134 10.1818 12 7 12C3.81818 12 1.10091 10.134 0 7.5C1.10091 4.866 3.81818 3 7 3ZM1.38727 7.5C1.90162 8.49018 2.70029 9.32445 3.69249 9.90795C4.68469 10.4915 5.83062 10.8008 7 10.8008C8.16938 10.8008 9.31531 10.4915 10.3075 9.90795C11.2997 9.32445 12.0984 8.49018 12.6127 7.5C12.0984 6.50982 11.2997 5.67555 10.3075 5.09205C9.31531 4.50854 8.16938 4.19921 7 4.19921C5.83062 4.19921 4.68469 4.50854 3.69249 5.09205C2.70029 5.67555 1.90162 6.50982 1.38727 7.5Z" fill="#1F1B18" />
                      </svg>
                      <p className={styles.fileRowLink}>Lihat PDF</p>
                    </a>
                  </div>
                )}
                {registration.document?.file_akta && (
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <p>Akta Kelahiran</p>
                    <a href={registration.document.file_akta} target="_blank" rel="noopener noreferrer" className={styles.fileRow}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 5.7C7.50632 5.7 7.99191 5.88964 8.34993 6.22721C8.70796 6.56477 8.90909 7.02261 8.90909 7.5C8.90909 7.97739 8.70796 8.43523 8.34993 8.77279C7.99191 9.11036 7.50632 9.3 7 9.3C6.49368 9.3 6.00809 9.11036 5.65007 8.77279C5.29204 8.43523 5.09091 7.97739 5.09091 7.5C5.09091 7.02261 5.29204 6.56477 5.65007 6.22721C6.00809 5.88964 6.49368 5.7 7 5.7ZM7 3C10.1818 3 12.8991 4.866 14 7.5C12.8991 10.134 10.1818 12 7 12C3.81818 12 1.10091 10.134 0 7.5C1.10091 4.866 3.81818 3 7 3ZM1.38727 7.5C1.90162 8.49018 2.70029 9.32445 3.69249 9.90795C4.68469 10.4915 5.83062 10.8008 7 10.8008C8.16938 10.8008 9.31531 10.4915 10.3075 9.90795C11.2997 9.32445 12.0984 8.49018 12.6127 7.5C12.0984 6.50982 11.2997 5.67555 10.3075 5.09205C9.31531 4.50854 8.16938 4.19921 7 4.19921C5.83062 4.19921 4.68469 4.50854 3.69249 5.09205C2.70029 5.67555 1.90162 6.50982 1.38727 7.5Z" fill="#1F1B18" />
                      </svg>
                      <p className={styles.fileRowLink}>Lihat PDF</p>
                    </a>
                  </div>
                )}
              </div>
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                {registration.document?.file_skhu_skl && (
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <p>SKHU / SKL</p>
                    <a href={registration.document.file_skhu_skl} target="_blank" rel="noopener noreferrer" className={styles.fileRow}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 5.7C7.50632 5.7 7.99191 5.88964 8.34993 6.22721C8.70796 6.56477 8.90909 7.02261 8.90909 7.5C8.90909 7.97739 8.70796 8.43523 8.34993 8.77279C7.99191 9.11036 7.50632 9.3 7 9.3C6.49368 9.3 6.00809 9.11036 5.65007 8.77279C5.29204 8.43523 5.09091 7.97739 5.09091 7.5C5.09091 7.02261 5.29204 6.56477 5.65007 6.22721C6.00809 5.88964 6.49368 5.7 7 5.7ZM7 3C10.1818 3 12.8991 4.866 14 7.5C12.8991 10.134 10.1818 12 7 12C3.81818 12 1.10091 10.134 0 7.5C1.10091 4.866 3.81818 3 7 3ZM1.38727 7.5C1.90162 8.49018 2.70029 9.32445 3.69249 9.90795C4.68469 10.4915 5.83062 10.8008 7 10.8008C8.16938 10.8008 9.31531 10.4915 10.3075 9.90795C11.2997 9.32445 12.0984 8.49018 12.6127 7.5C12.0984 6.50982 11.2997 5.67555 10.3075 5.09205C9.31531 4.50854 8.16938 4.19921 7 4.19921C5.83062 4.19921 4.68469 4.50854 3.69249 5.09205C2.70029 5.67555 1.90162 6.50982 1.38727 7.5Z" fill="#1F1B18" />
                      </svg>
                      <p className={styles.fileRowLink}>Lihat PDF</p>
                    </a>
                  </div>
                )}
                {registration.document?.file_sktm && (
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <p>SKTM / KIP / PKH</p>
                    <a href={registration.document.file_sktm} target="_blank" rel="noopener noreferrer" className={styles.fileRow}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 5.7C7.50632 5.7 7.99191 5.88964 8.34993 6.22721C8.70796 6.56477 8.90909 7.02261 8.90909 7.5C8.90909 7.97739 8.70796 8.43523 8.34993 8.77279C7.99191 9.11036 7.50632 9.3 7 9.3C6.49368 9.3 6.00809 9.11036 5.65007 8.77279C5.29204 8.43523 5.09091 7.97739 5.09091 7.5C5.09091 7.02261 5.29204 6.56477 5.65007 6.22721C6.00809 5.88964 6.49368 5.7 7 5.7ZM7 3C10.1818 3 12.8991 4.866 14 7.5C12.8991 10.134 10.1818 12 7 12C3.81818 12 1.10091 10.134 0 7.5C1.10091 4.866 3.81818 3 7 3ZM1.38727 7.5C1.90162 8.49018 2.70029 9.32445 3.69249 9.90795C4.68469 10.4915 5.83062 10.8008 7 10.8008C8.16938 10.8008 9.31531 10.4915 10.3075 9.90795C11.2997 9.32445 12.0984 8.49018 12.6127 7.5C12.0984 6.50982 11.2997 5.67555 10.3075 5.09205C9.31531 4.50854 8.16938 4.19921 7 4.19921C5.83062 4.19921 4.68469 4.50854 3.69249 5.09205C2.70029 5.67555 1.90162 6.50982 1.38727 7.5Z" fill="#1F1B18" />
                      </svg>
                      <p className={styles.fileRowLink}>Lihat PDF</p>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
