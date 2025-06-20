<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with(['user', 'comments.user', 'tags'])->latest()->get();
        $posts->each(function ($post) {
            $post->tags->transform(function ($tag) {
                return [
                    'id' => $tag->id,
                    'name' => $tag->name,
                ];
            });
        });

        return inertia('posts/home', ['posts' => $posts]);
    }
    public function create()
    {
        $tags = Tag::all();

        return inertia('posts/create', [
            'tags' => $tags,
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'body' => 'required|string',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id',
        ]);

        $post = Post::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'body' => $request->body,
        ]);

        $post->tags()->sync($request->tags ?? []);

        return redirect()->route('posts.index')->with('success', 'Post created successfully.');
    }
    public function edit(Post $post)
    {
        if ($post->user_id !== Auth::id()) {
            return redirect()->route('posts.index')->with('error', 'You do not have permission to edit this post.');
        }
        $post->load('tags');
        $tags = Tag::all();
        return inertia('posts/edit', [
            'post' => $post,
            'tags' => $tags,
        ]);
    }
    public function update(Request $request, Post $post)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'body' => 'required|string',
            'tags' => 'array',
            'tags.*' => 'integer|exists:tags,id',
        ]);

        $post->update([
            'title' => $request->title,
            'body' => $request->body,
        ]);

        $post->tags()->sync($request->tags ?? []);

        return redirect()->route('posts.show', $post->id)->with('success', 'Post updated successfully.');
    }
    public function show(Post $post)
    {
        $post->load(['user', 'comments.user', 'tags']);
        $post->tags->transform(function ($tag) {
            return [
                'id' => $tag->id,
                'name' => $tag->name,
            ];
        });

        return inertia('posts/post', ['post' => $post]);
    }
    public function destroy(Post $post)
    {
        $post->delete();
        return redirect()->route('posts.index')->with('success', 'Post deleted.');
    }

    // Image upload
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $image = $request->file('image');
        $path = $image->store('post-images', 'public');
        $url = asset('storage/' . $path);

        return response()->json(['url' => $url]);
    }
    public function deleteImage(Request $request)
    {
        $request->validate([
            'url' => 'required|string',
        ]);

        $requestUrl = $request->url;
        $parsedUrl = parse_url($requestUrl);
        $pathFromUrl = ltrim($parsedUrl['path'], '/');

        $storagePath = preg_replace('#^storage/#', '', $pathFromUrl);

        if (Storage::disk('public')->exists($storagePath)) {
            Storage::disk('public')->delete($storagePath);
            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'message' => 'Image not found at path: ' . $storagePath], 404);
    }
}
