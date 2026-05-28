# agent.md

## 1. Project Overview & Architecture Blueprint

Sistem ini adalah Aplikasi Sistem Pendaftaran Mahasiswa/Siswa Baru (SPMB) untuk **SMK Ahmad Dahlan Sukadamai** (Kabupaten Lampung Selatan). Sistem ini dikembangkan menggunakan prinsip **Mobile-First Design** dengan performa Single Page Application (SPA).

### Tech Stack Constraints

* **Backend Framework:** Laravel (Latest Stable Version)
* **Frontend Engine:** Inertia.js dengan React.js (untuk performa SPA tanpa API overhead)
* **Build Tool & Bundler:** Vite
* **Database:** MySQL
* **Styling Engine:** **Pure CSS Modules** (`*.module.css`). *Dilarang keras menggunakan Tailwind CSS, Bootstrap, UnoCSS, ataupun UI library seperti Shadcn/Chakra.* Semua layouting wajib menggunakan CSS native (Flexbox/Grid) berlingkup lokal.

### Global Tokens & Color Palette

Definisikan variabel CSS global pada berkas `resources/css/variables.css`:

```css
:root {
  --color-primary-dark: #002147;
  --color-accent-yellow: #FDCD2D;
  --color-text-main: #1F1B18;
  --color-danger: #FF0200;
  --color-success: #18C927;
  --color-white: #FFFFFF;
  --color-overlay: rgba(0, 0, 0, 0.6);
  
  --spacing-mobile-lr: 16px;
  --spacing-mobile-tb: 32px;
  --spacing-mobile-gap: 48px;
}

```

---

## 2. Database Schema Design (MySQL Migrations)

Berikut rancangan migrasi database yang merepresentasikan kebutuhan data sistem:

### `users` table (Polymorphic/Multi-role Auth)

```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('email')->unique();
    $table->string('password');
    $table->enum('role', ['admin', 'siswa']);
    $table->rememberToken();
    $table->timestamps();
});

```

### `quotas` table (Jalur Pendaftaran)

```php
Schema::create('quotas', function (Blueprint $table) {
    $table->id();
    $table->string('name'); // Jalur Domisili, Prestasi, dll.
    $table->integer('quota_limit');
    $table->text('description')->nullable();
    $table->timestamps();
});

```

### `registrations` table

```php
Schema::create('registrations', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('quota_id')->constrained(); // Jalur pendaftaran
    $table->string('registration_number')->unique(); // Format: REG-{YYYYMMDD}-{5_DIGIT_AUTO}
    $table->string('nisn', 10)->unique();
    $table->string('full_name');
    $table->enum('gender', ['L', 'P']);
    $table->string('birth_place');
    $table->date('birth_date');
    $table->string('religion');
    $table->integer('child_order');
    $table->string('family_status');
    
    // Keterangan Orang Tua
    $table->string('parent_name');
    $table->string('parent_occupation');
    $table->enum('parent_status', ['Ayah', 'Ibu', 'Wali']);
    
    // Asal Sekolah
    $table->string('school_origin');
    $table->text('school_address');
    
    // Kontak & Alamat
    $table->string('phone_number');
    $table->text('address');
    
    // Status Alur Verifikasi & Kelulusan
    $table->enum('verification_status', ['Menunggu Verifikasi', 'Berkas Ditolak', 'Terverifikasi'])->default('Menunggu Verifikasi');
    $table->enum('graduation_status', ['Menunggu Kelulusan', 'Diterima', 'Tidak Lulus'])->default('Menunggu Kelulusan');
    $table->text('rejection_reason')->nullable(); // Pesan dari admin jika ditolak
    $table->timestamps();
});

```

### `documents` table

```php
Schema::create('documents', function (Blueprint $table) {
    $table->id();
    $table->foreignId('registration_id')->constrained()->onDelete('cascade');
    $table->string('file_kk');
    $table->string('file_akta');
    $table->string('file_skhu_skl');
    $table->string('file_sktm')->nullable();
    $table->timestamps();
});

```

### `schedules` table (SPMB Schedule)

```php
Schema::create('schedules', function (Blueprint $table) {
    $table->id();
    $table->string('title'); // Nama kegiatan/Tahap
    $table->text('description');
    $table->date('start_date');
    $table->date('end_date');
    $table->timestamps();
});

```

### `posts` table (Berita & Pengumuman)

```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->enum('type', ['berita', 'pengumuman']);
    $table->text('content');
    $table->string('image_path')->nullable();
    $table->timestamps();
});

```

### `achievements` table

```php
Schema::create('achievements', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->string('student_name');
    $table->integer('year');
    $table->string('image_path');
    $table->timestamps();
});

```

---

## 3. Atomic Ready-to-Use Core Components

Seluruh komponen ini bersifat reusable, modular, dan diatur kinerjanya menggunakan CSS Modules.

### A. `<Input />` Component

* **Path:** `resources/js/Components/Input/Input.jsx`
* **CSS Module:** `resources/js/Components/Input/Input.module.css`

```jsx
import React from 'react';
import styles from './Input.module.css';

export default function Input({ label, placeholder, type = 'text', value, onChange, name, required = false, ...props }) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}{required && '*'}</label>}
      <input 
        type={type} 
        name={name}
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        className={styles.inputField}
        required={required}
        {...props}
      />
    </div>
  );
}

```

*CSS Module Blueprint (`Input.module.css`):*

