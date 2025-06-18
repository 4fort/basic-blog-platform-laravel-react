<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            'Laravel', 'React', 'WebDev', 'Tutorial', 'PHP', 'JavaScript',
            'CSS', 'HTML', 'TypeScript', 'API', 'Backend', 'Frontend',
            'DevOps', 'Database', 'Security', 'Testing', 'UX/UI', 'Open Source',
            'Cloud', 'Docker', 'Git', 'Performance', 'Mobile', 'Design Patterns',
            'AI', 'Machine Learning',
            // Non-technology topics
            'Career', 'Productivity', 'Freelancing', 'Remote Work', 'Work-Life Balance',
            'Learning', 'Motivation', 'Community', 'Events', 'News', 'Reviews',
            'Opinion', 'Inspiration', 'Interviews', 'Case Study', 'Trends',
            'Personal Development', 'Collaboration', 'Open Discussion',
            'Mental Health', 'Creativity', 'Storytelling', 'Book Reviews', 'Movie Reviews',
            'Productivity Hacks', 'Time Management', 'Networking', 'Leadership', 'Teamwork',
            'Communication', 'Public Speaking', 'Mindfulness', 'Habits', 'Goal Setting',
            'Success Stories', 'Failure Stories', 'Challenges', 'Advice', 'Resources'
        ];
        foreach ($tags as $tag) {
            Tag::create(['name' => $tag]);
        }
    }
}

