<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = ['Laravel', 'React', 'WebDev', 'Tutorial', 'PHP', 'JavaScript'];
        foreach ($tags as $tag) {
            Tag::create(['name' => $tag]);
        }
    }
}

