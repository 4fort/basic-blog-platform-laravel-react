<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsTable extends Migration
{
    public function up()
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('title')->nullable(); // ✅ title is nullable
        $table->text('body');                // ✅ body is required (default)
        $table->integer('relevance');
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
}
