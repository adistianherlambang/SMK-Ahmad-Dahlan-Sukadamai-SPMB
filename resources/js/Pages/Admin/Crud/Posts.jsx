import React, { useState, useRef } from 'react';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import Navbar from '../../../Components/Navbar/Navbar';
import Popup from '../../../Components/Popup/Popup';
import Input from '../../../Components/Input/Input';
import Select from '../../../Components/Select/Select';
import Button from '../../../Components/Button/Button';
import styles from '../AdminDashboard.module.css';

export default function Posts({ posts = [] }) {
  const { flash } = usePage().props;
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const imageInputRef = useRef(null);

  const { data, setData, post, put, reset, processing, errors } = useForm({
    title: '',
    content: '',
    type: 'berita',
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

  const handleOpenEdit = (postItem) => {
    setData({
      title: postItem.title,
      content: postItem.content,
      type: postItem.type,
      image: null,
    });
    setPreviewUrl(postItem.image_path || null);
    setEditId(postItem.id);
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
      router.post(`/admin/posts/${editId}`, {
        _method: 'PUT',
        title: data.title,
        type: data.type,
        content: data.content,
        image: data.image
      }, {
        onSuccess: () => handleClose(),
      });
    } else {
      post('/admin/posts', {
        onSuccess: () => handleClose(),
      });
    }
  };

  const handleDelete = (id, title) => {
    if (confirm(`Apakah Anda yakin ingin menghapus postingan "${title}"?`)) {
      router.delete(`/admin/posts/${id}`);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <>
      <Head title="Kelola Berita & Pengumuman - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1>Kelola Berita & Pengumuman</h1>
            <p>Rilis warta sekolah dan instruksi resmi penerimaan siswa baru.</p>
          </div>
          <Button onClick={handleOpenAdd} variant="secondary">
            Tambah Postingan Baru
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

        {/* Posts Table */}
        <section className={styles.tableSection}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Judul Postingan</th>
                  <th>Kategori</th>
                  <th>Tanggal Rilis</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {posts.length > 0 ? (
                  posts.map((item, idx) => (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td className={styles.boldCell}>{item.title}</td>
                      <td>
                        <span className={`${styles.badge} ${item.type === 'pengumuman' ? styles.badgeWarning : styles.badgeSecondary}`}>
                          {item.type.toUpperCase()}
                        </span>
                      </td>
                      <td>{formatDate(item.created_at)}</td>
                      <td>
                        <div className={styles.actionBtnGrid} style={{ gap: '8px' }}>
                          <Button 
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenEdit(item)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(item.id, item.title)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.emptyCell}>Belum ada data postingan berita/pengumuman yang ditambahkan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Add/Edit Modal */}
        <Popup isOpen={isOpen} onClose={handleClose}>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-primary-dark)', borderBottom: '1px solid #EDF2F7', paddingBottom: '12px', marginBottom: '16px', textTransform: 'uppercase' }}>
              {editId ? 'Ubah Postingan' : 'Tambah Postingan Baru'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input 
                label="Judul Postingan"
                placeholder="Contoh: Pembukaan Gelombang I Pendaftaran..."
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                required
              />
              {errors.title && <div style={{ fontSize: '11px', color: 'var(--color-danger)' }}>{errors.title}</div>}

              <Select 
                label="Kategori Kategori"
                placeholder="Pilih kategori..."
                options={[
                  { value: 'berita', label: 'Berita Sekolah' },
                  { value: 'pengumuman', label: 'Pengumuman Resmi' }
                ]}
                value={data.type}
                onChange={(e) => setData('type', e.target.value)}
                required
              />
              {errors.type && <div style={{ fontSize: '11px', color: 'var(--color-danger)' }}>{errors.type}</div>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568' }}>Konten / Isi Postingan</label>
                <textarea 
                  value={data.content}
                  onChange={(e) => setData('content', e.target.value)}
                  placeholder="Isi berita secara mendalam..."
                  style={{ width: '100%', minHeight: '120px', padding: '10px', border: '1px solid #CBD5E0', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                ></textarea>
                {errors.content && <div style={{ fontSize: '11px', color: 'var(--color-danger)' }}>{errors.content}</div>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568' }}>Foto / Gambar Pendukung</label>
                <input 
                  type="file" 
                  ref={imageInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
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
                  Simpan Postingan
                </Button>
              </div>
            </form>
          </div>
        </Popup>
      </main>
    </>
  );
}