```css
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}
.label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-main);
}
.inputField {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-text-main);
  border-radius: 4px;
  font-size: 14px;
  background-color: var(--color-white);
  box-sizing: border-box;
}
.inputField:focus {
  outline: 2px solid var(--color-accent-yellow);
}

```

### B. `<Select />` Component

* **Path:** `resources/js/Components/Select/Select.jsx`
* **CSS Module:** `resources/js/Components/Select/Select.module.css`

```jsx
import React from 'react';
import styles from './Select.module.css';

export default function Select({ label, placeholder, options = [], value, onChange, name, required = false }) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}{required && '*'}</label>}
      <select name={name} value={value} onChange={onChange} className={styles.selectField} required={required}>
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

```

### C. `<FileInput />` Component (Custom State View)

* **Path:** `resources/js/Components/FileInput/FileInput.jsx`
* **CSS Module:** `resources/js/Components/FileInput/FileInput.module.css`

```jsx
import React from 'react';
import styles from './FileInput.module.css';

export default function FileInput({ label, required = false, isUploaded, onFileView, onChange, accept = ".pdf" }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>{label}{required && '*'}</span>
      {!isUploaded ? (
        <label className={styles.uploadBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
          <span>Pilih File</span>
          <input type="file" accept={accept} onChange={onChange} className={styles.hiddenInput} />
        </label>
      ) : (
        <button type="button" onClick={onFileView} className={styles.viewBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>Lihat File</span>
        </button>
      )}
    </div>
  );
}

```

*CSS Module Blueprint (`FileInput.module.css`):*

```css
.wrapper { display: flex; flex-direction: column; gap: 8px; width: 100%; }
.label { font-size: 14px; font-weight: 600; }
.hiddenInput { display: none; }
.uploadBtn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px; border: 1px dashed #1F1B18; background-color: #FFFFFF;
  border-radius: 4px; cursor: pointer; font-size: 14px;
}
.viewBtn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px; border: none; background-color: #FDCD2D;
  color: #1F1B18; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;
}

```

### D. `<Popup />` Component (Global Overlay)

* **Path:** `resources/js/Components/Popup/Popup.jsx`
* **CSS Module:** `resources/js/Components/Popup/Popup.module.css`

```jsx
import React from 'react';
import styles from './Popup.module.css';

export default function Popup({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

```

*CSS Module Blueprint (`Popup.module.css`):*

```css
.overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: var(--color-overlay); display: flex; align-items: center;
  justify-content: center; z-index: 9999;
}
.popupContent {
  width: 100%; max-width: 400px; margin: 1rem; padding: 1rem;
  background-color: var(--color-white); border-radius: 8px;
  display: flex; flex-direction: column; gap: 24px; box-sizing: border-box;
}

```

### E. Unified Navigation Component & Drawer Architecture

Sistem navigasi dikelola secara seragam lintas tiga konteks utama (Guest Landing, Student Dashboard, dan Admin Dashboard). Drawer navigasi mobile wajib bergeser masuk (*slide-in*) dari sisi kanan atau kiri layar secara responsif saat tombol hamburger ditekan.

* **Path:** `resources/js/Components/Navbar/Navbar.jsx`
* **CSS Module:** `resources/js/Components/Navbar/Navbar.module.css`

```jsx
import React, { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar({ navType = 'landing', links = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>SMK AD</div>
        <button className={styles.hamburger} onClick={() => setIsOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </nav>
      
      {/* Side Slide-in Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
        </div>
        <div className={styles.drawerBody}>
          {links.map((link, i) => (
            <div key={i} className={styles.navItem}>
              {link.dropdown ? (
                <div className={styles.dropdownGroup}>
                  <span className={styles.dropdownTitle}>{link.label}</span>
                  <div className={styles.dropdownItems}>
                    {link.dropdown.map((sub, idx) => (
                      <a key={idx} href={sub.url} className={styles.subLink}>{sub.label}</a>
                    ))}
                  </div>
                </div>
              ) : (
                <a href={link.url} className={styles.mainLink}>{link.label}</a>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

```

*CSS Module Blueprint (`Navbar.module.css`):*

```css
.navbar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px; background-color: var(--color-primary-dark); color: #FFFFFF;
  position: sticky; top: 0; z-index: 1000;
}
.hamburger { background: none; border: none; color: #FFFFFF; cursor: pointer; }
.drawer {
  position: fixed; top: 0; right: -100%; width: 80%; max-width: 300px; height: 100vh;
  background-color: var(--color-primary-dark); transition: right 0.3s ease; z-index: 2000;
  padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; gap: 20px;
}
.drawerOpen { right: 0; }
.closeBtn { align-self: flex-end; background: none; border: none; color: white; font-size: 32px; }
.drawerBody { display: flex; flex-direction: column; gap: 16px; }
.mainLink, .dropdownTitle { color: white; font-size: 18px; font-weight: 600; text-decoration: none; }
.dropdownItems { display: flex; flex-direction: column; gap: 8px; padding-left: 12px; margin-top: 8px; }
.subLink { color: #CCCCCC; font-size: 14px; text-decoration: none; }

```

---

## 4. System Routing & Controller Mapping (Laravel Blueprint)

Berkas `routes/web.php` dikonfigurasi untuk memetakan seluruh routing aplikasi ke dalam struktur controller Inertia berikut:

