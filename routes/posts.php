<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;

Route::middleware('auth', 'verified')->group(function () {
    Route::resource('posts', PostController::class);

    Route::get('posts', [PostController::class, 'index'])->name('posts.index');
    Route::post('posts/{post}/comments', [CommentController::class, 'store'])->name('posts.comments.store');
    Route::get('posts/{post}/comments', [CommentController::class, 'index'])->name('posts.comments.index');
    Route::get('post/{post}', [PostController::class, 'show'])->name('posts.show');
    Route::put('posts/{post}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
    Route::post('post/image', [PostController::class, 'uploadImage'])->name('posts.image.upload');
    Route::delete('post/image', [PostController::class, 'deleteImage'])->name('posts.image.delete');
})->name('posts');

