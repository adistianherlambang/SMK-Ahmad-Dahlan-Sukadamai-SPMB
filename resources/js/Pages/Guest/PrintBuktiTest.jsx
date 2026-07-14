import React, { useState, useEffect } from 'react';
import styles from './PrintBuktiTest.module.css';

export default function PrintBuktiTest() {
  // States to toggle content in real-time
  const [isDiterima, setIsDiterima] = useState(true);
  const [selectedJurusan, setSelectedJurusan] = useState('teknik otomotif');

  // Set body background to grey temporarily for this preview page
  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#f3f4f6';
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  // Mock data representing $registration from Laravel

  const registration = {
    registration_number: "SPMB-2026-0001",
    full_name: "Ahmad Dahlan Al-Fatih",
    nisn: "0082345678",
    gender: "L",
    birth_place: "Lampung",
    birth_date: "2010-05-15",
    religion: "Islam",
    child_order: 1,
    family_status: "Anak Kandung",
    phone_number: "081234567890",
    address: "Jl. Pendidikan No. 12, Sukadamai, Lampung Selatan",
    parent_name: "Supardi",
    parent_occupation: "Wiraswasta",
    parent_status: "Ayah Kandung",
    school_origin: "SMP Negeri 1 Sukadamai",
    school_address: "Jl. Raya Sukadamai No. 45",
  };

  // Get current year
  const currentYear = new Date().getFullYear();

  return (
    <div
      className={styles.pageContainer}
      style={{
        backgroundColor: '#f3f4f6',
        minHeight: '100vh',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {/* Real-time Toggles for Design Testing */}
      <div className={styles.controls}>
        <label>
          <input
            type="checkbox"
            checked={isDiterima}
            onChange={(e) => setIsDiterima(e.target.checked)}
          />
          Status: Lulus (Diterima)
        </label>
        <label>
          Jurusan:
          <select
            value={selectedJurusan}
            onChange={(e) => setSelectedJurusan(e.target.value)}
            style={{ marginLeft: '6px', padding: '2px 4px' }}
          >
            <option value="teknik otomotif">Teknik Otomotif</option>
            <option value="manajemen dan bisnis">Manajemen dan Bisnis</option>
          </select>
        </label>
      </div>

      {/* A4 Sheet Container */}
      <div
        className={styles.a4Paper}
        style={{
          width: '210mm',
          maxWidth: '210mm',
          minWidth: '210mm',
          minHeight: '297mm',
          padding: '25mm 20mm 20mm 20mm',
          backgroundColor: '#ffffff',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          boxSizing: 'border-box',
          fontFamily: "'Helvetica', Arial, sans-serif",
          color: '#000',
          fontSize: '11px',
          lineHeight: '1.35',
          margin: '0 auto'
        }}
      >
        <div className={styles.container}>
          {/* Header */}
          <table className={styles.headerTable}>
            <tbody>
              <tr>
                <td className={styles.logoCell}>
                  <img className={styles.logo} src="/mainLogo.webp" alt="Logo" />
                </td>
                <td className={styles.headerTextCell}>
                  <h1>Dinas Pendidikan dan Kebudayaan</h1>
                  <h2>SMK Ahmad Dahlan Sukadamai</h2>
                  <p>Jl. KH Ahmad Dahlan No. 1 Sukadamai, Lampung Selatan</p>
                </td>
                <td style={{ width: '70px' }}></td>
              </tr>
            </tbody>
          </table>

          {/* Double Divider Line */}
          <div className={styles.divider}></div>

          {/* Meta Details */}
          <div className={styles.metaTable}>
            <h2><b>Formulir Penerimaan Siswa Baru</b></h2>
          </div>

          {/* Dynamic Status Alert Message */}
          {/* {isDiterima ? (
            <div className={styles.statusAlertSuccess}>
              <strong>Selamat! Anda Dinyatakan Lulus Seleksi.</strong>
              <br />
              Berdasarkan hasil rapat pleno panitia penerimaan siswa baru, Anda secara resmi dinyatakan{' '}
              <strong>DITERIMA</strong> sebagai siswa baru di SMK Ahmad Dahlan Sukadamai Tahun Pelajaran {currentYear}/{currentYear + 1}. Silakan lakukan daftar ulang fisik sesuai jadwal.
            </div>
          ) : (
            <div className={styles.statusAlertInfo}>
              <strong>Bukti Registrasi Pendaftaran Online.</strong>
              <br />
              Simpan bukti pendaftaran ini sebagai tanda bukti pengajuan berkas pendaftaran Anda secara online. Harap bawa bukti ini beserta dokumen pendukung saat verifikasi fisik di sekolah.
            </div>
          )} */}

          {/* Section A */}
          <div className={styles.sectionTitle}>A. Informasi Calon Peserta Didik</div>
          <table className={styles.dataTable}>
            <tbody>
              <tr>
                <td className={styles.label}>Nomor Registrasi</td>
                <td className={styles.colon}>:</td>
                <td className={styles.value} style={{ fontWeight: 'bold', color: '#002147' }}>
                  {registration.registration_number}
                </td>
              </tr>
              <tr>
                <td className={styles.label}>Nama Lengkap</td>
                <td className={styles.colon}>:</td>
                <td className={styles.value}>{registration.full_name}</td>
              </tr>
              <tr>
                <td className={styles.label}>NISN</td>
                <td className={styles.colon}>:</td>
                <td className={styles.value}>{registration.nisn}</td>
              </tr>
              <tr>
                <td className={styles.label}>Jenis Kelamin</td>
                <td className={styles.colon}>:</td>
                <td className={styles.value}>{registration.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
              </tr>
              <tr>
                <td className={styles.label}>Tempat / Tanggal Lahir</td>
                <td className={styles.colon}>:</td>
                <td className={styles.value}>
                  {registration.birth_place} / 15-05-2010
                </td>
              </tr>
              <tr>
                <td className={styles.label}>Agama</td>
                <td className={styles.colon}>:</td>
                <td className={styles.value}>{registration.religion}</td>
              </tr>
              <tr>
                <td className={styles.label}>Anak Ke-</td>
                <td className={styles.colon}>:</td>
                <td className={styles.value}>{registration.child_order}</td>
              </tr>
              <tr>
                <td className={styles.label}>Status dalam Keluarga</td>
                <td className={styles.colon}>:</td>
                <td className={styles.value}>{registration.family_status}</td>
              </tr>
              <tr>
                <td className={styles.label}>Pilihan Jurusan</td>
                <td className={styles.colon}>:</td>
                <td className={styles.value} style={{ fontWeight: 'bold' }}>
                  {selectedJurusan === 'teknik otomotif' ? 'Teknik Otomotif' : 'Manajemen dan Bisnis'}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Section B */}
          <div className={styles.sectionTitle}>B. Keterangan Orang Tua / Wali</div>
          <table className={styles.dataTable}>
            <tbody>
              <tr>
                <td className={styles.label}>Nama Orang Tua / Wali</td>
                <td className={styles.colon}>:</td>
                <td className={styles.value}>{registration.parent_name}</td>
              </tr>
              <tr>
                <td className={styles.label}>Pekerjaan</td>
                <td className={styles.colon}>:</td>
                <td className={styles.value}>{registration.parent_occupation}</td>
              </tr>
              <tr>
                <td className={styles.label}>Status Hubungan</td>
                <td className={styles.colon}>:</td>
                <td className={styles.value}>{registration.parent_status}</td>
              </tr>
            </tbody>
          </table>

          {/* Section C */}
          <div className={styles.sectionTitle}>C. Keterangan Asal Sekolah</div>
          <table className={styles.dataTable}>
            <tbody>
              <tr>
                <td className={styles.label}>Nama Sekolah Asal</td>
                <td className={styles.colon}>:</td>
                <td className={styles.value}>{registration.school_origin}</td>
              </tr>
              <tr>
                <td className={styles.label}>Alamat Sekolah Asal</td>
                <td className={styles.colon}>:</td>
                <td className={styles.value}>{registration.school_address}</td>
              </tr>
            </tbody>
          </table>

          {/* Section D */}
          <div className={styles.sectionTitle}>D. Kontak & Alamat Calon Siswa</div>
          <table className={styles.dataTable}>
            <tbody>
              <tr>
                <td className={styles.label}>Nomor Telepon / HP</td>
                <td className={styles.colon}>:</td>
                <td className={styles.value}>{registration.phone_number}</td>
              </tr>
              <tr>
                <td className={styles.label}>Alamat Domisili</td>
                <td className={styles.colon}>:</td>
                <td className={styles.value}>{registration.address}</td>
              </tr>
            </tbody>
          </table>

          {/* Footer / Action box and signature */}
          <table className={styles.footerTable}>
            <tbody>
              <tr>
                {/* Left requirements column */}
                <td style={{ width: '55%' }}>
                  {isDiterima ? (
                    <div className={styles.requirementsBox}>
                      <h4>Syarat Daftar Ulang Fisik Bawaan:</h4>
                      <ul>
                        <li>Membawa Cetak Bukti Penerimaan Online ini</li>
                        <li>Fotokopi Kartu Keluarga (KK) - 2 Lembar</li>
                        <li>Fotokopi Akta Kelahiran - 2 Lembar</li>
                        <li>Fotokopi Ijazah / SKL Terlegalisir - 2 Lembar</li>
                        <li>Pas Foto hitam putih ukuran 3x4 - 2 Lembar</li>
                        <li>Semua berkas dimasukkan ke dalam Map Kuning (Laki-laki) atau Map Merah (Perempuan)</li>
                      </ul>
                    </div>
                  ) : (
                    <div className={styles.requirementsBox}>
                      <h4>Syarat Verifikasi Berkas Fisik:</h4>
                      <ul>
                        <li>Membawa Cetak Bukti Pendaftaran ini</li>
                        <li>Fotokopi Kartu Keluarga (KK) - 2 Lembar</li>
                        <li>Fotokopi Akta Kelahiran - 2 Lembar</li>
                        <li>Fotokopi SKHU / SKL Terlegalisir - 2 Lembar</li>
                        <li>Fotokopi SKTM / KIP / PKH (jika ada) - 2 Lembar</li>
                        <li>Semua dokumen dimasukkan ke dalam stopmap</li>
                      </ul>
                    </div>
                  )}
                </td>

                {/* Right signature column */}
                <td style={{ width: '45%', paddingLeft: '30px' }}>
                  <div className={styles.signatureBox}>
                    <p style={{ margin: '0 0 2px 0' }}>Mengetahui,</p>
                    <p style={{ margin: '0 0 90px 0' }}>Orangtua/Wali Calon Siswa</p>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>( .................................................... )</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
