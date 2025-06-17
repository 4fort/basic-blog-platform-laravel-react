<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

/* Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
}); */

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
// require __DIR__.'/home.php';
require __DIR__.'/posts.php';
require __DIR__.'/comments.php';
