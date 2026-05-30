<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Quota;
use App\Models\Registration;
use App\Models\Document;

class AdminDashboardController extends Controller
{
    public function showLogin()
    {
        if (Auth::check() && Auth::user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        return Inertia::render('Admin/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            if ($user->role === 'admin') {
                $request->session()->regenerate();
                return redirect()->intended(route('admin.dashboard'));
            }
            Auth::logout();
            return back()->withErrors(['email' => 'Bukan akun administrator.']);
        }

        return back()->withErrors([
            'email' => 'Email atau password administrator salah.',
        ]);
    }

    public function index(Request $request)
    {
        $yearFilter = $request->input('year', date('Y'));
        $quotaFilter = $request->input('quota_id', '');
        $search = $request->input('search', '');

        // Build Query
        $query = Registration::with(['quota', 'document']);

        if ($yearFilter) {
            $query->whereYear('created_at', $yearFilter);
        }
        if ($quotaFilter) {
            $query->where('quota_id', $quotaFilter);
        }
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('registration_number', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%");
            });
        }

        // Calculate statistics based on current year/quota filters (unaffected by search)
        $statsQuery = Registration::query();
        if ($yearFilter) {
            $statsQuery->whereYear('created_at', $yearFilter);
        }
        if ($quotaFilter) {
            $statsQuery->where('quota_id', $quotaFilter);
        }

        $stats = [
            'total' => (clone $statsQuery)->count(),
            'menunggu' => (clone $statsQuery)->where('verification_status', 'Menunggu Verifikasi')->count(),
            'terverifikasi' => (clone $statsQuery)->where('verification_status', 'Terverifikasi')->where('graduation_status', 'Menunggu Kelulusan')->count(),
            'ditolak' => (clone $statsQuery)->where('verification_status', 'Berkas Ditolak')->count(),
            'lulus' => (clone $statsQuery)->where('graduation_status', 'Diterima')->count(),
            'tidak_lulus' => (clone $statsQuery)->where('graduation_status', 'Tidak Lulus')->count(),
        ];

        $registrations = $query->orderBy('created_at', 'desc')->get();
        $quotas = Quota::all();

        // Get unique years of registrations for filter dropdown
        $years = Registration::selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();
            
        if (empty($years)) {
            $years = [date('Y')];
        }

        return Inertia::render('Admin/Dashboard', [
            'registrations' => $registrations,
            'quotas' => $quotas,
            'years' => $years,
            'stats' => $stats,
            'filters' => [
                'year' => $yearFilter,
                'quota_id' => $quotaFilter,
                'search' => $search
            ]
        ]);
    }

    public function verifikasiBerkas(Request $request)
    {
        $yearFilter = $request->input('year', date('Y'));
        $quotaFilter = $request->input('quota_id', '');
        $search = $request->input('search', '');

        $query = Registration::with(['quota', 'document'])->where('verification_status', 'Menunggu Verifikasi');

        if ($yearFilter) {
            $query->whereYear('created_at', $yearFilter);
        }
        if ($quotaFilter) {
            $query->where('quota_id', $quotaFilter);
        }
        if ($search) {
            $query->where('full_name', 'like', "%{$search}%");
        }

        $applicants = $query->orderBy('created_at', 'desc')->get();
        $quotas = Quota::all();
        
        $years = Registration::selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->pluck('year')
            ->toArray();
        if (empty($years)) $years = [date('Y')];

        return Inertia::render('Admin/VerifikasiBerkas', [
            'applicants' => $applicants,
            'quotas' => $quotas,
            'years' => $years,
            'filters' => [
                'year' => $yearFilter,
                'quota_id' => $quotaFilter,
                'search' => $search
            ]
        ]);
    }

    public function prosesVerifikasi(Request $request, $id)
    {
        $registration = Registration::findOrFail($id);
        $action = $request->input('action');

        if ($action === 'approve' || $action === 'verify') {
            $registration->verification_status = 'Terverifikasi';
            $registration->rejection_reason = null;
            $registration->save();
            return back()->with('success', "Berkas dari {$registration->full_name} berhasil diverifikasi.");
        } 
        
        if ($action === 'reject') {
            $request->validate(['reason' => 'required|string']);
            $registration->verification_status = 'Berkas Ditolak';
            $registration->rejection_reason = $request->input('reason');
            $registration->graduation_status = 'Menunggu Kelulusan';
            $registration->save();
            return back()->with('success', "Berkas dari {$registration->full_name} ditolak.");
        } 
        
        if ($action === 'undo') {
            $registration->verification_status = 'Menunggu Verifikasi';
            $registration->graduation_status = 'Menunggu Kelulusan';
            $registration->rejection_reason = null;
            $registration->save();
            return back()->with('success', "Batal verifikasi {$registration->full_name} berhasil.");
        } 
        
        if ($action === 'delete') {
            DB::transaction(function () use ($registration) {
                // Delete file uploads
                $doc = $registration->document;
                if ($doc) {
                    $files = ['file_kk', 'file_akta', 'file_skhu_skl', 'file_sktm'];
                    foreach ($files as $f) {
                        if ($doc->$f && file_exists(public_path($doc->$f))) {
                            @unlink(public_path($doc->$f));
                        }
                    }
                    $doc->delete();
                }

                // Delete associated user
                $user = User::find($registration->user_id);
                if ($user) $user->delete();

                // Delete registration
                $registration->delete();
            });
            
            return back()->with('success', "Data calon siswa berhasil dihapus secara permanen.");
        }

        return back()->with('error', 'Aksi tidak dikenal.');
    }

    public function penentuanKelulusan(Request $request)
    {
        $yearFilter = $request->input('year', date('Y'));
        $quotaFilter = $request->input('quota_id', '');
        $statusFilter = $request->input('status', '');
        $search = $request->input('search', '');

        // Only verified applicants can have graduation determined
        $query = Registration::with(['quota', 'document'])->where('verification_status', 'Terverifikasi');

        if ($yearFilter) {
            $query->whereYear('created_at', $yearFilter);
        }
        if ($quotaFilter) {
            $query->where('quota_id', $quotaFilter);
        }
        if ($statusFilter) {
            $query->where('graduation_status', $statusFilter);
        }
        if ($search) {
            $query->where('full_name', 'like', "%{$search}%");
        }

        $applicants = $query->orderBy('created_at', 'desc')->get();
        $quotas = Quota::all();
        
        $years = Registration::selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->pluck('year')
            ->toArray();
        if (empty($years)) $years = [date('Y')];

        return Inertia::render('Admin/PenentuanKelulusan', [
            'applicants' => $applicants,
            'quotas' => $quotas,
            'years' => $years,
            'filters' => [
                'year' => $yearFilter,
                'quota_id' => $quotaFilter,
                'status' => $statusFilter,
                'search' => $search
            ]
        ]);
    }

    public function prosesKelulusan(Request $request, $id)
    {
        $registration = Registration::findOrFail($id);
        $action = $request->input('action');

        if ($action === 'accept') {
            $registration->graduation_status = 'Diterima';
            $registration->save();
            return back()->with('success', "{$registration->full_name} berhasil dinyatakan Diterima.");
        }

        if ($action === 'reject') {
            $registration->graduation_status = 'Tidak Lulus';
            $registration->save();
            return back()->with('success', "{$registration->full_name} dinyatakan Tidak Lulus.");
        }

        if ($action === 'undo') {
            $registration->graduation_status = 'Menunggu Kelulusan';
            $registration->save();
            return back()->with('success', "Batal status kelulusan {$registration->full_name} berhasil.");
        }

        if ($action === 'undo_verif') {
            $registration->verification_status = 'Menunggu Verifikasi';
            $registration->graduation_status = 'Menunggu Kelulusan';
            $registration->rejection_reason = null;
            $registration->save();
            return back()->with('success', "Status berkas {$registration->full_name} berhasil dikembalikan ke antrean verifikasi.");
        }

        if ($action === 'delete') {
            DB::transaction(function () use ($registration) {
                // Delete files
                $doc = $registration->document;
                if ($doc) {
                    $files = ['file_kk', 'file_akta', 'file_skhu_skl', 'file_sktm'];
                    foreach ($files as $f) {
                        if ($doc->$f && file_exists(public_path($doc->$f))) {
                            @unlink(public_path($doc->$f));
                        }
                    }
                    $doc->delete();
                }

                $user = User::find($registration->user_id);
                if ($user) $user->delete();

                $registration->delete();
            });

            return back()->with('success', "Data calon siswa berhasil dihapus secara permanen.");
        }

        return back()->with('error', 'Aksi tidak dikenal.');
    }
}
