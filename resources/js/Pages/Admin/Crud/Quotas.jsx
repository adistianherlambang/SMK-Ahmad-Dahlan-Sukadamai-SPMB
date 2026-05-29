import React, { useState } from 'react';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import Navbar from '../../../Components/Navbar/Navbar';
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
        <div className={styles.headerContent} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1>Kelola Jalur Pendaftaran</h1>
            <p>Atur kuota tampung dan deskripsi jalur seleksi penerimaan siswa baru.</p>
          </div>
          <Button onClick={handleOpenAdd} variant="secondary">
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
                      <td>
                        <span className={`${styles.badge} ${item.sisa > 0 ? styles.badgeSuccess : styles.badgeDanger}`}>
                          {item.sisa} Kursi Sisa
                        </span>
                      </td>
                      <td>{item.description}</td>
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
                            onClick={() => handleDelete(item.id, item.name)}
                          >
                            Hapus
                          </Button>
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
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-primary-dark)', borderBottom: '1px solid #EDF2F7', paddingBottom: '12px', marginBottom: '16px', textTransform: 'uppercase' }}>
              {editId ? 'Ubah Jalur Pendaftaran' : 'Tambah Jalur Baru'}
            </h3>

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
    </>
  );
}
