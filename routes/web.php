<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\StudentAuthController;
use App\Http\Controllers\StudentDashboardController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\Admin\ScheduleCrudController;
use App\Http\Controllers\Admin\QuotaCrudController;
use App\Http\Controllers\Admin\PostCrudController;
use App\Http\Controllers\Admin\AchievementCrudController;
use Inertia\Inertia;

// Global Logout Handler
Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
})->name('logout');

// Route testing sementara untuk melihat layout print_bukti
Route::get('/test-pdf', function () {
    $registration = \App\Models\Registration::with(['quota', 'document'])->first();
    
    if (!$registration) {
        return "Belum ada data pendaftaran di database. Silakan isi pendaftaran terlebih dahulu untuk mengetes layout.";
    }
    
    return view('print_bukti', ['registration' => $registration]);
});

// Route testing React untuk live editor print_bukti
Route::get('/test-print', function () {
    return Inertia::render('Guest/PrintBuktiTest');
});

// Fallback Login Route for Laravel's internal redirection
Route::redirect('/login', '/siswa/login')->name('login');

// 1. Landing Page Module
Route::get('/', [LandingPageController::class, 'index'])->name('landing');
Route::get('/profil/sambutan', [LandingPageController::class, 'sambutan']);
Route::get('/profil/visi-misi', [LandingPageController::class, 'visiMisi']);
Route::get('/profil/struktur', [LandingPageController::class, 'struktur']);
Route::get('/profil/sejarah', [LandingPageController::class, 'sejarah']);
Route::get('/berita', [LandingPageController::class, 'beritaAll']);
Route::get('/berita/{id}', [LandingPageController::class, 'beritaShow']);
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
    Route::resource('schedules', ScheduleCrudController::class);
    Route::resource('quotas', QuotaCrudController::class);
    Route::resource('posts', PostCrudController::class);
    Route::resource('achievements', AchievementCrudController::class);
});
