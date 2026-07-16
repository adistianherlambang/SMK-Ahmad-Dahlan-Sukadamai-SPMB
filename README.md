# Sistem Informasi PPDB (SPMB) & Manajemen Kehadiran Siswa
## SMK Ahmad Dahlan Sukadamai

Sistem Pendaftaran Siswa Baru (SPMB / PPDB) & Manajemen Akademik Mandiri SMK Ahmad Dahlan Sukadamai adalah aplikasi web modern berbasis **Laravel 11**, **React 19**, **Inertia.js v3**, dan **Vite (Tailwind CSS v4)**. 

Aplikasi ini tidak hanya memfasilitasi proses pendaftaran, seleksi, verifikasi berkas, dan pengumuman kelulusan calon siswa baru secara online, tetapi juga menyediakan modul **Manajemen Kelas**, **Penjurusan Siswa**, **Penomoran NIS**, dan **Pencatatan Absensi Harian** siswa setelah dinyatakan diterima/lulus seleksi.

Aplikasi ini dapat dijalankan dengan mudah menggunakan **Docker** (direkomendasikan) maupun secara manual menggunakan perintah inisialisasi cepat **Composer Scripts**.

---

## 🚀 Fitur Utama & Keunggulan Sistem

### 1. Modul PPDB (Penerimaan Siswa Baru)
* **Formulir Pendaftaran Lengkap:** Pendaftaran mandiri dengan formulir data pribadi, data orang tua/wali, data akademik asal sekolah, dan pilihan kompetensi keahlian/jurusan.
* **Sistem Verifikasi Berkas Terintegrasi:** Panel peninjau dokumen (Kartu Keluarga, Akta Kelahiran, SKHU/SKL, SKTM) interaktif dengan popup modern bebas masalah scrollbar ganda, lengkap dengan *feedback loop* jika berkas ditolak.
* **Portal Calon Siswa Baru:** Dasbor khusus bagi calon siswa untuk memantau status verifikasi berkas, mengunggah ulang dokumen perbaikan secara langsung jika ditolak, melihat kelulusan, serta mengunduh bukti PDF resmi.
* **Penentuan Kelulusan Seleksi:** Fitur bagi admin untuk meloloskan pendaftar menjadi siswa resmi, yang secara dinamis memotong sisa kuota pendaftaran.

### 2. Modul Akademik & Siswa Aktif (Baru)
* **Manajemen Kelas (Classroom):** Admin dapat membuat, mengubah, dan menghapus ruang kelas sekolah berdasarkan tingkatan kelas (X, XI, XII) dan jurusan.
* **Penomoran NIS & Penjurusan:** Fitur menetapkan Nomor Induk Siswa (NIS) unik dan pembagian jurusan (Teknik Otomotif / Manajemen dan Bisnis) kepada siswa yang telah lulus seleksi.
* **Tindakan Massal (Batch Actions):** Fitur untuk memilih banyak siswa sekaligus dalam tabel untuk dimasukkan ke kelas tertentu (*Assign Classroom*) atau diubah tingkatannya (*Assign Tingkat*) secara massal demi efisiensi panitia.
* **Batch Delete:** Penghapusan data siswa secara massal untuk kebutuhan pembersihan data.

### 3. Modul Absensi Harian Siswa (Baru)
* **Pencatatan Kehadiran:** Sistem absensi harian siswa per kelas untuk tanggal tertentu dengan pilihan status: **Hadir**, **Sakit**, **Izin**, dan **Alpa**.
* **Proteksi Tanggal Unik:** Sistem database mencegah duplikasi input absensi untuk siswa yang sama pada tanggal yang sama.

### 4. Ekspor Laporan PDF
* **Cetak Bukti Pendaftaran:** Unduh PDF bukti registrasi calon siswa lengkap dengan barcode/nomor registrasi.
* **Cetak Daftar Hadir/Absensi per Kelas:** Menghasilkan PDF lembar absensi bulanan/harian per kelas yang rapi, lengkap dengan nama Mata Pelajaran kustom yang dapat diinput dinamis.
* **Cetak Daftar Absensi per Jurusan:** Menghasilkan PDF rekapitulasi data absensi siswa berdasarkan jurusan dan tingkat kelas tertentu.

