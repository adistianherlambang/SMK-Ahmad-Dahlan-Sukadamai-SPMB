<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Registration;
use App\Models\Document;

class StudentDashboardController extends Controller
{
    private function getStudentRegistration()
    {
        return Registration::with(['quota', 'document'])
            ->where('user_id', Auth::id())
            ->firstOrFail();
    }

    public function index()
    {
        $registration = $this->getStudentRegistration();

        return Inertia::render('Student/Dashboard', [
            'registration' => $registration,
        ]);
    }

    public function dataPendaftaran()
    {
        $registration = $this->getStudentRegistration();

        return Inertia::render('Student/DataPendaftaran', [
            'registration' => $registration,
        ]);
    }

    public function reuploadDocuments(Request $request)
    {
        $registration = $this->getStudentRegistration();

        // Enforce guard: only allow when verification status is rejected
        if ($registration->verification_status !== 'Berkas Ditolak') {
            return back()->with('error', 'Unggah berkas hanya dapat dilakukan jika berkas Anda ditolak.');
        }

        $request->validate([
            'file_kk' => 'nullable|file|mimes:pdf|max:2048',
            'file_akta' => 'nullable|file|mimes:pdf|max:2048',
            'file_skhu_skl' => 'nullable|file|mimes:pdf|max:2048',
            'file_sktm' => 'nullable|file|mimes:pdf|max:2048',
        ]);

        $document = $registration->document;
        if (!$document) {
            $document = new Document();
            $document->registration_id = $registration->id;
        }

        if (!file_exists(public_path('uploads'))) {
            mkdir(public_path('uploads'), 0777, true);
        }

        $files = ['file_kk', 'file_akta', 'file_skhu_skl', 'file_sktm'];
        $updated = false;

        foreach ($files as $f) {
            if ($request->hasFile($f)) {
                // Delete old file if exists
                if ($document->$f && file_exists(public_path($document->$f))) {
                    @unlink(public_path($document->$f));
                }

                $file = $request->file($f);
                $filename = time() . '_re_' . $f . '_' . $file->getClientOriginalName();
                $file->move(public_path('uploads'), $filename);
                $document->$f = '/uploads/' . $filename;
                $updated = true;
            }
        }

        if ($updated) {
            $document->save();

            // Reset status back to Menunggu Verifikasi and clear rejection reason!
            $registration->verification_status = 'Menunggu Verifikasi';
            $registration->rejection_reason = null;
            $registration->save();

            return back()->with('success', 'Berkas berhasil dikirim ulang. Silakan tunggu pemeriksaan ulang oleh panitia.');
        }

        return back()->with('error', 'Tidak ada berkas baru yang diunggah.');
    }

    public function downloadPdf()
    {
        ini_set('memory_limit', '512M');
        ini_set('max_execution_time', '300');

        $registration = $this->getStudentRegistration();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('print_bukti', ['registration' => $registration])
            ->setPaper('a4', 'portrait');

        $filename = ($registration->graduation_status === 'Diterima' ? 'bukti-penerimaan-' : 'bukti-pendaftaran-') . $registration->registration_number . '.pdf';

        return $pdf->stream($filename);
    }
}