```php
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\StudentAuthController;
use App\Http\Controllers\StudentDashboardController;
use App\Http\Controllers\AdminDashboardController;

// 1. Landing Page Module
Route::get('/', [LandingPageController::class, 'index'])->name('landing');
Route::get('/profil/sambutan', [LandingPageController::class, 'sambutan']);
Route::get('/profil/visi-misi', [LandingPageController::class, 'visiMisi']);
Route::get('/profil/struktur', [LandingPageController::class, 'struktur']);
Route::get('/profil/sejarah', [LandingPageController::class, 'sejarah']);
Route::get('/berita', [LandingPageController::class, 'beritaAll']);
Route::get('/informasi/jadwal', [LandingPageController::class, 'jadwalSpmb']);
Route::get('/informasi/kuota', [LandingPageController::class, 'kuotaPendaftaran']);

// 2. Student Authentication & Registration Process
Route::prefix('siswa')->group(function () {
    Route::get('/login', [StudentAuthController::class, 'showLogin'])->name('siswa.login');
    Route::post('/login', [StudentAuthController::class, 'login']);
    Route::get('/lupa-password', [StudentAuthController::class, 'showForgotPassword']);
    Route::post('/lupa-password', [StudentAuthController::class, 'processForgotPassword']);
    Route::get('/buat-sandi-baru', [StudentAuthController::class, 'showResetPassword']);
    Route::post('/buat-sandi-baru', [StudentAuthController::class, 'resetPassword']);
    Route::get('/ganti-password-berhasil', [StudentAuthController::class, 'passwordSuccess']);
    
    // Register Workflow (Formulir -> Email/Sandi -> Berhasil)
    Route::get('/periode-ditutup', [StudentAuthController::class, 'periodClosed']);
    Route::get('/formulir', [StudentAuthController::class, 'showForm']);
    Route::post('/formulir', [StudentAuthController::class, 'processForm']);
    Route::get('/buat-akun', [StudentAuthController::class, 'showCreateAccount']);
    Route::post('/buat-akun', [StudentAuthController::class, 'registerAccount']);
    Route::get('/pendaftaran-berhasil', [StudentAuthController::class, 'registrationSuccess']);
});

// 3. Authenticated Student Dashboard
Route::middleware(['auth', 'role:siswa'])->prefix('dashboard/siswa')->group(function () {
    Route::get('/', [StudentDashboardController::class, 'index'])->name('siswa.dashboard');
    Route::get('/data-pendaftaran', [StudentDashboardController::class, 'dataPendaftaran']);
    Route::post('/kirim-ulang-berkas', [StudentDashboardController::class, 'reuploadDocuments']);
    Route::get('/unduh-bukti', [StudentDashboardController::class, 'downloadPdf']);
});

// 4. Authenticated Admin Dashboard
Route::get('/admin/login', [AdminDashboardController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/login', [AdminDashboardController::class, 'login']);

Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/verifikasi-berkas', [AdminDashboardController::class, 'verifikasiBerkas']);
    Route::post('/verifikasi-berkas/{id}/aksi', [AdminDashboardController::class, 'prosesVerifikasi']);
    Route::get('/penentuan-kelulusan', [AdminDashboardController::class, 'penentuanKelulusan']);
    Route::post('/penentuan-kelulusan/{id}/aksi', [AdminDashboardController::class, 'prosesKelulusan']);
    
    // Master Data CRUD Router (Schedules, Quotas, Posts, Achievements)
    Route::resource('schedules', App\Http\Controllers\Admin\ScheduleCrudController::class);
    Route::resource('quotas', App\Http\Controllers\Admin\QuotaCrudController::class);
    Route::resource('posts', App\Http\Controllers\Admin\PostCrudController::class);
    Route::resource('achievements', App\Http\Controllers\Admin\AchievementCrudController::class);
});

```

---

## 5. Mobile-First Section UI Specifications

### Layout Global Utility

Setiap konten halaman wajib menggunakan wrapper standar CSS Modules berikut:

```css
.contentWrapper {
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 48px;
  box-sizing: border-box;
}

```

---

### SECTION 1: LANDING PAGE & PROFILE LAYOUTS

#### Landing Page Utama

* **Nav Links:** Beranda, Profil (Dropdown), Informasi Pendaftaran (Dropdown), Berita. CTA: Button "Daftar Sekarang" -> Login Siswa, Button "Login Admin" -> Login Admin.
* **Slider Komponen:** Slider berada di bagian atas halaman pengumuman, memuat maksimal 3 berkas pengumuman terbaru yang diinput admin.
* **Tentang Kami:** Konten teks deskripsi keahlian TBSM & Perbankan Syariah. Background warna `#002147`, font color putih, padding `16px`.
* **Video Embed:** Komponen `<iframe>` pemutar video YouTube responsif dengan aspek rasio `16:9`.
* **Dropdown Keunggulan (Indikator Panah):**
* *Fasilitas & Layanan:* Meliputi 3 baris item bertipe `{ gambar (1:1 fill container), nama fasilitas, deskripsi }`.
* *Ekstrakurikuler:* Grid responsif berisi `{ gambar (1:1 fill container), nama ekskul }`.
* *Daftar Prestasi:* Slider horizontal filter tahun, merender data `{ gambar (1:1), nama kompetisi, nama siswa }`.


* **Berita Terkini:** List vertikal dibatasi maksimal 3 konten. Tiap baris komponen: `{ gambar (1:1), judul, deskripsi (max 10 kata...), tanggal_upload }`. Di bawahnya terdapat tombol penuh "Tampilkan Semua Berita" dengan background warna `#002147` menuju halaman indeks berita.
* **Footer Component:** Informasi hak cipta statis di bagian bawah halaman.

