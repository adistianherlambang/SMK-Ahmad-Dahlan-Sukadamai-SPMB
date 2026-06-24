<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Quota;
use App\Models\Registration;
use App\Models\Document;
use App\Models\Schedule;

class StudentAuthController extends Controller
{
    // Check if registration period is open
    private function isPeriodOpen()
    {
        $today = date('Y-m-d');
        // Let's see if there is any active schedule for pendaftaran
        $activeSchedule = Schedule::where('title', 'like', '%Pendaftaran%')
            ->where('start_date', '<=', $today)
            ->where('end_date', '>=', $today)
            ->first();

        return $activeSchedule !== null;
    }

    public function showLogin()
    {
        if (Auth::check() && Auth::user()->role === 'siswa') {
            return redirect()->route('siswa.dashboard');
        }
        return Inertia::render('Student/Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, true)) {
            $user = Auth::user();
            if ($user->role === 'siswa') {
                $request->session()->regenerate();
                return redirect()->intended(route('siswa.dashboard'));
            }
            Auth::logout();
            return back()->withErrors(['email' => 'Bukan akun siswa. Silakan gunakan portal admin untuk administrator.']);
        }

        return back()->withErrors([
            'email' => 'Email atau kata sandi yang dimasukkan salah.',
        ]);
    }

    public function showForgotPassword()
    {
        return Inertia::render('Student/Auth/ForgotPassword');
    }

