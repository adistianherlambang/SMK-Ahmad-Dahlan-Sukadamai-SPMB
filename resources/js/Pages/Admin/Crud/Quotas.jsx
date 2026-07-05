import React, { useState } from 'react';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import Navbar from '../../../Components/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';
import Popup from '../../../Components/Popup/Popup';
import Input from '../../../Components/Input/Input';
import Button from '../../../Components/Button/Button';
import styles from '../AdminDashboard.module.css';

export default function Quotas({ quotas = [] }) {
  const { flash } = usePage().props;
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const { data, setData, post, put, reset, processing, errors } = useForm({
    name: '',
    quota_limit: '',
    description: '',
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

  const handleOpenAdd = () => {
    reset();
    setEditId(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (quota) => {
    setData({
      name: quota.name,
      quota_limit: quota.quota_limit,
      description: quota.description || '',
    });
    setEditId(quota.id);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      put(`/admin/quotas/${editId}`, {
        onSuccess: () => handleClose(),
      });
    } else {
      post('/admin/quotas', {
        onSuccess: () => handleClose(),
      });
    }
  };

  const handleDelete = (id, name) => {
    if (confirm(`Apakah Anda yakin ingin menghapus jalur pendaftaran "${name}"?`)) {
      router.delete(`/admin/quotas/${id}`);
    }
  };

  return (
    <>
      <Head title="Kelola Kuota Jalur - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent} style={{ display: 'flex', gap: '12px' }}>
          <div>
            <h1>Kelola Jalur Pendaftaran</h1>
            <p>Atur kuota tampung dan deskripsi jalur seleksi penerimaan siswa baru.</p>
          </div>
          <Button className={styles.dataBtn} style={{ width: "100%" }} onClick={handleOpenAdd} variant="primary">
            Tambah Jalur Baru
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

        {/* Quotas Table */}
        <section className={styles.tableSection}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Jalur</th>
                  <th>Kuota / Kapasitas</th>
                  <th>Sisa Kuota</th>
                  <th>Deskripsi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {quotas.length > 0 ? (
                  quotas.map((item, idx) => (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td className={styles.boldCell}>{item.name}</td>
                      <td><strong>{item.quota_limit}</strong> Kursi</td>
                      <td>{item.sisa} Kursi Sisa</td>
                      <td>{item.description}</td>
                      <td>
                        <div className={styles.actionBtnGrid}>
                          <button
                            type="button"
                            className={`${styles.iconBtn} ${styles.iconBtnInfo}`}
                            onClick={() => handleOpenEdit(item)}
                            title="Ubah Jalur"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                            onClick={() => handleDelete(item.id, item.name)}
                            title="Hapus Jalur"
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
                    <td colSpan="6" className={styles.emptyCell}>Belum ada data jalur pendaftaran yang ditambahkan.</td>
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
              {editId ? 'Ubah Jalur Pendaftaran' : 'Tambah Jalur Baru'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                label="Nama Jalur Pendaftaran"
                placeholder="Contoh: Jalur Prestasi Akademik..."
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
              />
              {errors.name && <div style={{ fontSize: '11px', color: 'var(--color-danger)' }}>{errors.name}</div>}

              <Input
                label="Kuota / Kapasitas Maksimal (Siswa)"
                type="number"
                min={1}
                placeholder="Contoh: 50..."
                value={data.quota_limit}
                onChange={(e) => setData('quota_limit', e.target.value)}
                required
              />
              {errors.quota_limit && <div style={{ fontSize: '11px', color: 'var(--color-danger)' }}>{errors.quota_limit}</div>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568' }}>Keterangan / Kriteria Jalur</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Kriteria persyaratan jalur masuk..."
                  style={{ width: '100%', minHeight: '80px', padding: '10px', border: '1px solid #CBD5E0', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                ></textarea>
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
                  Simpan Jalur
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