#### Page Sambutan Kepala Sekolah

* **Header Section:** Banner background `#002147`, padding `16px`, gap `8px`, teks: `Sambutan Kepala Sekolah / Profil / Sambutan Kepala Sekolah`.
* **Content Container:** Layout padding vertikal `32px`, horizontal `16px`, gap `48px`.
* **Struktur Elemen:** Foto Kepala Sekolah (Rasio `1:1` fill container), nama lengkap, title sambutan (font-size `24px`), paragraf isi teks sambutan lengkap.

#### Page Visi Misi

* **Header Section:** Background `#002147`, padding `16px`, gap `8px`, teks: `Visi Misi / Profil / Visi Misi`.
* **Content:**
* *Section Visi (gap 16px):* Judul "Visi" diikuti teks visi resmi sesuai brief.
* *Section Misi (gap 16px):* Judul "Misi" diikuti poin-poin teks misi resmi sesuai brief.



#### Page Struktur Organisasi

* **Header Section:** Teks `Struktur Organisasi / Profil / Struktur Organisasi` (Background `#002147`, padding `16px`).
* **Content:** Elemen gambar bagan struktur organisasi dengan properti CSS `width: 100%; height: auto; object-fit: contain;` (mengikuti dimensi asli gambar).

#### Page Sejarah Singkat

* **Header Section:** Teks `Sejarah Singkat / Profil / Sejarah Singkat`.
* **Content:** Judul sejarah berukuran besar beserta blok paragraf deskripsi kronologi pendirian sekolah.

#### Page Berita (Indeks Seluruh Berita)

* **Header Section:** Teks `Berita / Berita`.
* **Content:** Judul h2 "Berita Terkini" (font-size `24px`). Menampilkan seluruh daftar berita terpaginasi secara vertikal dengan komponen layout kartu berita rasio `1:1`, deskripsi maksimal 10 kata, disertai tanggal upload.

#### Page Jadwal SPMB

* **Header Section:** Teks `Informasi Pendaftaran / Jadwal SPMB`.
* **Content:** Judul "Jadwal SPMB" (font-size `24px`). Blok pembungkus dinamis yang diurutkan dari tanggal paling lampau ke tanggal terbaru (*Chronological Ascending Sort*).
* **Kartu Jadwal:** Background kotak `#002147`, padding `16px`, gap `16px`. Struktur teks: `Tahap ${index + 1} -> ${judul} -> ${deskripsi} -> ${start_date} s/d ${end_date}`.

#### Page Kuota Pendaftaran

* **Header Section:** Teks `Informasi Pendaftaran / Kuota Pendaftaran`.
* **Content:** Judul "Kuota Pendaftaran" (font-size `24px`).
* **Layout Grid Dinamis:** Struktur grid maksimal 2 kolom kesamping, gap antar kotak `8px`. Tiap kotak menggunakan background `#002147`, padding `16px`, gap `8px`.
* **Isi Data:** `${nama_jalur_pendaftaran} -> ${jumlah_kuota} -> Sisa kuota: ${sisa} peserta`. *Note: Data sisa diperoleh dari query agregasi pengurangan kapasitas kuota dikurangi jumlah siswa terdaftar pada jalur tersebut.*

---

### SECTION 2: STUDENT LOGIN & REGISTRATION WORKFLOW

#### Page Lupa Password

* **Struktur:** Wrapper content standar. Form input memuat field ready-to-use:
* `<Input label="Email" placeholder="emailkamu@gmail.com" />`
* `<Input label="NISN" placeholder="10 digit NISN" />`
* `<Input label="Nama Lengkap" placeholder="Nama yang terdaftar" />`


* **Action:** Button "Lanjut ke Buat Sandi Baru" memicu validasi data ke endpoint POST, jika sesuai maka sistem mengarahkan ke halaman buat sandi baru.

#### Page Buat Sandi Baru

* **Struktur:** Form input memuat field ready-to-use:
* `<Input label="Sandi Baru" type="password" placeholder="masukkan sandi" />`
* `<Input label="Ulangi Sandi Baru" type="password" placeholder="ulangi sandi" />`


* **Action:** Button "Ubah Password" memproses pembaharuan ke database dan mengarahkan pengguna ke halaman ganti password berhasil.

#### Page Ganti Password Berhasil

* **Struktur:** Image ilustrasi sukses, teks judul h1 "Berhasil!", subtitle "Silahkan login kembali". Button penuh "Ke Halaman Login" untuk mengarahkan pengguna ke halaman login siswa.

#### Page Login Siswa

* **Struktur:** Image dekoratif utama, judul h1 "Selamat datang kembali!", subtitle teks "Belum punya akun? Buat akun disini" (tautan interaktif menuju alur pendaftaran).
* **Field Input:** Email dan Password. Tautan teks "Lupa Sandi?" mengarah ke halaman lupa password. Button "Masuk" melakukan autentikasi siswa ke dalam sistem dashboard.

#### Page Periode Ditutup

* *Kondisi:* Ditampilkan jika pengguna mengakses link registrasi akun baru, namun rentang waktu pelaksanaan SPMB pada tabel schedules belum aktif atau telah berakhir.
* **Struktur:** Komponen gambar ilustrasi kunci/waktu, judul h1 "Maaf, periode pendaftaran belum dibuka/sudah ditutup", dan button navigasi kembali "Ke Halaman Login".

