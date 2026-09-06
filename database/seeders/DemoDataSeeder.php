<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
       $demoUser = User::firstOrCreate(
    ['email' => 'demo@jobtracker.test'],
    [
        'name' => 'Demo Recruiter',
        'password' => Hash::make('demo1234'),
        'resume_text' => 'Full-stack developer skilled in Laravel, React, Inertia.js, Tailwind CSS, and MySQL/SQLite. Experience building REST APIs, authentication systems, and AI-integrated applications. Familiar with Git, GitHub Actions, and deploying to cloud platforms.',
        'email_verified_at' => now(),
    ]
);

        $samples = [
            ['company' => 'Google', 'role' => 'Frontend Engineer', 'status' => 'interview', 'applied_date' => now()->subDays(10)],
            ['company' => 'Shopify', 'role' => 'Full-Stack Developer', 'status' => 'applied', 'applied_date' => now()->subDays(5)],
            ['company' => 'Stripe', 'role' => 'Laravel Developer', 'status' => 'offer', 'applied_date' => now()->subDays(20)],
            ['company' => 'Local Startup', 'role' => 'WordPress Developer', 'status' => 'rejected', 'applied_date' => now()->subDays(25)],
            ['company' => 'Automattic', 'role' => 'React Developer', 'status' => 'applied', 'applied_date' => now()->subDays(2)],
        ];

        foreach ($samples as $sample) {
            Application::firstOrCreate(
                [
                    'user_id' => $demoUser->id,
                    'company' => $sample['company'],
                    'role' => $sample['role'],
                ],
                [
                    'status' => $sample['status'],
                    'applied_date' => $sample['applied_date'],
                    'job_url' => 'https://example.com/careers',
                    'notes' => 'Sample application for demo purposes.',
                ]
            );
        }
    }
}