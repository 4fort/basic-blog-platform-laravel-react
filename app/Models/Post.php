<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    public function comments()
{
    return $this->hasMany(Comment::class);
}
    use HasFactory;

    protected $fillable = ['user_id', 'title', 'body'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tags()
{
    return $this->belongsToMany(Tag::class);
}

}

