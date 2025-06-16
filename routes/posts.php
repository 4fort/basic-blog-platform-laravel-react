<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;

Route::middleware('auth')->group(function () {
    Route::resource('posts', PostController::class);

    Route::post('posts/{post}/comments', [CommentController::class, 'store'])->name('posts.comments.store');
    Route::get('posts/{post}/comments', [CommentController::class, 'index'])->name('posts.comments.index');
});

