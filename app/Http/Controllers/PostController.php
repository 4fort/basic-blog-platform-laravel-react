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
        $posts = Post::with('user')->latest()->get();
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
        ]);

        Post::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'body' => $request->body,
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

        return redirect()->route('posts.index')->with('success', 'Post updated successfully.');
    }
    public function show(Post $post)
    {
        $post->load('user');

        return response()->json(['post' => $post]);

    }

    public function destroy(Post $post)
    {
        $post->delete();
        return redirect()->route('posts.index')->with('success', 'Post deleted.');
    }
}
