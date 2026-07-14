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
use App\Models\Classroom;
use App\Models\Attendance;

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

        if (Auth::attempt($credentials, true)) {
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

        $stats = Registration::selectRaw("
            COUNT(*) as total,
            SUM(verification_status = 'Menunggu Verifikasi') as menunggu,
            SUM(verification_status = 'Berkas Ditolak') as ditolak,
            SUM(graduation_status = 'Diterima') as lulus,
            SUM(graduation_status = 'Tidak Lulus') as tidak_lulus,
            SUM(verification_status = 'Terverifikasi' AND graduation_status = 'Menunggu Kelulusan') as terverifikasi
        ")
        ->when($yearFilter, fn($q) => $q->whereYear('created_at', $yearFilter))
        ->when($quotaFilter, fn($q) => $q->where('quota_id', $quotaFilter))
        ->first();

        $stats = [
            'total'         => (int) $stats->total,
            'menunggu'      => (int) $stats->menunggu,
            'terverifikasi' => (int) $stats->terverifikasi,
            'ditolak'       => (int) $stats->ditolak,
            'lulus'         => (int) $stats->lulus,
            'tidak_lulus'   => (int) $stats->tidak_lulus,
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
            
            if (empty($registration->nis)) {
                $latestNis = Registration::whereNotNull('nis')
                    ->orderByRaw('CAST(nis AS UNSIGNED) DESC')
                    ->value('nis');
                
                $nextNisNum = $latestNis ? (intval($latestNis) + 1) : 435;
                $registration->nis = sprintf('%05d', $nextNisNum);
            }

            $registration->save();
            return back()->with('success', "{$registration->full_name} berhasil dinyatakan Diterima dengan NIS {$registration->nis}.");
        }

        if ($action === 'reject') {
            $registration->graduation_status = 'Tidak Lulus';
            $registration->save();
            return back()->with('success', "{$registration->full_name} dinyatakan Tidak Lulus.");
        }

        if ($action === 'undo') {
            $registration->graduation_status = 'Menunggu Kelulusan';
            $registration->nis = null;
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

    public function siswaIndex(Request $request)
    {
        $jurusanFilter = $request->input('jurusan', '');
        $kelasFilter   = $request->input('kelas', '');
        $search        = $request->input('search', '');

        $query = Registration::with(['quota', 'classroom'])->where('graduation_status', 'Diterima');

        if ($jurusanFilter) {
            $query->where('jurusan', $jurusanFilter);
        }
        if ($kelasFilter) {
            $query->where('kelas', $kelasFilter);
        }
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%");
            });
        }

        $students = $query->orderBy('kelas', 'asc')->orderBy('full_name', 'asc')->get();

        // Group: jurusan -> kelas -> students
        $grouped = [];
        foreach ($students as $student) {
            $j = $student->jurusan ?? 'Tidak Diketahui';
            $k = $student->kelas   ?? 'Belum Ditentukan';
            $grouped[$j][$k][] = $student;
        }

        // All classrooms for the assign modal
        $classrooms = Classroom::orderBy('jurusan')->orderBy('kelas_level')->orderBy('name')->get();

        return Inertia::render('Admin/Siswa', [
            'students'   => $students,
            'grouped'    => $grouped,
            'classrooms' => $classrooms,
            'filters'    => [
                'jurusan' => $jurusanFilter,
                'kelas'   => $kelasFilter,
                'search'  => $search,
            ]
        ]);
    }

    public function siswaUpdate(Request $request, $id)
    {
        $registration = Registration::findOrFail($id);

        $request->validate([
            'nis'       => 'required|string|max:20|unique:registrations,nis,' . $id,
            'jurusan'   => 'required|in:teknik otomotif,manajemen dan bisnis',
            'kelas'     => 'nullable|in:X,XI,XII',
            'full_name' => 'required|string|max:255',
            'nisn'      => 'required|digits:10|unique:registrations,nisn,' . $id,
        ]);

        $registration->update([
            'nis'       => $request->nis,
            'jurusan'   => $request->jurusan,
            'kelas'     => $request->kelas,
            'full_name' => $request->full_name,
            'nisn'      => $request->nisn,
        ]);

        return back()->with('success', 'Data siswa berhasil diperbarui.');
    }

    public function siswaAbsensiPdf(Request $request)
    {
        $classroomId = $request->input('classroom_id');
        $mapel       = $request->input('mapel', '');

        $classroom = Classroom::findOrFail($classroomId);
        $students  = Registration::where('graduation_status', 'Diterima')
            ->where('classroom_id', $classroomId)
            ->orderBy('full_name', 'asc')
            ->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('print_absensi', [
            'students'  => $students,
            'jurusan'   => $classroom->jurusan,
            'kelas'     => $classroom->name,
            'mapel'     => $mapel,
        ]);

        return $pdf->download('Absensi_Kelas_' . str_replace(' ', '_', $classroom->name) . '.pdf');
    }

    public function siswaAbsensiMajorPdf(Request $request)
    {
        $request->validate([
            'jurusan'     => 'required|in:teknik otomotif,manajemen dan bisnis',
            'kelas_level' => 'required|string',
        ]);

        $jurusan = $request->input('jurusan');
        $level   = $request->input('kelas_level');

        $query = Classroom::where('jurusan', $jurusan);
        if ($level !== 'all') {
            $query->where('kelas_level', $level);
        }
        $classrooms = $query->orderBy('kelas_level')->orderBy('name')->get();

        // Load all students for these classrooms in one query, grouped by classroom_id
        $classroomIds = $classrooms->pluck('id');
        $allStudents = Registration::where('graduation_status', 'Diterima')
            ->whereIn('classroom_id', $classroomIds)
            ->orderBy('full_name', 'asc')
            ->get()
            ->groupBy('classroom_id');

        $classroomsData = [];
        foreach ($classrooms as $classroom) {
            $classroomsData[] = [
                'classroom' => $classroom,
                'students'  => $allStudents->get($classroom->id, collect()),
            ];
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('print_absensi_major', [
            'classroomsData' => $classroomsData,
            'jurusan'        => $jurusan,
            'kelas_level'    => $level,
        ]);

        $fileName = 'Absensi_Jurusan_' . str_replace(' ', '_', $jurusan) . '_Tingkat_' . $level . '.pdf';
        return $pdf->download($fileName);
    }

    // ── Absensi (classroom-based) ─────────────────────────────────────────

    public function absensiIndex(Request $request)
    {
        // Group classrooms by jurusan for display
        $classrooms = Classroom::orderBy('jurusan')->orderBy('kelas_level')->orderBy('name')->get();

        // Add student count to each classroom
        $classrooms->each(function ($c) {
            $c->student_count = Registration::where('graduation_status', 'Diterima')
                ->where('classroom_id', $c->id)
                ->count();
        });

        return Inertia::render('Admin/Absensi', [
            'classrooms' => $classrooms,
        ]);
    }

    public function absensiShow(Request $request, $classroomId)
    {
        $classroom = Classroom::findOrFail($classroomId);
        $date      = $request->input('date', date('Y-m-d'));

        $students = Registration::where('graduation_status', 'Diterima')
            ->where('classroom_id', $classroomId)
            ->orderBy('full_name', 'asc')
            ->get();

        $studentIds  = $students->pluck('id')->toArray();
        $attendances = Attendance::where('date', $date)
            ->whereIn('registration_id', $studentIds)
            ->pluck('status', 'registration_id')
            ->toArray();

        return Inertia::render('Admin/AbsensiKelas', [
            'classroom'   => $classroom,
            'students'    => $students,
            'attendances' => (object) $attendances,
            'date'        => $date,
        ]);
    }

    public function absensiSave(Request $request, $classroomId)
    {
        $request->validate([
            'date'    => 'required|date',
            'records' => 'required|array',
        ]);

        $date    = $request->date;
        $records = $request->records;

        foreach ($records as $regId => $status) {
            if (!in_array($status, ['Hadir', 'Sakit', 'Izin', 'Alpa'])) {
                continue;
            }
            Attendance::updateOrCreate(
                ['registration_id' => $regId, 'date' => $date],
                ['status' => $status]
            );
        }

        return back()->with('success', 'Absensi berhasil disimpan.');
    }

    // ── Classroom CRUD ────────────────────────────────────────────────────

    public function classroomStore(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:100',
            'jurusan'     => 'required|in:teknik otomotif,manajemen dan bisnis',
            'kelas_level' => 'required|in:X,XI,XII',
        ]);

        Classroom::create([
            'name'        => $request->name,
            'jurusan'     => $request->jurusan,
            'kelas_level' => $request->kelas_level,
        ]);

        return back()->with('success', 'Kelas berhasil ditambahkan.');
    }

    public function classroomDelete($id)
    {
        $classroom = Classroom::findOrFail($id);
        // Unlink students
        Registration::where('classroom_id', $id)->update(['classroom_id' => null]);
        $classroom->delete();

        return back()->with('success', 'Kelas berhasil dihapus.');
    }

    // ── Batch Assign Students to Classroom ───────────────────────────────

    public function siswaAssignClassroom(Request $request)
    {
        $request->validate([
            'student_ids'  => 'required|array',
            'student_ids.*'=> 'exists:registrations,id',
            'classroom_id' => 'required|exists:classrooms,id',
        ]);

        Registration::whereIn('id', $request->student_ids)
            ->update(['classroom_id' => $request->classroom_id]);

        $count = count($request->student_ids);
        return back()->with('success', "{$count} siswa berhasil dimasukkan ke kelas.");
    }

    public function siswaAssignTingkat(Request $request)
    {
        $request->validate([
            'student_ids'   => 'required|array',
            'student_ids.*' => 'exists:registrations,id',
            'kelas'         => 'nullable|in:X,XI,XII',
        ]);

        Registration::whereIn('id', $request->student_ids)
            ->update(['kelas' => $request->kelas]);

        $count = count($request->student_ids);
        return back()->with('success', "Tingkat {$count} siswa berhasil diperbarui.");
    }

    public function siswaBatchDelete(Request $request)
    {
        $request->validate([
            'student_ids'   => 'required|array',
            'student_ids.*' => 'exists:registrations,id',
        ]);

        // Delete related documents first to prevent FK issues if any, or cascade handles it. Cascades handle it.
        Registration::whereIn('id', $request->student_ids)->delete();

        $count = count($request->student_ids);
        return back()->with('success', "{$count} siswa berhasil dihapus.");
    }
}
