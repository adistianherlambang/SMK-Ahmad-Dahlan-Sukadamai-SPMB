# Sistem Informasi Penerimaan Peserta Didik Baru (PPDB / SPMB)
## SMK Ahmad Dahlan Sukadamai

Sistem Pendaftaran Mahasiswa Baru (SPMB / PPDB) Mandiri SMK Ahmad Dahlan Sukadamai adalah aplikasi web modern berbasis **Laravel 11**, **React 19**, **Inertia.js v3**, dan **Vite** yang dirancang khusus untuk memfasilitasi proses pendaftaran, seleksi, verifikasi berkas, dan pengumuman kelulusan calon siswa baru secara online, cepat, dan transparan. Aplikasi ini dapat dijalankan menggunakan **Docker** (direkomendasikan) maupun secara manual di lingkungan lokal.

---

## 🚀 Fitur Utama & Keunggulan Sistem

1. **Dashboard Statistik Admin:** Menampilkan 6 indikator metrik utama (Total Pendaftar, Belum Diverifikasi, Terverifikasi, Berkas Ditolak, Dinyatakan Lulus, dan Tidak Lulus) dengan desain berwarna *navy-gold* interaktif.
2. **Sistem Verifikasi Berkas Terintegrasi & Anti-Double-Scrollbar:** Panel peninjau dokumen (KK, Akta Kelahiran, SKHU/SKL, SKTM) dalam bentuk popup modern ber-padding rata (`24px`), bebas dari masalah penumpukan scrollbar ganda, lengkap dengan *feedback loop* penolakan berkas secara real-time.
3. **Validasi Karakter Ketat pada Pengumuman:** Membatasi input judul berita khusus bertipe `pengumuman` maksimal 60 karakter dan deskripsi/konten maksimal 100 karakter (termasuk spasi) secara sinkron pada sisi React Frontend (dengan counter dinamis) dan Laravel Backend (menggunakan validator `mb_strlen`).
4. **Desain Kuota & Jalur Masuk:** Halaman kuota tamu (`KuotaPendaftaran.jsx`) menggunakan visualisasi yang identik dengan widget dasbor admin, lengkap dengan sisa kuota yang di-highlight warna kuning emas (`#FDCD2D`).
5. **Footer & Navigasi Terpadu:** Komponen `<Footer />` dan `<Navbar />` terpasang rapi di seluruh halaman publik tamu maupun halaman manajemen admin.

---

## 📂 Struktur Direktori Blueprint (Filetree)

Berikut adalah tata letak berkas utama di dalam repositori proyek:

```text
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/
│   │   │   │   ├── AchievementCrudController.php   # Kelola CRUD Data Prestasi Siswa
│   │   │   │   ├── PostCrudController.php          # Kelola CRUD Berita & Pengumuman (Validasi 60/100 Karakter)
│   │   │   │   ├── QuotaCrudController.php         # Kelola CRUD Jalur & Kuota Pendaftaran
│   │   │   │   └── ScheduleCrudController.php      # Kelola CRUD Jadwal Alur SPMB
│   │   │   ├── AdminDashboardController.php        # Otak utama dasbor admin, verifikasi berkas, kelulusan
│   │   │   ├── LandingPageController.php           # Pengendali rute publik tamu (sambutan, visi misi, kuota, dll.)
│   │   │   ├── StudentAuthController.php           # Alur registrasi calon siswa, login, reset password
│   │   │   └── StudentDashboardController.php      # Dasbor portal calon siswa (unggah dokumen perbaikan, unduh PDF)
│   │   └── Middleware/
│   │       └── ...
│   └── Models/
│       ├── Achievement.php                         # Model Prestasi
│       ├── Document.php                            # Model Berkas Upload Calon Siswa
│       ├── Post.php                                # Model Berita & Pengumuman
│       ├── Quota.php                               # Model Kapasitas & Jalur Pendaftaran
│       ├── Registration.php                        # Model Form Informasi Calon Siswa
│       ├── Schedule.php                            # Model Agenda SPMB
│       └── User.php                                # Model Akun Autentikasi
├── config/
│   └── ...
├── database/
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php # Akun pengguna & sesi
│   │   └── 2026_05_28_000002_create_spmb_tables.php # Skema relasional tabel SPMB
│   └── seeders/
│       └── DatabaseSeeder.php                       # Seeder bawaan: Admin & data simulasi kuota/jadwal
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
│   └── web.php                                      # Rute Aplikasi (Autentikasi, CRUD, Guarded Middleware)
├── vite.config.js                                   # Konfigurasi Build & Compile Vite
└── package.json                                     # Dependensi Node & Script Vite Builder
```

---

## 🗄️ Arsitektur Database (Skema Relasi)

Sistem menggunakan database relasional dengan skema terstruktur sebagai berikut:

```mermaid
erDiagram
    users ||--o| registrations : "has one"
    quotas ||--o{ registrations : "applies to"
    registrations ||--o| documents : "contains files"

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
    registrations {
        id bigint PK
        user_id bigint FK
        quota_id bigint FK
        registration_number string UNIQUE
        nisn string UNIQUE
        full_name string
        gender enum
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
```

