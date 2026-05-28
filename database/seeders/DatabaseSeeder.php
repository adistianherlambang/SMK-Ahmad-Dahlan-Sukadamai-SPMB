<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Admin User
        DB::table('users')->insert([
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Seed Quotas (Jalur Pendaftaran)
        DB::table('quotas')->insert([
            [
                'name' => 'Jalur Domisili',
                'quota_limit' => 100,
                'description' => 'Jalur pendaftaran bagi calon siswa baru berdasarkan kedekatan jarak domisili/tempat tinggal ke sekolah.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jalur Prestasi',
                'quota_limit' => 50,
                'description' => 'Jalur pendaftaran bagi calon siswa baru yang memiliki prestasi akademik maupun non-akademik.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jalur Afirmasi',
                'quota_limit' => 30,
                'description' => 'Jalur khusus pendaftaran bagi calon siswa baru dari keluarga ekonomi tidak mampu atau memiliki KIP/PKH.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // 3. Seed Schedules (Jadwal SPMB)
        DB::table('schedules')->insert([
            [
                'title' => 'Pendaftaran Gelombang 1',
                'description' => 'Pengisian formulir pendaftaran online dan unggah berkas persyaratan di website SPMB.',
                'start_date' => '2026-05-01',
                'end_date' => '2026-06-30',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Verifikasi Berkas & Wawancara',
                'description' => 'Verifikasi fisik dokumen yang diunggah dan pelaksanaan tes wawancara minat bakat di SMK Ahmad Dahlan.',
                'start_date' => '2026-07-01',
                'end_date' => '2026-07-10',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Pengumuman Kelulusan',
                'description' => 'Pengumuman kelulusan penerimaan siswa baru gelombang 1 secara online di dasbor masing-masing calon siswa.',
                'start_date' => '2026-07-15',
                'end_date' => '2026-07-15',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // 4. Seed Achievements (Daftar Prestasi)
        DB::table('achievements')->insert([
            [
                'title' => 'Juara 1 Lomba LKS Teknik Bisnis Sepeda Motor (TBSM)',
                'student_name' => 'Ahmad Rifai',
                'year' => 2025,
                'image_path' => 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Harapan 2 Pidato Bahasa Arab Provinsi Lampung',
                'student_name' => 'Zahra Salsabila',
                'year' => 2024,
                'image_path' => 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Juara 3 Turnamen Futsal Bupati Cup Lamsel',
                'student_name' => 'Tim Futsal SMK AD',
                'year' => 2025,
                'image_path' => 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // 5. Seed Posts (Berita & Pengumuman)
        DB::table('posts')->insert([
            [
                'title' => 'Pendaftaran Siswa Baru (SPMB) Gelombang 1 Resmi dibuka!',
                'type' => 'pengumuman',
                'content' => 'SMK Ahmad Dahlan Sukadamai secara resmi membuka Penerimaan Peserta Didik Baru (PPDB/SPMB) Tahun Pelajaran 2026/2027 Gelombang 1. Silakan lakukan pendaftaran secara online melalui sistem mandiri ini dengan melengkapi isian berkas KK, Akta Kelahiran, dan SKHU/SKL.',
                'image_path' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Informasi Pelaksanaan Ujian Tes Minat Bakat Calon Siswa Baru',
                'type' => 'pengumuman',
                'content' => 'Bagi calon siswa baru yang sudah mendaftar dan diverifikasi berkasnya oleh panitia, dimohon untuk mempersiapkan diri mengikuti Tes Wawancara & Minat Bakat yang akan dilaksanakan di lab sepeda motor TBSM sekolah sesuai jadwal yang ditentukan.',
                'image_path' => 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'SMK Ahmad Dahlan Sukadamai Meraih Akreditasi A (Unggul)',
                'type' => 'berita',
                'content' => 'Alhamdulillah, berkat rahmat Allah SWT serta dedikasi seluruh guru dan staf, SMK Ahmad Dahlan Sukadamai Lampung Selatan berhasil mempertahankan predikat Akreditasi A (Unggul) dari Badan Akreditasi Nasional Sekolah/Madrasah. Kami berkomitmen untuk terus meningkatkan mutu pendidikan kejuruan yang berkarakter islami.',
                'image_path' => 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Kunjungan Industri Jurusan Perbankan Syariah ke BSI Kantor Cabang',
                'type' => 'berita',
                'content' => 'Siswa-siswi jurusan Perbankan Syariah SMK Ahmad Dahlan Sukadamai melaksanakan kegiatan Kunjungan Industri (KI) tahunan ke Bank Syariah Indonesia (BSI) Cabang Lampung Selatan. Kegiatan ini bertujuan memberikan wawasan langsung tentang alur operasional perbankan syariah yang riil kepada siswa.',
                'image_path' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
