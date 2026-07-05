import React, { useState } from 'react';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import Navbar from '../../../Components/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';
import Popup from '../../../Components/Popup/Popup';
import Input from '../../../Components/Input/Input';
import Button from '../../../Components/Button/Button';
import styles from '../AdminDashboard.module.css';

export default function Schedules({ schedules = [] }) {
  const { flash } = usePage().props;
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const { data, setData, post, put, reset, processing, errors } = useForm({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
  });

  const links = [
    { url: '/admin/dashboard', label: 'Dasbor' },
    { url: '/admin/verifikasi-berkas', label: 'Verifikasi Berkas' },
    { url: '/admin/penentuan-kelulusan', label: 'Kelulusan' },
    { url: '/admin/siswa', label: 'Manajemen Siswa' },
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

  const handleOpenEdit = (schedule) => {
    setData({
      title: schedule.title,
      description: schedule.description || '',
      start_date: schedule.start_date,
      end_date: schedule.end_date,
    });
    setEditId(schedule.id);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      put(`/admin/schedules/${editId}`, {
        onSuccess: () => handleClose(),
      });
    } else {
      post('/admin/schedules', {
        onSuccess: () => handleClose(),
      });
    }
  };

  const handleDelete = (id, title) => {
    if (confirm(`Apakah Anda yakin ingin menghapus agenda "${title}"?`)) {
      router.delete(`/admin/schedules/${id}`);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <>
      <Head title="Kelola Jadwal SPMB - SMK Ahmad Dahlan" />
      <Navbar links={links} />

      <header className={styles.header}>
        <div className={styles.headerContent} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <h1>Kelola Jadwal SPMB</h1>
            <p>Atur lini masa gelombang dan tahapan pendaftaran siswa baru.</p>
          </div>
          <Button className={styles.dataBtn} onClick={handleOpenAdd} variant="primary">
            Tambah Jadwal Baru
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

        {/* Schedules Table */}
        <section className={styles.tableSection}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Agenda / Gelombang</th>
                  <th>Deskripsi</th>
                  <th>Mulai</th>
                  <th>Selesai</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {schedules.length > 0 ? (
                  schedules.map((stage, idx) => (
                    <tr key={stage.id}>
                      <td>{idx + 1}</td>
                      <td className={styles.boldCell}>{stage.title}</td>
                      <td>{stage.description}</td>
                      <td>{formatDate(stage.start_date)}</td>
                      <td>{formatDate(stage.end_date)}</td>
                      <td>
                        <div className={styles.actionBtnGrid}>
                          <button
                            type="button"
                            className={`${styles.iconBtn} ${styles.iconBtnInfo}`}
                            onClick={() => handleOpenEdit(stage)}
                            title="Ubah Agenda"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                            onClick={() => handleDelete(stage.id, stage.title)}
                            title="Hapus Agenda"
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
                    <td colSpan="6" className={styles.emptyCell}>Belum ada agenda jadwal pendaftaran yang ditambahkan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Add/Edit Popup Modal */}
        <Popup isOpen={isOpen} onClose={handleClose}>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '400', color: 'var(--color-primary-dark)', borderBottom: '1px solid #EDF2F7', paddingBottom: '12px', marginBottom: '16px' }}>
              {editId ? 'Ubah Agenda Jadwal' : 'Tambah Agenda Baru'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                label="Nama Agenda / Gelombang"
                placeholder="Contoh: Gelombang I Pendaftaran..."
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                required
              />
              {errors.title && <div style={{ fontSize: '11px', color: 'var(--color-danger)' }}>{errors.title}</div>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568' }}>Keterangan Deskripsi</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Rincian informasi agenda..."
                  style={{ width: '100%', minHeight: '80px', padding: '10px', border: '1px solid #CBD5E0', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <Input
                    label="Tanggal Mulai"
                    type="date"
                    value={data.start_date}
                    onChange={(e) => setData('start_date', e.target.value)}
                    required
                  />
                  {errors.start_date && <div style={{ fontSize: '11px', color: 'var(--color-danger)' }}>{errors.start_date}</div>}
                </div>
                <div style={{ flex: 1 }}>
                  <Input
                    label="Tanggal Selesai"
                    type="date"
                    value={data.end_date}
                    onChange={(e) => setData('end_date', e.target.value)}
                    required
                  />
                  {errors.end_date && <div style={{ fontSize: '11px', color: 'var(--color-danger)' }}>{errors.end_date}</div>}
                </div>
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
                  Simpan Agenda
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
