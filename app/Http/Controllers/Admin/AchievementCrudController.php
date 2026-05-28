<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Achievement;
use Inertia\Inertia;

class AchievementCrudController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $yearFilter = $request->input('year', '');

        $query = Achievement::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('student_name', 'like', "%{$search}%");
            });
        }
        if ($yearFilter) {
            $query->where('year', $yearFilter);
        }

        $achievements = $query->orderBy('year', 'desc')->get();

        $years = Achievement::select('year')->distinct()->orderBy('year', 'desc')->pluck('year')->toArray();

        return Inertia::render('Admin/Crud/Achievements', [
            'achievements' => $achievements,
            'years' => $years,
            'filters' => [
                'search' => $search,
                'year' => $yearFilter
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'student_name' => 'required|string|max:255',
            'year' => 'required|integer|min:2000|max:' . (date('Y') + 1),
            'image' => 'required|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            if (!file_exists(public_path('uploads/achievements'))) {
                mkdir(public_path('uploads/achievements'), 0777, true);
            }
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/achievements'), $filename);
            $imagePath = '/uploads/achievements/' . $filename;
        }

        Achievement::create([
            'title' => $validated['title'],
            'student_name' => $validated['student_name'],
            'year' => $validated['year'],
            'image_path' => $imagePath,
        ]);

        return back()->with('success', 'Prestasi siswa berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $achievement = Achievement::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'student_name' => 'required|string|max:255',
            'year' => 'required|integer|min:2000|max:' . (date('Y') + 1),
            'image' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        $imagePath = $achievement->image_path;
        if ($request->hasFile('image')) {
            // Delete old file if exists
            if ($achievement->image_path && file_exists(public_path($achievement->image_path))) {
                @unlink(public_path($achievement->image_path));
            }

            if (!file_exists(public_path('uploads/achievements'))) {
                mkdir(public_path('uploads/achievements'), 0777, true);
            }
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/achievements'), $filename);
            $imagePath = '/uploads/achievements/' . $filename;
        }

        $achievement->update([
            'title' => $validated['title'],
            'student_name' => $validated['student_name'],
            'year' => $validated['year'],
            'image_path' => $imagePath,
        ]);

        return back()->with('success', 'Prestasi siswa berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $achievement = Achievement::findOrFail($id);

        // Delete associated image file
        if ($achievement->image_path && file_exists(public_path($achievement->image_path))) {
            @unlink(public_path($achievement->image_path));
        }

        $achievement->delete();

        return back()->with('success', 'Prestasi siswa berhasil dihapus.');
    }
}
