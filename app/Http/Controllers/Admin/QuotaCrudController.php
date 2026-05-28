<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Quota;
use Inertia\Inertia;

class QuotaCrudController extends Controller
{
    public function index()
    {
        $quotas = Quota::all();
        return Inertia::render('Admin/Crud/Quotas', [
            'quotas' => $quotas
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'quota_limit' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ]);

        Quota::create($validated);

        return back()->with('success', 'Jalur pendaftaran berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $quota = Quota::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'quota_limit' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ]);

        $quota->update($validated);

        return back()->with('success', 'Jalur pendaftaran berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $quota = Quota::findOrFail($id);
        
        // Prevent deletion if there are registrations on this quota track to maintain db integrity
        if ($quota->registrations()->count() > 0) {
            return back()->with('error', 'Jalur pendaftaran tidak dapat dihapus karena sudah memiliki siswa terdaftar.');
        }

        $quota->delete();

        return back()->with('success', 'Jalur pendaftaran berhasil dihapus.');
    }
}