### 5. Modul Data Master & Konten Sekolah
* **Pengumuman & Berita Sekolah:** Pembuatan berita/pengumuman sekolah dengan pembatasan teks ketat di sisi React Frontend (dengan counter dinamis) dan Laravel Backend (Judul maks 60 karakter, Konten maks 100 karakter untuk tipe `pengumuman`).
* **Kelola Jadwal Agenda:** Mengatur timeline langkah-langkah pelaksanaan PPDB.
* **Kelola Kuota Jalur:** Mengatur limit daya tampung jalur masuk (Jalur Umum).
* **Kelola Prestasi:** CRUD riwayat prestasi sekolah untuk dipajang pada galeri landing page utama.

---

## 📂 Struktur Direktori Blueprint (Filetree)

Berikut adalah berkas-berkas penting yang membentuk fitur sistem ini:

```text
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/
│   │   │   │   ├── AchievementCrudController.php   # Kelola CRUD Data Prestasi Sekolah
│   │   │   │   ├── PostCrudController.php          # Kelola CRUD Berita & Pengumuman (Validasi 60/100 Karakter)
│   │   │   │   ├── QuotaCrudController.php         # Kelola CRUD Kuota Jalur (Default: Umum)
│   │   │   │   └── ScheduleCrudController.php      # Kelola CRUD Jadwal Agenda PPDB
│   │   │   ├── AdminDashboardController.php        # Controller utama admin: Verifikasi berkas, Kelulusan, Manajemen Siswa, Kelas, Absensi, & Ekspor PDF
│   │   │   ├── LandingPageController.php           # Rute publik tamu (sambutan, visi misi, kuota, berita, jadwal)
│   │   │   ├── StudentAuthController.php           # Alur registrasi calon siswa, login, reset password
│   │   │   └── StudentDashboardController.php      # Portal dasbor siswa (unggah ulang dokumen perbaikan, unduh bukti PDF)
│   │   └── Middleware/
│   │       └── ...
│   └── Models/
│       ├── Achievement.php                         # Model Prestasi
│       ├── Attendance.php                          # Model Presensi/Kehadiran Siswa
│       ├── Classroom.php                           # Model Ruang Kelas
│       ├── Document.php                            # Model Berkas Upload Calon Siswa
│       ├── Post.php                                # Model Berita & Pengumuman
│       ├── Quota.php                               # Model Kapasitas & Jalur Pendaftaran
│       ├── Registration.php                        # Model Form Informasi Calon Siswa (Terhubung ke Kelas & Absensi)
│       ├── Schedule.php                            # Model Agenda SPMB
│       └── User.php                                # Model Akun Autentikasi
├── database/
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php # Akun pengguna & sesi
│   │   ├── 2026_05_28_000002_create_spmb_tables.php # Skema relasional tabel SPMB awal
│   │   ├── 2026_06_24_000000_add_nis_and_jurusan_to_registrations_table.php # Tambah kolom NIS & Jurusan
│   │   ├── 2026_06_24_000001_create_attendances_table.php # Tabel absensi harian
│   │   ├── 2026_06_24_000002_merge_quotas_to_umum.php     # Inisialisasi Jalur Pendaftaran Umum
│   │   ├── 2026_07_05_080952_add_kelas_to_registrations_table.php           # Tambah tingkat kelas (X, XI, XII)
│   │   ├── 2026_07_05_082020_create_classrooms_table.php                    # Tabel data master kelas
│   │   └── 2026_07_05_082020_add_classroom_id_to_registrations_table.php    # Relasi Registrasi ke Kelas
│   └── seeders/
│       └── DatabaseSeeder.php                       # Seeder bawaan: Admin & data simulasi kuota/jadwal/berita/prestasi
├── resources/
│   ├── css/
│   │   ├── app.css                                  # Custom override global tag, tombol utilitas
│   │   ├── variables.css                            # CSS Design Tokens (Navy `#002147`, Gold `#FDCD2D`, Spacings)
│   │   └── ...
│   └── js/
│       ├── Components/                              # Reusable UI Elements
│       │   ├── Batik/                               # Aksen latar belakang Batik tradisional
│       │   ├── Button/                              # Tombol kustom reusable
│       │   ├── FileInput/                           # Input khusus upload berkas kelengkapan
│       │   ├── Footer/                              # Footer resmi sekolah
│       │   ├── Input/                               # Field teks input berlabel
│       │   ├── Navbar/                              # Header menu navigasi responsif
│       │   ├── Popup/                               # Modal popup bebas scrollbar ganda
│       │   └── Select/                              # Dropdown select kustom
│       ├── Pages/
│       │   ├── Admin/                               # Panel Kontrol Admin
│       │   │   ├── Crud/
│       │   │   │   ├── Achievements.jsx             # CRUD Prestasi
│       │   │   │   ├── Posts.jsx                # CRUD Berita (Realtime Counter Validasi 60/100)
│       │   │   │   ├── Quotas.jsx               # CRUD Kuota
│       │   │   │   └── Schedules.jsx            # CRUD Jadwal
│       │   │   ├── Absensi.jsx                  # Dashboard Daftar Kelas & Manajemen Absensi (Baru)
│       │   │   ├── AbsensiKelas.jsx             # Pencatatan Kehadiran Siswa per Kelas per Tanggal (Baru)
│       │   │   ├── Siswa.jsx                    # Manajemen Siswa (Assign Kelas, Assign Tingkat, Cetak PDF) (Baru)
│       │   │   ├── Dashboard.jsx                # Statistik Pendaftar
│       │   │   ├── Login.jsx                    # Login Admin
│       │   │   ├── PenentuanKelulusan.jsx       # Seleksi Penerimaan Siswa
│       │   │   └── VerifikasiBerkas.jsx         # Penilaian Berkas & Catatan Perbaikan
│       │   ├── Guest/                               # Halaman Tamu / Publik
│       │   │   ├── BeritaAll.jsx                # List Berita & Pengumuman
│       │   │   ├── BeritaShow.jsx               # Detail Berita
│       │   │   ├── JadwalSpmb.jsx               # Agenda Kalender SPMB
│       │   │   ├── KuotaPendaftaran.jsx         # Status Daya Tampung Real-time & Detail Jalur
│       │   │   ├── Landing.jsx                  # Beranda Utama Website
│       │   │   ├── Sambutan.jsx                 # Sambutan Kepala Sekolah
│       │   │   ├── Sejarah.jsx                  # Timeline Sejarah SMK
│       │   │   ├── Struktur.jsx                 # Bagan Organisasi Sekolah
│       │   │   └── VisiMisi.jsx                 # Visi, Misi & Tujuan Institusi
│       │   └── Student/                             # Panel Calon Siswa (Siswa Baru)
│       │       ├── Auth/
│       │       │   ├── BuatAkun.jsx             # Buat Email & Sandi Akun Siswa
│       │       │   ├── ForgotPassword.jsx       # Request Reset Sandi
│       │       │   ├── Formulir.jsx             # Formulir Identitas & Akademik
│       │       │   ├── Login.jsx                # Portal Masuk Siswa
│       │       │   ├── PasswordSuccess.jsx      # Sandi Berhasil Dibuat
│       │       │   ├── PendaftaranBerhasil.jsx  # Halaman Ringkasan Akun & Unduh PDF
│       │       │   ├── PeriodClosed.jsx         # Pengunci Pendaftaran diluar Gelombang
│       │       │   └── ResetPassword.jsx        # Formulir Ganti Sandi Baru
│       │       ├── Dashboard.jsx                # Status Kelulusan & Form Unggah Ulang Berkas
│       │       └── DataPendaftaran.jsx          # Review Isian Biodata Pendaftar
│       └── app.jsx                                  # Bootstrapper Inertia & React 19
├── routes/
│   └── web.php                                      # Rute Aplikasi (Autentikasi, CRUD, Guarded Middleware, Absensi, & Laporan)
```

---

## 🗄️ Arsitektur Database (Skema Relasi)

Sistem menggunakan database relasional dengan skema terstruktur sebagai berikut:

```mermaid
erDiagram
    users ||--o| registrations : "has one"
    quotas ||--o{ registrations : "applies to"
    registrations ||--o| documents : "contains files"
    classrooms ||--o{ registrations : "places in"
    registrations ||--o{ attendances : "records"

    users {
        id bigint PK
        email string UNIQUE
        password string
        role enum "admin_siswa"
    }
    quotas {
        id bigint PK
        name string
        quota_limit int
        description text
    }
    classrooms {
        id bigint PK
        name string
        jurusan string
        kelas_level enum "X_XI_XII"
    }
    registrations {
        id bigint PK
        user_id bigint FK
        quota_id bigint FK
        classroom_id bigint FK
        registration_number string UNIQUE
        nis string UNIQUE
        jurusan enum "teknik_otomotif_manajemen_dan_bisnis"
        kelas enum "X_XI_XII"
        nisn string UNIQUE
        full_name string
        gender enum "L_P"
        birth_place string
        birth_date date
        religion string
        child_order int
        family_status string
        parent_name string
        parent_occupation string
        parent_status enum
        school_origin string
        school_address text
        phone_number string
        address text
        verification_status enum "Menunggu_Ditolak_Terverifikasi"
        graduation_status enum "Menunggu_Diterima_TidakLulus"
        rejection_reason text
    }
    documents {
        id bigint PK
        registration_id bigint FK
        file_kk string
        file_akta string
        file_skhu_skl string
        file_sktm string
    }
    attendances {
        id bigint PK
        registration_id bigint FK
        date date
        status enum "Hadir_Sakit_Izin_Alpa"
    }
```

---

## 🔄 Alur Kerja Utama Sistem (System Flows)

### 1. Alur Registrasi Calon Siswa Baru (Student Signup)
```text
[Halaman Tamu/Kuota] ➔ [Isi Formulir Biodata & Jurusan] ➔ [Buat Email & Sandi Akun] ➔ [Simpan User & Registrasi] ➔ [Unggah Berkas KK/Akta/SKL]
```
* Calon pendaftar meninjau kapasitas jalur masuk di halaman `/informasi/kuota`.
* Pendaftar mengisi lengkap formulir data diri di `/siswa/formulir` dan memilih salah satu jurusan awal.
* Setelah lolos validasi isian, pendaftar diarahkan membuat email & sandi di `/siswa/buat-akun` untuk login ke portal siswa di masa mendatang.
* Setelah akun tersimpan, pendaftar dialihkan ke dasbor portal siswa `/dashboard/siswa` dan diwajibkan mengunggah berkas wajib (KK, Akta Kelahiran, SKHU/SKL). Status awal pendaftaran diset menjadi **"Menunggu Verifikasi"**.

### 2. Siklus Penilaian Berkas & Catatan Perbaikan (Verification & Feedback Loop)
```text
[Dasbor Admin] ➔ [Buka Verifikasi Berkas] ➔ [Popup Penilai Dokumen] ➔ [Terima] ATAU [Tolak dengan Catatan Perbaikan]
```
* Dokumen pendaftar masuk ke antrean verifikasi berkas di panel admin (`/admin/verifikasi-berkas`).
* Panitia admin membuka popup peninjau dokumen. Popup memuat visualisasi berkas asli yang diupload.
* **Jika Berkas Valid:** Admin menekan **"Terima Berkas"** -> status berubah menjadi **"Terverifikasi"**.
* **Jika Berkas Kurang/Salah:** Admin mengisikan alasan penolakan pada input textarea (contoh: *"Berkas KK buram tidak terbaca, mohon unggah ulang foto yang jelas"*) dan menekan **"Tolak Berkas"** -> status menjadi **"Berkas Ditolak"**.
* **Real-time Feedback:** Pada dasbor portal calon siswa, muncul peringatan merah berisi alasan penolakan dan tombol upload ulang otomatis aktif kembali sehingga pendaftar dapat langsung memperbaiki berkasnya tanpa perlu mendaftar ulang dari awal.

### 3. Alur Seleksi Kelulusan Siswa (Graduation Flow)
```text
[Siswa Terverifikasi] ➔ [Seleksi Akademik/Wawancara Admin] ➔ [Set Diterima / Tidak Lulus] ➔ [Kapasitas Sisa Kuota Berkurang Dinamis]
```
* Calon siswa dengan status dokumen **"Terverifikasi"** akan muncul pada tabel penentuan kelulusan admin (`/admin/penentuan-kelulusan`).
* Panitia mengevaluasi siswa berdasarkan hasil wawancara, nilai sekolah, dan ketersediaan kuota.
* Admin menetapkan status akhir menjadi **"Diterima"** atau **"Tidak Lulus"**.
* Jika diset **"Diterima"**, sistem secara otomatis memotong jumlah sisa kuota pada tabel jalur pendaftaran terkait.
* Calon siswa dapat langsung memantau status akhir kelulusan di dasbor mereka, dan mengunduh berkas PDF bukti registrasi/kelulusan resmi.

### 4. Alur Manajemen Kelas & Penjurusan (Class Assignment Flow)
```text
[Menu Manajemen Siswa] ➔ [Pilih Beberapa Siswa Lulus] ➔ [Set NIS & Jurusan Akhir] ➔ [Assign ke Kelas & Tingkat Secara Massal]
```
* Siswa yang dinyatakan lulus seleksi masuk ke menu `/admin/siswa`.
* Admin/Panitia mengedit data profil siswa untuk memberikan **NIS (Nomor Induk Siswa)** secara resmi dan menentukan keputusan **Jurusan** serta **Tingkat Kelas** (X, XI, XII).
* Admin dapat menggunakan kotak pilihan (checkbox) untuk memilih banyak siswa sekaligus, kemudian menekan tombol **"Masukkan ke Kelas"** (*Assign Classroom*) atau **"Ubah Tingkat Kelas"** (*Assign Tingkat*) untuk memperbarui kelas mereka secara massal.

### 5. Alur Pencatatan Absensi Harian (Attendance Flow)
```text
[Menu Absensi] ➔ [Pilih Kelas] ➔ [Pilih Tanggal Presensi] ➔ [Isi Kehadiran Siswa] ➔ [Simpan Presensi Harian]
```
* Panitia/Guru menuju menu `/admin/absensi` untuk melihat daftar kelas yang aktif beserta jumlah siswa di setiap kelas.
* Guru menekan tombol **"Input Absensi"** pada salah satu kelas untuk dialihkan ke halaman `/admin/absensi/{classroomId}`.
* Guru memilih tanggal pelaksanaan KBM (Kegiatan Belajar Mengajar) dan mengisikan kehadiran siswa satu per satu (Hadir/Sakit/Izin/Alpa).
* Guru menekan **"Simpan Absensi"** untuk menyimpan data kehadiran ke database secara aman.

---

## 📝 Validasi & Logika Teknis Khusus

### 1. Validasi Batas Kata & Karakter Pengumuman
Sistem membedakan postingan bertipe `berita` dan `pengumuman`. Khusus postingan bertipe `pengumuman`:
* **Frontend (`Posts.jsx`):** State React memantau panjang input judul (maksimal 60 karakter) dan konten (maksimal 100 karakter). Apabila melebihi batas, inputan akan dikunci, tombol submit dinonaktifkan, dan teks indikator berubah menjadi warna merah peringatan.
* **Backend (`PostCrudController.php`):** Validasi berlapis menggunakan penutupan (closure) PHP:
  ```php
  $request->validate([
      'title' => [
          'required',
          function ($attribute, $value, $fail) use ($request) {
              if ($request->type === 'pengumuman' && mb_strlen($value) > 60) {
                  $fail('Judul pengumuman tidak boleh lebih dari 60 karakter.');
              }
          }
      ],
      'content' => [
          'required',
          function ($attribute, $value, $fail) use ($request) {
              if ($request->type === 'pengumuman' && mb_strlen($value) > 100) {
                  $fail('Deskripsi pengumuman tidak boleh lebih dari 100 karakter.');
              }
          }
      ],
  ]);
  ```

### 2. Keselarasan Tema Visual (Dark Theme)
* Halaman daya tampung `/informasi/kuota` mengadopsi styling gelap yang bersumber dari CSS Tokens di `variables.css`.
* Latar belakang tampilan menggunakan navy gelap (`var(--color-primary-dark)`), teks berwarna putih kontras, sisa kursi kosong diwarnai kuning emas (`var(--color-accent-yellow)`), serta status ketersediaan jalur dipetakan dalam pil hijau/merah terpadu.

---

## ⚙️ Panduan Instalasi & Menjalankan Proyek (Setup & Run)

Proyek ini mendukung **dua metode instalasi**: menggunakan **Docker** (direkomendasikan, tidak perlu install PHP/MySQL secara manual) atau secara **Manual** di lingkungan lokal.

---

## 🐳 Metode 1: Docker (Direkomendasikan)

### Prasyarat
Pastikan **Docker Desktop** sudah terpasang dan berjalan di komputer Anda:
- [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1. Kloning Repositori
```bash
git clone https://github.com/adistianherlambang/SMK-Ahmad-Dahlan-Sukadamai-SPMB.git
cd SMK-Ahmad-Dahlan-Sukadamai-SPMB
```

### 2. Konfigurasi Environment
Salin template konfigurasi dan sesuaikan untuk Docker:
```bash
cp .env.example .env
```
Buka `.env` dan pastikan konfigurasi database diset untuk service MySQL di Docker Compose:
```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=db_spmb_ahmad_dahlan
DB_USERNAME=laravel
DB_PASSWORD=secret
```

### 3. Jalankan Docker Compose
Perintah berikut akan **otomatis**:
- Build image PHP 8.2 + Nginx + Supervisor
- Menjalankan database MySQL 8.0
- Menjalankan migrasi database
- Membuat akun admin (seeding otomatis melalui script entrypoint)

```bash
docker compose up -d --build
```

### 4. Akses Aplikasi

| Layanan | URL |
|---------|-----|
| 🌐 Aplikasi Laravel | http://localhost:8000 |
| 🗄️ phpMyAdmin | http://localhost:8080 |
| 🔌 MySQL (dari host) | localhost:3307 |

### 5. Perintah Docker Harian
```bash
# Menjalankan semua container
docker compose up -d

# Menghentikan semua container
docker compose down

# Melihat log aplikasi secara live
docker compose logs -f app

# Menjalankan perintah artisan dari dalam container
docker compose exec app php artisan <perintah>

# Rebuild ulang image (setelah ada perubahan file Dockerfile/konfigurasi)
docker compose up -d --build
```

---

## 🖥️ Metode 2: Manual (Tanpa Docker)

### 1. Prasyarat Sistem
Pastikan komputer Anda sudah terpasang perkakas berikut:
* **PHP** versi **8.2** atau lebih baru
* **Composer** (Manajer dependensi PHP)
* **Node.js** (Versi LTS terbaru) & **NPM**
* **MySQL 8.0** atau **MariaDB**

### 2. Kloning Repositori
```bash
git clone https://github.com/adistianherlambang/SMK-Ahmad-Dahlan-Sukadamai-SPMB.git
cd SMK-Ahmad-Dahlan-Sukadamai-SPMB
```

### 3. Instalasi Cepat (Composer Setup Script)
Proyek ini menyediakan script setup otomatis di `composer.json`. Jalankan perintah berikut untuk menginstal dependensi PHP, membuat file `.env`, membuat application key, menjalankan migrasi database, menginstal modul NodeJS, dan mengompilasi aset frontend secara instan:
```bash
composer setup
```

### 4. Hubungkan Direktori Storage
```bash
php artisan storage:link
```

### 5. Jalankan Server Pengembangan (Dev Server Concurrently)
Alih-alih menggunakan dua tab terminal terpisah untuk `php artisan serve` dan `npm run dev`, jalankan perintah berikut untuk menjalankan server Laravel, Vite bundler, log queue, dan logs secara bersamaan di satu terminal:
```bash
composer dev
```
Aplikasi Laravel akan aktif dan dapat diakses melalui link browser: `http://localhost:8000`

---

## 🔑 Kredensial Akun Bawaan (Default Credentials)

Setelah migrasi dan seeder berhasil dijalankan (otomatis via Docker, atau manual via `php artisan db:seed`), gunakan akun berikut untuk masuk ke panel admin:

| Kunci | Nilai Kredensial |
|---|---|
| **Tautan Login Admin** | `http://localhost:8000/admin/login` |
| **Email Panitia Admin** | `admin@gmail.com` |
| **Kata Sandi (Password)** | `password` |

> ⚠️ **Penting:** Ubah kata sandi admin segera setelah pertama kali login di lingkungan produksi.

---

## 🛠️ Tech Stack Ringkasan

| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| Runtime Server | PHP (Docker: `php:8.2.4-fpm-alpine`) | ^8.2 |
| Framework Backend | Laravel | ^11.0 |
| Adapter SSR | Inertia.js Laravel | ^3.0 |
| Framework Frontend | React | ^19.2 |
| Adapter CSR | @inertiajs/react | ^3.3 |
| Build Tool | Vite | ^8.0 |
| CSS Framework | Tailwind CSS | ^4.0 |
| Database | MySQL | 8.0 |
| Web Server (Docker) | Nginx | Alpine |
| PDF Generator | DomPDF (barryvdh) | ^2.2 |
| Kontainerisasi | Docker + Docker Compose | - |

*Selamat melakukan pengujian dan pengembangan sistem PPDB & Akademik SMK Ahmad Dahlan Sukadamai!*
