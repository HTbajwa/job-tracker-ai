<?php

namespace App\Http\Controllers;

use App\Models\AiMatch;
use App\Models\Application;
use App\Services\AiService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AiMatchController extends Controller
{
    public function __construct(protected AiService $aiService)
    {
    }

    /**
     * Generate (or reuse a cached) match score + missing keywords for a
     * given job description against this application.
     */
    public function matchScore(Request $request, Application $application): RedirectResponse
    {
        Gate::authorize('update', $application);

        $request->validate([
            'job_description' => ['required', 'string', 'min:20'],
        ]);

        $jobDescription = $request->input('job_description');
        $hash = hash('sha256', $jobDescription);

        // Rate-limit / cost control: if we've already scored this exact
        // job description for this application, reuse that record
        // instead of calling the AI provider again.
        $existing = $application->aiMatches()
            ->where('job_description_hash', $hash)
            ->latest()
            ->first();

        if ($existing && $existing->match_score !== null) {
            return back();
        }

        $result = $this->aiService->matchScore(
            resumeText: $application->user->resume_text ?? '',
            jobDescription: $jobDescription,
        );

        AiMatch::updateOrCreate(
            [
                'application_id' => $application->id,
                'job_description_hash' => $hash,
            ],
            [
                'job_description' => $jobDescription,
                'match_score' => $result['match_score'],
                'missing_keywords' => $result['missing_keywords'],
            ]
        );

        return back();
    }

    /**
     * Generate (or reuse a cached) cover letter for a given job description.
     */
    public function coverLetter(Request $request, Application $application): RedirectResponse
    {
        Gate::authorize('update', $application);

        $request->validate([
            'job_description' => ['required', 'string', 'min:20'],
        ]);

        $jobDescription = $request->input('job_description');
       $hash = hash('sha256', $jobDescription . '|' . ($application->user->resume_text ?? ''));
        $existing = $application->aiMatches()
            ->where('job_description_hash', $hash)
            ->latest()
            ->first();

        if ($existing && $existing->cover_letter !== null) {
            return back();
        }

        $coverLetter = $this->aiService->coverLetter(
            resumeText: $application->user->resume_text ?? '',
            jobDescription: $jobDescription,
            company: $application->company,
            role: $application->role,
        );

        AiMatch::updateOrCreate(
            [
                'application_id' => $application->id,
                'job_description_hash' => $hash,
            ],
            [
                'job_description' => $jobDescription,
                'cover_letter' => $coverLetter,
            ]
        );

        return back();
    }
}