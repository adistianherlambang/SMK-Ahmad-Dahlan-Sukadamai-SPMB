<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use Inertia\Inertia;

class PostCrudController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $typeFilter = $request->input('type', '');

        $query = Post::query();

        if ($search) {
            $query->where('title', 'like', "%{$search}%");
        }
        if ($typeFilter) {
            $query->where('type', $typeFilter);
        }

        $posts = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Crud/Posts', [
            'posts' => $posts,
            'filters' => [
                'search' => $search,
                'type' => $typeFilter
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:berita,pengumuman',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            if (!file_exists(public_path('uploads/posts'))) {
                mkdir(public_path('uploads/posts'), 0777, true);
            }
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/posts'), $filename);
            $imagePath = '/uploads/posts/' . $filename;
        }

        Post::create([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'content' => $validated['content'],
            'image_path' => $imagePath,
        ]);

        return back()->with('success', 'Berita / Pengumuman berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:berita,pengumuman',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        $imagePath = $post->image_path;
        if ($request->hasFile('image')) {
            // Delete old file if exists
            if ($post->image_path && file_exists(public_path($post->image_path))) {
                @unlink(public_path($post->image_path));
            }

            if (!file_exists(public_path('uploads/posts'))) {
                mkdir(public_path('uploads/posts'), 0777, true);
            }
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/posts'), $filename);
            $imagePath = '/uploads/posts/' . $filename;
        }

        $post->update([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'content' => $validated['content'],
            'image_path' => $imagePath,
        ]);

        return back()->with('success', 'Berita / Pengumuman berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);

        // Delete associated image file
        if ($post->image_path && file_exists(public_path($post->image_path))) {
            @unlink(public_path($post->image_path));
        }

        $post->delete();

        return back()->with('success', 'Berita / Pengumuman berhasil dihapus.');
    }
}