#### Page Formulir Pendaftaran (Langkah Pertama Registrasi)

* **Struktur:** Judul "Formulir Pendaftaran", subtitle "Lengkapi formulir pendaftaran dengan data yang benar". Seluruh isian wajib (*required*).
* **Blok Informasi Calon Peserta (gap 16px):**
* `<Select label="Pilih Jalur Pendaftaran" placeholder="Pilih Jalur" options={...} />`
* `<Input label="NISN" placeholder="10 digit nisn" />`
* `<Input label="Nama Lengkap" placeholder="sesuai ijazah sd/smp" />`
* *Row kesamping (gap 8px):* `<Input label="Jenis Kelamin" />` & `<Select label="Tempat Lahir" />`
* *Row kesamping (gap 8px):* `<Select label="Agama" />` & `<Input label="Tanggal Lahir" type="date" />`
* *Row kesamping (gap 8px):* `<Input label="Anak Ke" type="number" />` & `<Select label="Status dalam Keluarga" />`


* **Blok Keterangan Orang Tua (gap 16px):**
* `<Input label="Ayah/Ibu/Wali" placeholder="nama ayah/ibu/wali" />`
* `<Input label="Pekerjaan Ayah/Ibu/Wali" placeholder="contoh pln" />`
* `<Select label="Status" placeholder="Pilih" />` (Opsi: Ayah, Ibu, Wali)


* **Blok Keterangan Sekolah Asal (gap 16px):**
* `<Input label="Sekolah Asal" placeholder="nama sekolah asal" />`
* `<Input label="Alamat Sekolah Asal" placeholder="alamat sekolah asal anda" />`


* **Blok Keterangan Alamat (gap 16px):**
* `<Input label="No. Telp" placeholder="08xxx" />`
* `<Input label="Alamat" placeholder="alamat domisili anda" />`


* **Blok Upload Berkas Persyaratan (Sub-info: "Format PDF maksimal 2mb"):**
* *Row kesamping (gap 8px):* FileInput Kartu Keluarga & FileInput Akta Kelahiran.
* *Row kesamping (gap 8px):* FileInput SKHU/SKL & FileInput SKTM.
* *Skenario Interaktif:* Jika file terupload, ubah tampilan tombol FileInput menjadi background `#FDCD2D` disertai icon mata dan label text "Lihat File" (membuka file PDF di tab baru via URL `domainsaya.com/filesaya.pdf`).


* **Navigasi:** Button "Lanjut ke Halaman Buat Akun" (menyimpan data sementara di session/state frontend).

#### Page Buat Akun (Langkah Kedua Registrasi)

* **Struktur:** Judul "Buat Akun", subtitle "Jadilah bagian dari SMK Ahmad Dahlan Sukadamai".
* **Wrapper (gap 8px):** `<Input label="Email" placeholder="emailkamu@gmail.com" />` & `<Input label="Sandi" type="password" placeholder="masukkan sandi" />`.
* **Action:** Button "Buat Akun" memproses pembuatan data `users`, `registrations`, dan `documents` ke database dalam satu database transaction, lalu mengarahkan ke halaman pendaftaran berhasil.

#### Page Pendaftaran Berhasil

* **Struktur:** Gambar sukses, judul h1 "Pendaftaran Berhasil!", subtitle "Pantau status kelulusan dan unduh berkas pendaftaran di dasbor calon siswa".
* **Pratinjau Kertas A4 (Layout Surat Bukti Pendaftaran Digital):**
* Komponen box kontainer berwujud dokumen formal. Kiri: Logo Sekolah. Tengah: `Dinas Pendidikan dan Kebudayaan -> SMK Ahmad Dahlan Sukadamai -> Jl. KH Ahmad Dahlan No. 1 Sukadamai`.
* Garis pembatas horizontal tebal (*Line fill container*).
* Teks nomor registrasi: `REG-{DATE}-{5 DIGIT}` beserta tanggal cetak resmi.
* *Poin A:* Informasi Calon Peserta Didik (Nama, NISN, JK, Tempat/Tanggal Lahir, Agama, Anak ke-, Status Keluarga, Jalur Masuk).
* *Poin B:* Keterangan Orang Tua (Nama, Pekerjaan, Status).
* *Poin C:* Keterangan Sekolah Asal (Nama Sekolah, Alamat Sekolah).
* *Poin D:* Keterangan Alamat (No. Telp, Alamat).
* *Footer Bukti:* Kotak border hitam `1px` berisi teks syarat dokumen fisik bawaan (FC KK, FC Akta, FC SKHU/SKL, FC SKTM). Di sebelah kanan kotak terdapat space tanda tangan bertuliskan "Mengetahui Orangtua/Wali Calon Siswa".


* **Action Layout:** Button vertikal berurutan (gap 8px): "Unduh Bukti Pendaftaran" (Aksi download PDF stream) dan "Ke Halaman Login".

---

### SECTION 3: STUDENT DASHBOARD SYSTEM

#### Page Dashboard Utama Siswa

* **Nav Links Auth:** Dashboard, Data Pendaftaran. Button Nav: "Keluar" (POST logout), "Ke Halaman Utama" (Tautan ke beranda landing page).
* **Content Header:** Judul h1 "Dashboard Saya", subtitle "Selamat datang `${registration.full_name}`".
* **Kondisi Status Logika Verifikasi & Kelulusan (Render Conditional):**

