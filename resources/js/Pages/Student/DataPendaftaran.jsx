import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar/Navbar';
import FileInput from '../../Components/FileInput/FileInput';
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
          <div className={`${styles.alertBox} ${styles.alertSuccess}`} style={{ marginBottom: '16px' }}>
            ✓ {flash.success}
          </div>
        )}
        {flash?.error && (
          <div className={`${styles.alertBox} ${styles.alertDanger}`} style={{ marginBottom: '16px' }}>
            ⚠️ {flash.error}
          </div>
        )}

        {/* Reupload Section: active ONLY when rejected */}
        {registration.verification_status === 'Berkas Ditolak' && (
          <section className={formStyles.formCard} style={{ border: '2px dashed var(--color-danger)', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-danger)', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
              🔧 Kirim Ulang Berkas Persyaratan
            </h3>
            <p style={{ fontSize: '12px', color: '#718096', lineHeight: '1.5', marginBottom: '20px' }}>
              Silakan pilih dokumen baru berformat PDF (Maks 2MB) untuk menggantikan berkas yang ditolak oleh panitia. Kosongkan berkas yang tidak ingin diubah.
            </p>

            <form onSubmit={handleReuploadSubmit} className={formStyles.form}>
              <FileInput 
                label="Unggah Ulang Kartu Keluarga (KK)"
                isUploaded={!!data.file_kk}
                onFileView={() => window.open(URL.createObjectURL(data.file_kk))}
                onChange={(e) => handleFileChange('file_kk', e.target.files[0])}
              />
              {errors.file_kk && <div style={{ fontSize: '11px', color: 'var(--color-danger)' }}>{errors.file_kk}</div>}

              <FileInput 
                label="Unggah Ulang Akta Kelahiran"
                isUploaded={!!data.file_akta}
                onFileView={() => window.open(URL.createObjectURL(data.file_akta))}
                onChange={(e) => handleFileChange('file_akta', e.target.files[0])}
              />
              {errors.file_akta && <div style={{ fontSize: '11px', color: 'var(--color-danger)' }}>{errors.file_akta}</div>}

              <FileInput 
                label="Unggah Ulang SKHU / SKL"
                isUploaded={!!data.file_skhu_skl}
                onFileView={() => window.open(URL.createObjectURL(data.file_skhu_skl))}
                onChange={(e) => handleFileChange('file_skhu_skl', e.target.files[0])}
              />
              {errors.file_skhu_skl && <div style={{ fontSize: '11px', color: 'var(--color-danger)' }}>{errors.file_skhu_skl}</div>}

              <FileInput 
                label="Unggah Ulang SKTM / KIP / PKH (Opsional)"
                isUploaded={!!data.file_sktm}
                onFileView={() => window.open(URL.createObjectURL(data.file_sktm))}
                onChange={(e) => handleFileChange('file_sktm', e.target.files[0])}
              />
              {errors.file_sktm && <div style={{ fontSize: '11px', color: 'var(--color-danger)' }}>{errors.file_sktm}</div>}

              <button type="submit" disabled={processing} className={formStyles.submitBtn} style={{ backgroundColor: 'var(--color-danger)' }}>
                {processing ? 'Mengirim Berkas...' : 'Kirim Ulang Berkas Persyaratan'}
              </button>
            </form>
          </section>
        )}

        {/* Detailed Info Categories */}
        <div className={formStyles.formCard}>
          {/* Section A: Identitas */}
          <div className={formStyles.section} style={{ marginBottom: '24px' }}>
            <h2 className={formStyles.sectionTitle}>A. Data Calon Siswa</h2>
            <table className={styles.detailsTable}>
              <tbody>
                <tr>
                  <td>Jalur Masuk</td>
                  <td>:</td>
                  <td>{registration.quota?.name}</td>
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
          <div className={formStyles.section} style={{ marginBottom: '24px' }}>
            <h2 className={formStyles.sectionTitle}>B. Keterangan Orang Tua / Wali</h2>
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
          <div className={formStyles.section} style={{ marginBottom: '24px' }}>
            <h2 className={formStyles.sectionTitle}>C. Keterangan Asal Sekolah</h2>
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
          <div className={formStyles.section} style={{ marginBottom: '24px' }}>
            <h2 className={formStyles.sectionTitle}>D. Kontak & Alamat</h2>
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
            <h2 className={formStyles.sectionTitle}>E. Berkas Terunggah (Digital)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              {registration.document?.file_kk && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #E2E8F0', padding: '12px', borderRadius: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>Kartu Keluarga (KK)</span>
                  <a href={registration.document.file_kk} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--color-primary-dark)', fontWeight: 'bold', textDecoration: 'underline' }}>Lihat PDF</a>
                </div>
              )}
              {registration.document?.file_akta && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #E2E8F0', padding: '12px', borderRadius: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>Akta Kelahiran</span>
                  <a href={registration.document.file_akta} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--color-primary-dark)', fontWeight: 'bold', textDecoration: 'underline' }}>Lihat PDF</a>
                </div>
              )}
              {registration.document?.file_skhu_skl && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #E2E8F0', padding: '12px', borderRadius: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>SKHU / SKL</span>
                  <a href={registration.document.file_skhu_skl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--color-primary-dark)', fontWeight: 'bold', textDecoration: 'underline' }}>Lihat PDF</a>
                </div>
              )}
              {registration.document?.file_sktm && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #E2E8F0', padding: '12px', borderRadius: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>SKTM / KIP / PKH</span>
                  <a href={registration.document.file_sktm} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--color-primary-dark)', fontWeight: 'bold', textDecoration: 'underline' }}>Lihat PDF</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2026 SMK Ahmad Dahlan Sukadamai. All Rights Reserved.</p>
      </footer>
    </>
  );
}