    public function processForgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'nisn' => 'required|size:10',
            'full_name' => 'required',
        ]);

        // Find user & registration
        $user = User::where('email', $request->email)->where('role', 'siswa')->first();
        if (!$user) {
            return back()->withErrors(['email' => 'Email siswa tidak terdaftar.']);
        }

        $registration = Registration::where('user_id', $user->id)
            ->where('nisn', $request->nisn)
            ->where('full_name', $request->full_name)
            ->first();

        if (!$registration) {
            return back()->withErrors(['nisn' => 'Data NISN atau nama lengkap tidak cocok dengan email.']);
        }

        // Save progress to session to allow reset
        session(['reset_user_id' => $user->id]);

        return redirect('/siswa/buat-sandi-baru');
    }

    public function showResetPassword()
    {
        if (!session('reset_user_id')) {
            return redirect('/siswa/lupa-password')->withErrors(['email' => 'Silakan lakukan verifikasi data terlebih dahulu.']);
        }
        return Inertia::render('Student/Auth/ResetPassword');
    }

    public function resetPassword(Request $request)
    {
        $userId = session('reset_user_id');
        if (!$userId) {
            return redirect('/siswa/lupa-password');
        }

        $request->validate([
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::find($userId);
        $user->password = Hash::make($request->password);
        $user->save();

        session()->forget('reset_user_id');

        return redirect('/siswa/ganti-password-berhasil');
    }

    public function passwordSuccess()
    {
        return Inertia::render('Student/Auth/PasswordSuccess');
    }

    public function periodClosed()
    {
        return Inertia::render('Student/Auth/PeriodClosed');
    }

    public function showForm()
    {
        if (!$this->isPeriodOpen()) {
            return redirect('/siswa/periode-ditutup');
        }

        $quotas = Quota::all()->map(function ($q) {
            return [
                'value' => $q->id,
                'label' => "{$q->name} (Kuota: {$q->quota_limit}, Sisa: {$q->sisa})"
            ];
        });

        // Prepopulate if session exists
        $temp = session('temp_registration', null);

        return Inertia::render('Student/Auth/Formulir', [
            'tempData' => $temp
        ]);
    }

    public function processForm(Request $request)
    {
        if (!$this->isPeriodOpen()) {
            return redirect('/siswa/periode-ditutup');
        }

        $validated = $request->validate([
            'jurusan' => 'required|in:teknik otomotif,manajemen dan bisnis',
            'nisn' => 'required|digits:10|unique:registrations,nisn',
            'full_name' => 'required|string|max:255',
            'gender' => 'required|in:L,P',
            'birth_place' => 'required|string',
            'birth_date' => 'required|date',
            'religion' => 'required|string',
            'child_order' => 'required|integer|min:1',
            'family_status' => 'required|string',
            'parent_name' => 'required|string',
            'parent_occupation' => 'required|string',
            'parent_status' => 'required|in:Ayah,Ibu,Wali',
            'school_origin' => 'required|string',
            'school_address' => 'required|string',
            'phone_number' => 'required|string',
            'address' => 'required|string',
            'file_kk' => 'required|file|mimes:pdf|max:2048',
            'file_akta' => 'required|file|mimes:pdf|max:2048',
            'file_skhu_skl' => 'required|file|mimes:pdf|max:2048',
            'file_sktm' => 'nullable|file|mimes:pdf|max:2048',
        ]);

        // Auto assign default quota (Umum)
        $defaultQuota = Quota::first();
        $validated['quota_id'] = $defaultQuota ? $defaultQuota->id : 1;

        // Upload files and save paths
        $uploaded = [];
        $files = ['file_kk', 'file_akta', 'file_skhu_skl', 'file_sktm'];

        if (!file_exists(public_path('uploads'))) {
            mkdir(public_path('uploads'), 0777, true);
        }

        foreach ($files as $f) {
            if ($request->hasFile($f)) {
                $file = $request->file($f);
                $filename = time() . '_' . $f . '_' . $file->getClientOriginalName();
                $file->move(public_path('uploads'), $filename);
                $uploaded[$f] = '/uploads/' . $filename;
            } else {
                $uploaded[$f] = null;
            }
        }

        // Merge file paths into validated array
        $payload = array_merge($validated, $uploaded);

        // Save in session
        session(['temp_registration' => $payload]);

        return redirect('/siswa/buat-akun');
    }

    public function showCreateAccount()
    {
        if (!session('temp_registration')) {
            return redirect('/siswa/formulir')->withErrors(['nisn' => 'Silakan isi formulir pendaftaran terlebih dahulu.']);
        }
        return Inertia::render('Student/Auth/BuatAkun');
    }

    public function registerAccount(Request $request)
    {
        $tempData = session('temp_registration');
        if (!$tempData) {
            return redirect('/siswa/formulir');
        }

        $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        // Wrap in single DB transaction
        DB::transaction(function () use ($request, $tempData) {
            // 1. Create user
            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'siswa',
            ]);

            // 2. Generate registration number
            $today = date('Ymd');
            $countToday = Registration::whereDate('created_at', today())->count();
            $autoNumber = str_pad($countToday + 1, 5, '0', STR_PAD_LEFT);
            $regNumber = "REG-{$today}-{$autoNumber}";

            // 3. Create registration
            $registration = Registration::create([
                'user_id' => $user->id,
                'quota_id' => $tempData['quota_id'],
                'registration_number' => $regNumber,
                'nisn' => $tempData['nisn'],
                'full_name' => $tempData['full_name'],
                'jurusan' => $tempData['jurusan'],
                'gender' => $tempData['gender'],
                'birth_place' => $tempData['birth_place'],
                'birth_date' => $tempData['birth_date'],
                'religion' => $tempData['religion'],
                'child_order' => $tempData['child_order'],
                'family_status' => $tempData['family_status'],
                'parent_name' => $tempData['parent_name'],
                'parent_occupation' => $tempData['parent_occupation'],
                'parent_status' => $tempData['parent_status'],
                'school_origin' => $tempData['school_origin'],
                'school_address' => $tempData['school_address'],
                'phone_number' => $tempData['phone_number'],
                'address' => $tempData['address'],
                'verification_status' => 'Menunggu Verifikasi',
                'graduation_status' => 'Menunggu Kelulusan',
            ]);

            // 4. Create document
            Document::create([
                'registration_id' => $registration->id,
                'file_kk' => $tempData['file_kk'],
                'file_akta' => $tempData['file_akta'],
                'file_skhu_skl' => $tempData['file_skhu_skl'],
                'file_sktm' => $tempData['file_sktm'],
            ]);

            // Save details for success page and auto-login
            session(['success_registration_id' => $registration->id]);
            Auth::login($user);
        });

        // Clear temporary data
        session()->forget('temp_registration');

        return redirect('/siswa/pendaftaran-berhasil');
    }

    public function registrationSuccess()
    {
        $regId = session('success_registration_id');
        if (!$regId) {
            // Fallback: check currently logged-in student
            if (Auth::check() && Auth::user()->role === 'siswa' && Auth::user()->registration) {
                $regId = Auth::user()->registration->id;
            } else {
                return redirect('/siswa/login');
            }
        }

        $registration = Registration::with(['quota', 'document'])->findOrFail($regId);

        return Inertia::render('Student/Auth/PendaftaranBerhasil', [
            'registration' => $registration,
        ]);
    }
}