```jsx
{/* KONDISI 1: JIKA STATUS MENUNGGU VERIFIKASI */}
{verification_status === 'Menunggu Verifikasi' && (
  <div style={{ backgroundColor: '#FDCD2D', color: '#1F1B18', padding: '16px' }}>
    <h3>Menunggu Verifikasi</h3>
    <p>Data dan berkas pendaftaran anda sedang diperiksa oleh panitia</p>
  </div>
)}

{/* KONDISI 2: JIKA STATUS BERKAS DITOLAK */}
{verification_status === 'Berkas Ditolak' && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ backgroundColor: '#FF0200', color: '#FFFFFF', padding: '16px' }}>
      <h3>Berkas Ditolak</h3>
      <p>Terdapat data atau berkas yang belum sesuai, silahkan lakukan perbaikan</p>
      <p><strong>Pesan Admin:</strong> {rejection_reason}</p>
    </div>
    <div>
      <h4>Upload Berkas Pendaftaran</h4>
      <span>Format JPG/PNG/PDF maksimal 2mb</span>
      {/* Re-render FileInput fields untuk KK, Akta, SKHU, SKTM */}
      <button className="btn-kirim">Kirim Ulang Berkas</button>
    </div>
  </div>
)}

{/* KONDISI 3: JIKA BERKAS TERVERIFIKASI & MENUNGGU KELULUSAN */}
{verification_status === 'Terverifikasi' && graduation_status === 'Menunggu Kelulusan' && (
  <div style={{ backgroundColor: '#FDCD2D', color: '#1F1B18', padding: '16px' }}>
    <h3>Menunggu Kelulusan</h3>
    <p>Hasil kelulusan belum diumumkan, silahkan pantau informasi secara berkala</p>
  </div>
)}

{/* KONDISI 4: JIKA STATUS DITERIMA */}
{graduation_status === 'Diterima' && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ backgroundColor: '#18C927', color: '#FFFFFF', padding: '16px' }}>
      <h3>Anda Diterima</h3>
      <p>Selamat, anda telah dinyatakan diterima sebagai peserta didik baru</p>
    </div>
    <button>Cetak Bukti Penerimaan</button>
  </div>
)}

{/* KONDISI 5: JIKA STATUS TIDAK LULUS */}
{graduation_status === 'Tidak Lulus' && (
  <div style={{ backgroundColor: '#FF0200', color: '#FFFFFF', padding: '16px' }}>
    <h3>Maaf, Anda Belum Diterima</h3>
    <p>Terima kasih telah mengikuti proses pendaftaran, semoga sukses di kesempatan berikutnya</p>
  </div>
)}

```

* **Blok Informasi Ringkas:** Di bagian bawah status, tampilkan informasi statis pendaftaran: No Registrasi, NISN, Jalur Seleksi, dan Sekolah Asal.

#### Page Data Pendaftaran (Detail View)

* **Struktur:** Menampilkan seluruh rangkuman isian data pendaftaran siswa secara detail dan terstruktur (Informasi Calon Peserta, Keterangan Orang Tua, Keterangan Sekolah Asal, Keterangan Alamat).
* **Section Berkas Ter-upload:** Tombol FileInput statis berwarna kuning `#FDCD2D` bertuliskan "Lihat File" untuk setiap dokumen pendukung. Atur tautan unduhan bukti pendaftaran cetak PDF di baris paling bawah halaman.

---

### SECTION 4: ADMINISTRATOR DASHBOARD SYSTEM

#### Page Login Admin

* **Struktur:** Ilustrasi kunci/keamanan, teks judul h1 "Login Administrator", subtitle "Portal Administrator SMK Ahmad Dahlan Sukadamai".
* **Field:** Input Email & Password. Tautan teks "Lupa Sandi? Hubungi Developer" dikonfigurasi membuka tautan external WhatsApp api `wa.me/` nomor developer. Button "Masuk" mengarahkan admin ke halaman dashboard statistika utama.

#### Page Dashboard Utama Admin

* **Nav Links Admin Auth:** Dashboard, Verifikasi Berkas, Penentuan Kelulusan, Jadwal SPMB, Kuota Pendaftaran, Berita, Prestasi. Button Nav: "Keluar & Ke Halaman Utama".
* **Filter Bar Section:** Row horizontal (gap 8px): `<Select label="Pilih Tahun" />` dan `<Select label="Jalur Pendaftaran" />`.
* **Metrik Grid Statistik (Background `#002147`, Font-size nilai: `48px`, Warna Teks: Putih):**
* *Kotak 1:* Total Pendaftar (`${jumlah}`)
* *Kotak 2:* Menunggu Verifikasi (`${jumlah}`)
* *Kotak 3:* Sudah Di Verifikasi (`${jumlah}`)
* *Kotak 4:* Berkas Ditolak (`${jumlah}`)
* *Kotak 5:* Dinyatakan Lulus (`${jumlah}`)
* *Kotak 6:* Dinyatakan Tidak Lulus (`${jumlah}`)


* **Search Bar & Table:** Input pencarian `<Input placeholder="Masukkan nama peserta" />`.
* **Table Component:** Header tabel berwarna `#FDCD2D`, dengan pembatas border bawah baris berwarna `#1F1B18`. Kolom tabel: `No, No Regist, Status Kelulusan, Nama Lengkap, Jalur Pendaftaran, NISN, Jenis Kelamin, Agama, Kontak, Alamat, Anak Ke, Status Keluarga, Nama Orang Tua, Pekerjaan Orang Tua`.
* **Footer Teks:** `2026 Administrator SMK Ahmad Dahlan Sukadamai`.

