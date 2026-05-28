<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Post;
use App\Models\Achievement;
use App\Models\Schedule;
use App\Models\Quota;

class LandingPageController extends Controller
{
    public function index()
    {
        // Top 3 announcements for slider
        $announcements = Post::where('type', 'pengumuman')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        // Top 3 news for grid
        $news = Post::where('type', 'berita')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        // Achievements
        $achievements = Achievement::orderBy('year', 'desc')->get();

        return Inertia::render('Guest/Landing', [
            'announcements' => $announcements,
            'news' => $news,
            'achievements' => $achievements,
        ]);
    }

    public function sambutan()
    {
        return Inertia::render('Guest/Sambutan');
    }

    public function visiMisi()
    {
        return Inertia::render('Guest/VisiMisi');
    }

    public function struktur()
    {
        return Inertia::render('Guest/Struktur');
    }

    public function sejarah()
    {
        return Inertia::render('Guest/Sejarah');
    }

    public function beritaAll()
    {
        // All news
        $news = Post::where('type', 'berita')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Guest/BeritaAll', [
            'news' => $news,
        ]);
    }

    public function jadwalSpmb()
    {
        // Chronological ascending sort
        $schedules = Schedule::orderBy('start_date', 'asc')->get();

        return Inertia::render('Guest/JadwalSpmb', [
            'schedules' => $schedules,
        ]);
    }

    public function kuotaPendaftaran()
    {
        // All quotas with registrations count to find sisa (remaining), excluding rejected
        $quotas = Quota::withCount(['registrations' => function ($query) {
            $query->where('verification_status', '!=', 'Berkas Ditolak');
        }])->get()->map(function ($quota) {
            return [
                'id' => $quota->id,
                'name' => $quota->name,
                'quota_limit' => $quota->quota_limit,
                'description' => $quota->description,
                'sisa' => max(0, $quota->quota_limit - $quota->registrations_count)
            ];
        });

        return Inertia::render('Guest/KuotaPendaftaran', [
            'quotas' => $quotas,
        ]);
    }
}
