<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Schedule;
use Inertia\Inertia;

class ScheduleCrudController extends Controller
{
    public function index()
    {
        $schedules = Schedule::orderBy('start_date', 'asc')->get();
        return Inertia::render('Admin/Crud/Schedules', [
            'schedules' => $schedules
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        Schedule::create($validated);

        return back()->with('success', 'Jadwal kegiatan berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $schedule = Schedule::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $schedule->update($validated);

        return back()->with('success', 'Jadwal kegiatan berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();

        return back()->with('success', 'Jadwal kegiatan berhasil dihapus.');
    }
}