#### Page Verifikasi Berkas Admin

* **Kontrol Data:** Fitur pencarian nama, dropdown select status (`Berkas Ditolak`, `Menunggu Verifikasi`, `Terverifikasi`), dropdown pilih tahun, dropdown jalur pendaftaran, dan button pemicu "Filter".
* **Tabel Operasional:** Kolom tabel meliputi data identitas pendaftar dasar ditambah kolom **Aksi** khusus yang memuat serangkaian ikon interaktif:
* *Icon Lihat (Mata):* Membuka Popup Detail Pendaftar.
* *Icon Buang (Sampah):* Membuka Popup Hapus Calon Siswa.
* *Kondisi Status "Berkas Ditolak":* Tampilkan *Icon Ulang*, membuka Popup Batalkan Penolakan.
* *Kondisi Status "Menunggu Verifikasi":* Tampilkan *Icon Ceklis* (Membuka Popup Verifikasi Berkas) dan *Icon Silang* (Membuka Popup Menolak Berkas).



#### PETA POPUP LAYOUT VERIFIKASI BERKAS

##### 1. Popup Detail Pendaftar

* *Layout:* Menggunakan komponen dasar `<Popup />`. Overlay gelap, margin mobile `1rem`, padding `1rem`, flex gap `24px`.
* *Konten:* Title "Detail Pendaftar", Nomor Registrasi. Informasi lengkap pendaftar (Blok data siswa, orang tua, sekolah asal, alamat). Blok file upload dengan button kuning `#FDCD2D` untuk membuka berkas dokumen. Button bawah "Tutup" dengan border `#1F1B18 1px` dan background putih.

##### 2. Popup Verifikasi Berkas

* *Konten:* Title "Verifikasi Berkas", teks konfirmasi: "Yakin ingin memverifikasi berkas dari `${nama_siswa}` dengan nomor registrasi `${no_regist}`?".
* *Aksi:* Button "Ya, Lanjutkan" dengan background `#002147` (Mengubah status menjadi 'Terverifikasi' dan memindahkan data ke tahap kelulusan) & Button "Tutup".

##### 3. Popup Tolak Berkas

* *Konten:* Title "Tolak Berkas", teks keterangan: "Masukkan alasan penolakan berkas, catatan ini akan ditampilkan ke siswa". Field: `<Input label="Tulis pesan anda" placeholder="Tulis pesan disini" required />`.
* *Aksi:* Button "Ya, Tolak" dengan background `#FF0200` (Mengubah status menjadi 'Berkas Ditolak' beserta payload deskripsi pesan) & Button "Tutup".

##### 4. Popup Batalkan Penolakan

* *Konten:* Title "Batalkan Penolakan", teks konfirmasi: "Yakin ingin membatalkan penolakan `${nama_siswa}` dengan nomor registrasi `${no_regist}`?".
* *Aksi:* Button "Ya, Lanjutkan" (background `#002147`, mengembalikan status pendaftar ke 'Menunggu Verifikasi') & Button "Tutup".

##### 5. Popup Hapus Calon Siswa

* *Konten:* Title "Hapus Calon Siswa", teks konfirmasi: "Yakin ingin menghapus calon siswa `${nama_siswa}` dengan nomor registrasi `${no_regist}`?".
* *Aksi:* Button "Ya, Hapus" (background `#FF0200`, menghapus data pendaftar dari sistem permanen) & Button "Tutup".

---

#### Page Penentuan Kelulusan Admin

* **Struktur:** Komponen kontrol filter data dan tabel operasional identik dengan halaman verifikasi berkas.
* **Kolom Tabel Aksi:**
* *Icon Mata:* Membuka Popup Detail Pendaftar.
* *Icon Checklist:* Membuka Popup Tetapkan Lulus.
* *Icon Silang:* Membuka Popup Tolak Kelulusan.
* *Icon Trash:* Membuka Popup Hapus Calon Siswa.



##### PETA POPUP LAYOUT PENENTUAN KELULUSAN

* **Popup Tetapkan Lulus:** Teks konfirmasi perubahan status menjadi lulus. Button eksekusi mengubah kolom `graduation_status` menjadi 'Diterima'.
* **Popup Tolak Kelulusan:** Teks konfirmasi penolakan kelulusan siswa. Button eksekusi mengubah kolom `graduation_status` menjadi 'Tidak Lulus'.
* **Popup Hapus Calon Siswa:** Eksekusi penghapusan records.

---

#### Page Jadwal SPMB (Admin CRUD)

* **Tabel Jadwal:** Kolom tabel: `Tahap, Kegiatan, Tanggal Mulai, Tanggal Selesai, Keterangan, Aksi`. Pengurutan otomatis berdasarkan kolom tanggal terlama ke terbaru. Kolom aksi memuat *Icon Edit* dan *Icon Sampah*.
* **CTA Button:** "Tambahkan Jadwal" diletakkan di bawah atau atas tabel untuk membuka popup pembuatan jadwal baru.

##### PETA POPUP JADWAL

* **Popup Tambah Jadwal:** Title "Tambahkan Jadwal". Form field ready-to-use: `<Input label="Nama Kegiatan" />`, row flex gap 8px untuk input tanggal `<Input label="Tanggal Mulai" type="date" />` & `<Input label="Tanggal Selesai" type="date" />`, dilanjutkan `<Input label="Keterangan" />`. Button "Submit" & "Tutup".
* **Popup Edit Jadwal:** Arsitektur form identik dengan popup tambah jadwal, dengan kondisi isian field memuat *value* objek data jadwal terpilih secara dinamis.
* **Popup Hapus Jadwal:** Teks konfirmasi: "Yakin ingin menghapus jadwal `${nama_jadwal}`?". Button "Ya, Hapus" & "Tutup".

