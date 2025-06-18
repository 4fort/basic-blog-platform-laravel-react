<?php

use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/tags', [TagController::class, 'index'])->name('tags.index');
})->name('tags');