### Penjelasan Detail Tabel:
* **`users`**: Menyimpan kredensial login. `role` bernilai `admin` untuk panitia sekolah dan `siswa` untuk calon peserta didik.
* **`quotas`**: Menyimpan jenis jalur masuk (misal: Jalur Domisili, Jalur Prestasi, Jalur Afirmasi) beserta total batas kuotanya.
* **`registrations`**: Menyimpan seluruh biodata diri, data orang tua/wali, sekolah asal, rincian jalur yang dipilih, serta status kelulusan siswa.
* **`documents`**: Menyimpan path berkas syarat pendaftaran berformat PDF/Gambar yang diupload siswa ke direktori penyimpanan lokal/cloud.
* **`schedules`**: Agenda timeline pelaksanaan SPMB yang ditampilkan pada halaman tamu.
* **`posts`**: Pengumuman resmi dan artikel berita sekolah.
* **`achievements`**: Galeri riwayat prestasi siswa sekolah untuk menarik minat pendaftar baru.

---

## 🔄 Alur Kerja Utama Sistem (System Flows)

### 1. Alur Registrasi Calon Siswa Baru (Student Signup)
```text
[Halaman Tamu/Kuota] ➔ [Isi Formulir Biodata & Jalur] ➔ [Buat Email & Sandi Akun] ➔ [Simpan User & Registrasi] ➔ [Unggah Berkas KK/Akta/SKL]
```
* Calon pendaftar meninjau daya tampung jalur masuk di halaman `/informasi/kuota`.
* Pendaftar mengisi lengkap formulir data diri di `/siswa/formulir` dan memilih salah satu jalur masuk.
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
* Jika diset **"Diterima"**, sistem secara otomatis memotong jumlah sisa kuota (`sisa`) pada tabel jalur pendaftaran terkait.
* Calon siswa dapat langsung memantau status akhir kelulusan di dasbor mereka, dan mengunduh berkas PDF bukti registrasi/kelulusan resmi.

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

## 📦 Dependensi Proyek (Dependencies)

Aplikasi ini menggunakan berbagai dependensi modern di sisi Backend dan Frontend untuk menjamin performa, keamanan, dan fungsionalitas yang optimal.

### 1. Backend Dependencies (PHP / Composer)

Berikut adalah pustaka utama yang digunakan pada sisi server:

* **`php (^8.2)`**: Bahasa pemrograman sisi server utama. Dijalankan di PHP **8.2.4** pada image Docker resmi `php:8.2.4-fpm-alpine`.
* **`laravel/framework (^11.0)`**: Framework MVC PHP modern sebagai fondasi utama backend aplikasi (versi aktif: **v11.54.0**).
* **`inertiajs/inertia-laravel (^3.0)`**: Adapter server-side untuk menghubungkan Laravel secara erat dengan React tanpa memerlukan API REST tradisional (versi aktif: **v3.1.0**).
* **`barryvdh/laravel-dompdf (^2.2)`**: Pustaka untuk mengonversi tampilan HTML/CSS menjadi berkas PDF (digunakan untuk mencetak bukti pendaftaran & lembar kelulusan resmi siswa).
* **`laravel/tinker (^2.9)`**: Alat baris perintah interaktif untuk berinteraksi langsung dengan database dan logika aplikasi Laravel.

#### Dependensi Pengembangan (Development Only):
* **`phpunit/phpunit (^11.0)`**: Framework pengujian unit untuk menjamin keandalan kode.
* **`laravel/pint (^1.13)`**: Alat pemformatan kode (*code style fixer*) agar kode PHP tetap bersih dan konsisten sesuai standar PSR.
* **`fakerphp/faker (^1.23)`**: Pustaka untuk menghasilkan data simulasi/palsu guna mempermudah proses seeding database.
* **`laravel/pail (^1.2)`**: Alat penelusuran log interaktif pada terminal.
* **`mockery/mockery (^1.6)`**: Pustaka objek tiruan (*mocking*) untuk kebutuhan pengujian tingkat lanjut.
* **`nunomaduro/collision (^8.1)`**: Sistem pelaporan error visual yang interaktif saat menjalankan pengujian di konsol.

---

### 2. Frontend Dependencies (JavaScript / NPM)

Berikut adalah modul utama yang digunakan pada sisi klien (React/Vite):

* **`react (^19.2.6)`** & **`react-dom (^19.2.6)`**: Library antarmuka pengguna (UI) modern berbasis komponen.
* **`@inertiajs/react (^3.3.0)`**: Adapter client-side yang memungkinkan integrasi erat antara React dan Laravel.
* **`axios (^1.16.1)`**: Klien HTTP berbasis promise untuk melakukan request asinkron ke server.
* **`@vitejs/plugin-react (^6.0.2)`**: Plugin resmi Vite untuk mengaktifkan dukungan penuh React (termasuk Fast Refresh).