---

#### Page Kuota Pendaftaran (Admin CRUD)

* **Tabel Kuota:** Menampilkan baris kolom data: `No, Jalur Pendaftaran, Kuota, Keterangan, Aksi (Icon Edit & Icon Sampah)`. Di bawahnya terdapat tombol penuh "Tambahkan Jalur Pendaftaran".

##### PETA POPUP KUOTA PENDAFTARAN

* **Popup Tambah Jalur Pendaftaran:** Title "Tambah Jalur Pendaftaran". Input fields: `<Input label="Jalur Pendaftaran" />`, `<Input label="Kuota" type="number" />`, dan `<Input label="Keterangan" />`. Button "Submit" & "Tutup".
* **Popup Edit Jalur Pendaftaran:** Mengisi otomatis (*pre-filled value*) data kuota yang dipilih untuk dimodifikasi.
* **Popup Hapus Jalur Pendaftaran:** Teks konfirmasi penanganan hapus master kuota berdasarkan `${nama_jalur}`.

---

#### Page Berita & Pengumuman (Admin CRUD)

* **Aturan Integrasi Data:** Jika admin menambahkan data bermutu tipe **'berita'**, maka konten didistribusikan ke halaman indeks semua berita. Jika admin memilih tipe **'pengumuman'**, maka konten secara otomatis dimasukkan ke bagian *slider header landing page* (Maksimal dibatasi 3 item terbaru).
* **Kontrol & Tabel:** Input pencarian, filter jenis (Berita/Pengumuman), dan filter tanggal dibuat. Struktur kolom tabel: `No, Judul, Jenis, Keterangan (Dipotong max 20 kata), Aksi (Icon Mata, Icon Edit, Icon Sampah)`.
* *Mekanisme Icon Mata:* Jika tipe berita, buka link halaman detail berita target `_blank`. Jika tipe pengumuman, arahkan link ke beranda landing page dengan target `_blank`.


* **CTA:** Button "Tambahkan Berita/Pengumuman".

##### PETA POPUP BERITA

* **Popup Tambah Berita:** Form fields: `<Input label="Judul" />`, `<Select label="Jenis" options={[{label:'Berita', value:'berita'},{label:'Pengumuman', value:'pengumuman'}]} />`, `<Input label="Keterangan" />`, dan Custom Input file gambar menggunakan React `useRef`. Ketika file gambar dipilih, tampilkan pratinjau berupa *blob URL photo* dengan rasio aspek maksimal `1:1`.
* **Popup Edit Berita:** Form manipulasi data berita/pengumuman dengan pratinjau file gambar yang sudah ada sebelumnya.
* **Popup Hapus Berita:** Konfirmasi hapus postingan dengan teks: "Yakin ingin menghapus berita / pengumuman `${judul_berita}`?".

---

#### Page Prestasi (Admin CRUD)

* **Kontrol & Tabel:** Input pencarian prestasi, input pencarian siswa, dropdown filter tahun prestasi, dan button filter. Kolom tabel: `No, Judul, Nama Siswa, Tahun, Aksi (Edit & Hapus)`. Button bawah: "Tambahkan Prestasi".

##### PETA POPUP PRESTASI

* **Popup Tambah Prestasi:** Input fields: `<Input label="Judul Prestasi" />`, `<Input label="Nama Siswa/i" />`, `<Select label="Tahun" />` (Value bawaan diisi menggunakan fungsi js `new Date().getFullYear()`), dan komponen input file gambar dengan `useRef` yang menampilkan pratinjau blob gambar dengan aspek rasio `1:1`.
* **Popup Edit Prestasi:** Form modifikasi data prestasi lengkap dengan penampilan gambar prestasi lama.
* **Popup Hapus Prestasi:** Pesan konfirmasi: "Yakin ingin menghapus prestasi `${judul_prestasi}`?". Button aksi eksekusi "Ya, Hapus" dan button "Tutup".

---

## 6. Security, Guardrails & Execution Instructions

1. **Strict State Management:** Pastikan penanganan state untuk form multistep pada modul registrasi terisolasi dengan baik. Gunakan Inertia form helper (`useForm`) untuk mempermudah proses tracking state loading dan error handling dari Laravel backend validation.
2. **File Upload Constraints:** Semua file upload wajib divalidasi oleh Request Validator di Laravel: Dokumen PDF siswa maksimal `2048 KB`, Foto Berita/Prestasi berekstensi `jpg,jpeg,png` dengan ukuran maksimal `2048 KB`.
3. **Transactional Integrity:** Untuk pembuatan akun siswa baru yang melibatkan entri data ke dalam tiga tabel sekaligus (`users`, `registrations`, `documents`), bungkus proses penyimpanan di dalam method `DB::transaction()` demi menjaga integritas database dari kegagalan parsial.
4. **CSS Class Scoping:** Jangan pernah menulis class name global di dalam CSS Modules. Gunakan format camelCase (misal: `.inputField`) dan panggil menggunakan ekspresi objek `{styles.inputField}` untuk memastikan isolasi gaya bekerja dengan sempurna sesuai standar Figma mobile-first.