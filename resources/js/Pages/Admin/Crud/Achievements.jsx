import React, { useState, useRef } from 'react';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import Navbar from '../../../Components/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';
import Popup from '../../../Components/Popup/Popup';
import Input from '../../../Components/Input/Input';
import Button from '../../../Components/Button/Button';
import styles from '../AdminDashboard.module.css';

export default function Achievements({ achievements = [] }) {
  const { flash } = usePage().props;
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const imageInputRef = useRef(null);

  const { data, setData, post, put, reset, processing, errors } = useForm({
    title: '',
    student_name: '',
    year: new Date().getFullYear().toString(),
    description: '',
    image: null,
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

  const handleOpenAdd = () => {
    reset();
    setPreviewUrl(null);
    setEditId(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (achievement) => {
    setData({
      title: achievement.title,
      student_name: achievement.student_name,
      year: achievement.year.toString(),
      description: achievement.description || '',
      image: null,
    });
    setPreviewUrl(achievement.image_path || null);
    setEditId(achievement.id);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
    setPreviewUrl(null);
  };

  const handleChooseImage = () => {
    imageInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('image', file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      // Use POST with _method: 'PUT' for file upload compatibility in PHP PUT requests
      router.post(`/admin/achievements/${editId}`, {
        _method: 'PUT',
        title: data.title,
        student_name: data.student_name,
        year: data.year,
        description: data.description,
        image: data.image
      }, {
        onSuccess: () => handleClose(),
      });
    } else {
      post('/admin/achievements', {
        onSuccess: () => handleClose(),
      });
    }
  };

  const handleDelete = (id, title) => {
    if (confirm(`Apakah Anda yakin ingin menghapus prestasi "${title}"?`)) {
      router.delete(`/admin/achievements/${id}`);
    }
  };

  return (
    <>
      <Head title="Kelola Prestasi Sekolah - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1>Kelola Prestasi Sekolah</h1>
            <p>Unggah and pamerkan pencapaian siswa di ajang kejuaraan.</p>
          </div>
          <Button onClick={handleOpenAdd} variant="secondary">
            Tambah Prestasi Baru
          </Button>
        </div>
      </header>

      <main className={styles.container}>
        {/* Flash Notifications */}
        {flash?.success && (
          <div className={`${styles.alertBox} ${styles.alertSuccess}`} style={{ marginBottom: '16px' }}>
            {flash.success}
          </div>
        )}

        {/* Achievements Table */}
        <section className={styles.tableSection}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Kejuaraan / Prestasi</th>
                  <th>Peraih / Juara</th>
                  <th>Tahun</th>
                  <th>Keterangan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {achievements.length > 0 ? (
                  achievements.map((item, idx) => (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td className={styles.boldCell}>{item.title}</td>
                      <td>{item.student_name}</td>
                      <td>
                        <span className={styles.badge} style={{ backgroundColor: '#EDF2F7', color: '#4A5568' }}>
                          Tahun {item.year}
                        </span>
                      </td>
                      <td>{item.description}</td>
                      <td>
                        <div className={styles.actionBtnGrid}>
                          <button
                            type="button"
                            className={`${styles.iconBtn} ${styles.iconBtnInfo}`}
                            onClick={() => handleOpenEdit(item)}
                            title="Ubah Prestasi"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                            onClick={() => handleDelete(item.id, item.title)}
                            title="Hapus Prestasi"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className={styles.emptyCell}>Belum ada data prestasi sekolah yang ditambahkan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Add/Edit Modal */}
        <Popup isOpen={isOpen} onClose={handleClose}>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '400', color: 'var(--color-primary-dark)', borderBottom: '1px solid #EDF2F7', paddingBottom: '12px', marginBottom: '16px' }}>
              {editId ? 'Ubah Prestasi' : 'Tambah Prestasi Baru'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input 
                label="Nama Kejuaraan / Prestasi"
                placeholder="Contoh: Juara 1 LKS Otomotif Tingkat Provinsi..."
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                required
              />
              {errors.title && <div style={{ fontSize: '11px', color: 'var(--color-danger)' }}>{errors.title}</div>}

               <Input 
                label="Nama Siswa Peraih Juara"
                placeholder="Contoh: Ahmad Fauzi & Tim..."
                value={data.student_name}
                onChange={(e) => setData('student_name', e.target.value)}
                required
              />
              {errors.student_name && <div style={{ fontSize: '11px', color: 'var(--color-danger)' }}>{errors.student_name}</div>}

              <Input 
                label="Tahun Kejuaraan"
                type="number"
                min={2000}
                max={2100}
                placeholder="Contoh: 2024..."
                value={data.year}
                onChange={(e) => setData('year', e.target.value)}
                required
              />
              {errors.year && <div style={{ fontSize: '11px', color: 'var(--color-danger)' }}>{errors.year}</div>}

               <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568' }}>Keterangan Prestasi</label>
                <textarea 
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Detail perlombaan atau piagam penghargaan..."
                  style={{ width: '100%', minHeight: '80px', padding: '10px', border: '1px solid #CBD5E0', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568' }}>Foto / Piagam Prestasi</label>
                <input 
                  type="file" 
                  ref={imageInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  required={!editId} // image is required only when adding new achievement, optional when updating
                />
                <div 
                  onClick={handleChooseImage}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    border: '1px solid #CBD5E0', 
                    borderRadius: '4px', 
                    fontSize: '13px', 
                    backgroundColor: 'white', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box'
                  }}
                >
                  <span style={{ color: data.image ? '#1F1B18' : '#718096' }}>
                    {data.image ? data.image.name : 'Pilih file gambar...'}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-primary-dark)' }}>
                    Telusuri
                  </span>
                </div>
                {errors.image && <div style={{ fontSize: '11px', color: 'var(--color-danger)' }}>{errors.image}</div>}
                
                {previewUrl && (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', color: '#718096' }}>Pratinjau Gambar (1:1):</label>
                    <div style={{ 
                      width: '100%', 
                      aspectRatio: '1/1', 
                      borderRadius: '6px', 
                      overflow: 'hidden', 
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#F8FAFC'
                    }}>
                      <img 
                        src={previewUrl} 
                        alt="Pratinjau" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #EDF2F7', paddingTop: '16px', marginTop: '8px' }}>
                <Button 
                  variant="outline"
                  onClick={handleClose} 
                  style={{ flex: 1 }}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  loading={processing}
                  style={{ flex: 1 }}
                >
                  Simpan Prestasi
                </Button>
              </div>
            </form>
          </div>
        </Popup>
      </main>
      <Footer />
    </>
  );
}