#### Dependensi Pengembangan (Development Only):
* **`vite (^8.0.0)`**: Alat build frontend super cepat dengan fitur Hot Module Replacement (HMR).
* **`tailwindcss (^4.0.0)`** & **`@tailwindcss/vite (^4.0.0)`**: Framework CSS utilitas terbaru (versi 4) yang terintegrasi langsung dengan compiler Vite untuk pembuatan desain yang responsif.
* **`concurrently (^9.0.1)`**: Utilitas untuk menjalankan beberapa perintah di terminal secara bersamaan (seperti `php artisan serve` dan `npm run dev`).
* **`laravel-vite-plugin (^3.1)`**: Plugin resmi dari Laravel untuk mengintegrasikan proses compile Vite di lingkungan Laravel.

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
Buka `.env` dan pastikan konfigurasi database sesuai dengan `docker-compose.yml`:
```env
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=db_spmb_ahmad_dahlan
DB_USERNAME=laravel
DB_PASSWORD=secret
```

### 3. Jalankan Docker Compose
Perintah berikut akan **otomatis**:
- Build image PHP 8.2.4 + Nginx + Supervisor
- Menjalankan MySQL 8.0
- Menjalankan migrasi database
- Membuat akun admin (seed otomatis)

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

# Menjalankan artisan dari dalam container
docker compose exec app php artisan <perintah>

# Rebuild ulang image (setelah ada perubahan Dockerfile)
docker compose up -d --build
```

### Struktur File Docker

```text
├── Dockerfile                  # Multi-stage build (Node → PHP 8.2.4-fpm-alpine)
├── docker-compose.yml          # Orkestrasi: App + MySQL 8.0 + phpMyAdmin
├── .dockerignore               # File yang dikecualikan dari build context
└── docker/
    ├── nginx.conf              # Konfigurasi web server Nginx
    ├── php.ini                 # Konfigurasi PHP (memory 256M, timezone Jakarta)
    ├── supervisord.conf        # Menjalankan nginx + php-fpm + queue worker
    └── entrypoint.sh           # Script inisialisasi (migrate + auto-seed)
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

### 3. Pasang Dependensi Backend (PHP)
```bash
composer install
```

### 4. Pasang Dependensi Frontend (NodeJS)
```bash
npm install
```

### 5. Konfigurasi Environment (`.env`)
Salin berkas template konfigurasi bawaan:
```bash
cp .env.example .env
```
Buka berkas `.env` lalu sesuaikan konfigurasi database:
```env
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database_anda
DB_USERNAME=username_database_anda
DB_PASSWORD=password_database_anda
```

### 6. Generate Application Key
```bash
php artisan key:generate
```

### 7. Jalankan Migrasi & Pengisian Data (Seeder)
Buat struktur tabel dan isi data awal (termasuk akun admin):
```bash
php artisan migrate --seed
```

### 8. Hubungkan Direktori Storage
```bash
php artisan storage:link
```

### 9. Jalankan Server Pengembangan (Dev Server)
Jalankan **dua perintah** di bawah ini secara bersamaan di dua tab terminal terpisah:

#### Terminal 1: Backend Laravel
```bash
php artisan serve
```
Aplikasi Laravel akan aktif di: `http://127.0.0.1:8000`

#### Terminal 2: Compiler Vite (Hot Reload Frontend)
```bash
npm run dev
```
Compiler Vite akan aktif memantau perubahan komponen React dan CSS secara real-time.

---

## 🔑 Kredensial Akun Bawaan (Default Credentials)

Setelah migrasi dan seeder berhasil dijalankan (otomatis via Docker, atau manual via `php artisan db:seed`), gunakan akun berikut untuk masuk ke panel admin:

| | |
|---|---|
| **Tautan Login Admin (Docker)** | `http://localhost:8000/admin/login` |
| **Tautan Login Admin (Manual)** | `http://127.0.0.1:8000/admin/login` |
| **Email Panitia Admin** | `admin@gmail.com` |
| **Kata Sandi (Password)** | `password` |

> ⚠️ **Penting:** Ubah password admin segera setelah pertama kali login di lingkungan produksi.

---

## 🛠️ Tech Stack Ringkasan

| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| Runtime Server | PHP (Docker: `php:8.2.4-fpm-alpine`) | ^8.2 |
| Framework Backend | Laravel | ^11.0 (v11.54.0) |
| Adapter SSR | Inertia.js Laravel | ^3.0 (v3.1.0) |
| Framework Frontend | React | ^19.2 |
| Adapter CSR | @inertiajs/react | ^3.3 |
| Build Tool | Vite | ^8.0 |
| CSS Framework | Tailwind CSS | ^4.0 |
| Database | MySQL | 8.0 |
| Web Server (Docker) | Nginx | Alpine |
| PDF Generator | DomPDF (barryvdh) | ^2.2 |
| Kontainerisasi | Docker + Docker Compose | - |

*Selamat melakukan pengujian dan pengembangan sistem PPDB SMK Ahmad Dahlan Sukadamai!*
