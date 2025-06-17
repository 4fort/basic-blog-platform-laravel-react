<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with(['user', 'comments.user'])->latest()->get();
        return inertia('home/home', ['posts' => $posts]);
    }
    public function create()
    {
        return;
    }
    public function store(Request $request)
{
    $request->validate([
        'title' => 'nullable|string|max:255',
        'body' => 'required|string',
        'image' => 'nullable|image|max:2048', // max 2MB
    ]);

    $imagePath = null;

    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('posts', 'public');
    }

    Post::create([
        'user_id' => Auth::id(),
        'title' => $request->title,
        'body' => $request->body,
        'image_path' => $imagePath,
    ]);

    return redirect()->route('posts.index')->with('success', 'Post created successfully.');
}
    public function update(Request $request, Post $post)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'body' => 'required|string',
        ]);

        $post->update([
            'title' => $request->title,
            'body' => $request->body,
        ]);

        if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('posts', 'public');
        $post->image_path = $imagePath;
        }

        return redirect()->back()->with('success', 'Post updated successfully.');
    }

    public function show(Post $post)
    {
        $post->load(['user', 'comments.user']);

        return inertia('home/post', ['post' => $post]);
    }
    public function destroy(Post $post)
    {
        $post->delete();
        return redirect()->route('posts.index')->with('success', 'Post deleted.');
    }
}
