<?php

namespace Database\Factories;

use App\Models\Application;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationFactory extends Factory
{
    protected $model = Application::class;

    public function definition(): array
    {
        $companies = [
            'Google', 'Shopify', 'Stripe', 'Automattic', 'GitLab', 'Vercel',
            'Netlify', 'Figma', 'Notion', 'Linear', 'Zapier', 'Basecamp',
            'DigitalOcean', 'Cloudflare', 'Twilio', 'HashiCorp', 'Canva',
            'Airtable', 'Postman', 'Retool', 'Local Startup', 'Freelance Client',
        ];

        $roles = [
            'Frontend Engineer', 'Backend Developer', 'Full-Stack Developer',
            'Laravel Developer', 'React Developer', 'WordPress Developer',
            'Software Engineer', 'Junior Developer', 'Web Developer',
        ];

        $appliedDate = $this->faker->dateTimeBetween('-60 days', 'now');

        return [
            'company' => $this->faker->randomElement($companies),
            'role' => $this->faker->randomElement($roles),
            'status' => $this->faker->randomElement(['applied', 'applied', 'applied', 'interview', 'offer', 'rejected']),
            'applied_date' => $appliedDate,
            'job_url' => $this->faker->boolean(70) ? $this->faker->url() : null,
            'notes' => $this->faker->boolean(40) ? $this->faker->sentence() : null,
            'follow_up_date' => $this->faker->boolean(30)
                ? $this->faker->dateTimeBetween($appliedDate, '+14 days')
                : null,
        ];
    }
}