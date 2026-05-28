import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Navbar from '../../../Components/Navbar/Navbar';
import Input from '../../../Components/Input/Input';
import Select from '../../../Components/Select/Select';
import FileInput from '../../../Components/FileInput/FileInput';
import styles from './Formulir.module.css';

export default function Formulir({ quotas = [], tempData = null }) {
  const { data, setData, post, processing, errors } = useForm({
    quota_id: tempData?.quota_id ?? '',
    nisn: tempData?.nisn ?? '',
    full_name: tempData?.full_name ?? '',
    gender: tempData?.gender ?? '',
    birth_place: tempData?.birth_place ?? '',
    birth_date: tempData?.birth_date ?? '',
    religion: tempData?.religion ?? '',
    child_order: tempData?.child_order ?? '',
    family_status: tempData?.family_status ?? '',
    parent_name: tempData?.parent_name ?? '',
    parent_occupation: tempData?.parent_occupation ?? '',
    parent_status: tempData?.parent_status ?? '',
    school_origin: tempData?.school_origin ?? '',
    school_address: tempData?.school_address ?? '',
    phone_number: tempData?.phone_number ?? '',
    address: tempData?.address ?? '',
    file_kk: null,
    file_akta: null,
    file_skhu_skl: null,
    file_sktm: null,
  });

  const links = [
    { url: '/', label: 'Beranda' },
    { url: '/siswa/login', label: 'Login Siswa' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/siswa/formulir');
  };

  const handleFileChange = (field, file) => {
    setData(field, file);
  };

  return (
    <>
      <Head title="Formulir Pendaftaran SPMB - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Formulir Pendaftaran</h1>
          <p className={styles.breadcrumb}>
            <Link href="/">Beranda</Link> / Pendaftaran / Formulir
          </p>
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.formCard}>
          <div className={styles.stepIndicator}>
            <div className={`${styles.step} ${styles.stepActive}`}>
              <div className={styles.stepNum}>1</div>
              <span>Form Data</span>
            </div>
            <div className={styles.stepLine}></div>
            <div className={styles.step}>
              <div className={styles.stepNum}>2</div>
              <span>Buat Akun</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {Object.keys(errors).length > 0 && (
              <div className={styles.errorSummary}>
                <strong>Mohon periksa kembali isian Anda:</strong>
                <ul>
                  {Object.entries(errors).map(([key, val]) => (
                    <li key={key}>{val}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* SECTION A: Identitas Calon Siswa */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>A. Data Calon Siswa</h2>
              <div className={styles.sectionBody}>
                <Select 
                  label="Jalur Pendaftaran"
                  placeholder="Pilih jalur pendaftaran..."
                  options={quotas}
                  value={data.quota_id}
                  onChange={(e) => setData('quota_id', e.target.value)}
                  required
                />

                <Input 
                  label="NISN (Nomor Induk Siswa Nasional)"
                  placeholder="Masukkan 10 digit NISN..."
                  maxLength={10}
                  value={data.nisn}
                  onChange={(e) => setData('nisn', e.target.value)}
                  required
                />

                <Input 
                  label="Nama Lengkap"
                  placeholder="Masukkan nama lengkap calon siswa..."
                  value={data.full_name}
                  onChange={(e) => setData('full_name', e.target.value)}
                  required
                />

                <Select 
                  label="Jenis Kelamin"
                  placeholder="Pilih jenis kelamin..."
                  options={[
                    { value: 'L', label: 'Laki-laki' },
                    { value: 'P', label: 'Perempuan' }
                  ]}
                  value={data.gender}
                  onChange={(e) => setData('gender', e.target.value)}
                  required
                />

                <div className={styles.formRow}>
                  <Input 
                    label="Tempat Lahir"
                    placeholder="Tempat lahir..."
                    value={data.birth_place}
                    onChange={(e) => setData('birth_place', e.target.value)}
                    required
                  />
                  <Input 
                    label="Tanggal Lahir"
                    type="date"
                    value={data.birth_date}
                    onChange={(e) => setData('birth_date', e.target.value)}
                    required
                  />
                </div>

                <Select 
                  label="Agama"
                  placeholder="Pilih Agama..."
                  options={[
                    { value: 'Islam', label: 'Islam' },
                    { value: 'Kristen', label: 'Kristen' },
                    { value: 'Katolik', label: 'Katolik' },
                    { value: 'Hindu', label: 'Hindu' },
                    { value: 'Buddha', label: 'Buddha' },
                    { value: 'Khonghucu', label: 'Khonghucu' }
                  ]}
                  value={data.religion}
                  onChange={(e) => setData('religion', e.target.value)}
                  required
                />

                <div className={styles.formRow}>
                  <Input 
                    label="Anak Ke-"
                    type="number"
                    min={1}
                    value={data.child_order}
                    onChange={(e) => setData('child_order', e.target.value)}
                    required
                  />
                  <Input 
                    label="Status Hubungan Keluarga"
                    placeholder="Contoh: Anak Kandung, Anak Angkat"
                    value={data.family_status}
                    onChange={(e) => setData('family_status', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* SECTION B: Keterangan Orang Tua */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>B. Keterangan Orang Tua / Wali</h2>
              <div className={styles.sectionBody}>
                <Input 
                  label="Nama Orang Tua / Wali"
                  placeholder="Masukkan nama lengkap orang tua/wali..."
                  value={data.parent_name}
                  onChange={(e) => setData('parent_name', e.target.value)}
                  required
                />

                <Input 
                  label="Pekerjaan"
                  placeholder="Pekerjaan saat ini..."
                  value={data.parent_occupation}
                  onChange={(e) => setData('parent_occupation', e.target.value)}
                  required
                />

                <Select 
                  label="Hubungan Hubungan Keluarga"
                  placeholder="Pilih hubungan..."
                  options={[
                    { value: 'Ayah', label: 'Ayah Kandung' },
                    { value: 'Ibu', label: 'Ibu Kandung' },
                    { value: 'Wali', label: 'Wali' }
                  ]}
                  value={data.parent_status}
                  onChange={(e) => setData('parent_status', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* SECTION C: Asal Sekolah */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>C. Keterangan Asal Sekolah</h2>
              <div className={styles.sectionBody}>
                <Input 
                  label="Nama Sekolah Asal (SMP / MTs)"
                  placeholder="Contoh: SMP Negeri 1 Sukadamai..."
                  value={data.school_origin}
                  onChange={(e) => setData('school_origin', e.target.value)}
                  required
                />

                <Input 
                  label="Alamat Sekolah Asal"
                  placeholder="Kabupaten / Kota asal sekolah..."
                  value={data.school_address}
                  onChange={(e) => setData('school_address', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* SECTION D: Kontak & Alamat */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>D. Kontak & Alamat Calon Siswa</h2>
              <div className={styles.sectionBody}>
                <Input 
                  label="Nomor Telepon / WhatsApp (Aktif)"
                  placeholder="Contoh: 0852xxxxxxxx..."
                  value={data.phone_number}
                  onChange={(e) => setData('phone_number', e.target.value)}
                  required
                />

                <Input 
                  label="Alamat Domisili Lengkap"
                  placeholder="Dusun, RT/RW, Desa, Kecamatan..."
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* SECTION E: Upload Berkas */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>E. Berkas Persyaratan (PDF Maks 2MB)</h2>
              <div className={styles.sectionBody}>
                <FileInput 
                  label="Kartu Keluarga (KK)"
                  isUploaded={!!data.file_kk}
                  onFileView={() => window.open(URL.createObjectURL(data.file_kk))}
                  onChange={(e) => handleFileChange('file_kk', e.target.files[0])}
                  required
                />

                <FileInput 
                  label="Akta Kelahiran"
                  isUploaded={!!data.file_akta}
                  onFileView={() => window.open(URL.createObjectURL(data.file_akta))}
                  onChange={(e) => handleFileChange('file_akta', e.target.files[0])}
                  required
                />

                <FileInput 
                  label="SKHU / SKL (Surat Keterangan Lulus)"
                  isUploaded={!!data.file_skhu_skl}
                  onFileView={() => window.open(URL.createObjectURL(data.file_skhu_skl))}
                  onChange={(e) => handleFileChange('file_skhu_skl', e.target.files[0])}
                  required
                />

                <FileInput 
                  label="SKTM / KIP / PKH (Opsional - Diwajibkan untuk Jalur Afirmasi)"
                  isUploaded={!!data.file_sktm}
                  onFileView={() => window.open(URL.createObjectURL(data.file_sktm))}
                  onChange={(e) => handleFileChange('file_sktm', e.target.files[0])}
                  required={data.quota_id === '3'} // Automatically required if Jalur Afirmasi (ID 3) selected
                />
              </div>
            </div>

            <button type="submit" disabled={processing} className={styles.submitBtn}>
              {processing ? 'Menyimpan Formulir...' : 'Lanjut ke Halaman Buat Akun'}
            </button>
          </form>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2026 SMK Ahmad Dahlan Sukadamai. All Rights Reserved.</p>
      </footer>
    </>
  );
}
