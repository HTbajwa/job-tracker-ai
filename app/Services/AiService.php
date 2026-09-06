<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class AiService
{
    protected string $apiKey;

    protected string $model;

    public function __construct()
    {
        $this->apiKey = (string) config('services.groq.key');
        $this->model = (string) config('services.groq.model', 'openai/gpt-oss-120b');
    }

    /**
     * ***********************COMPARE MAtch percentage and give results*************************************.
    
     * @return array{match_score: int, missing_keywords: array<int, string>}
     */
    public function matchScore(string $resumeText, string $jobDescription): array
    {
        $prompt = <<<PROMPT
            You are an ATS-style resume matcher. Compare the CANDIDATE PROFILE
            against the JOB DESCRIPTION below and respond with ONLY a raw JSON
            object (no markdown fences, no commentary) in exactly this shape:

            {"match_score": <integer 0-100>, "missing_keywords": ["keyword1", "keyword2"]}

            - match_score: how well the candidate profile matches the job description.
            - missing_keywords: important skills/keywords from the job description
              that are absent from the candidate profile (max 10 items).

            CANDIDATE PROFILE:
            {$resumeText}

            JOB DESCRIPTION:
            {$jobDescription}
            PROMPT;

        $data = $this->generateJson($prompt);

        return [
            'match_score' => (int) ($data['match_score'] ?? 0),
            'missing_keywords' => array_values((array) ($data['missing_keywords'] ?? [])),
        ];
    }

//    ***************************Short Cover letter****************************************
    public function coverLetter(string $resumeText, string $jobDescription, string $company, string $role): string
    {
        $prompt = <<<PROMPT
            Write a short, tailored cover letter (max 200 words, 3 short
            paragraphs, no placeholders like [Your Name]) for the role below.
            Use a confident, natural tone — not generic corporate filler.
            Respond with ONLY the cover letter text, nothing else.

            COMPANY: {$company}
            ROLE: {$role}

            CANDIDATE PROFILE:
            {$resumeText}

            JOB DESCRIPTION:
            {$jobDescription}
            PROMPT;

        return trim($this->generateText($prompt));
    }

//   *************************Generate one two line with aggregated data that providing AI instead of hellucination**************
     public function applicationInsights(string $summaryInput): string
    {
        $prompt = <<<PROMPT
            You are analyzing one person's job application history. Based on
            the aggregated data below, write ONE short, specific, encouraging
            insight (max 2 sentences) about a pattern in their applications —
            e.g. which type of role gets more responses. If there isn't
            enough data for a confident pattern, say so briefly instead of
            inventing one. Respond with ONLY the insight text.

            DATA:
            {$summaryInput}
            PROMPT;

        return trim($this->generateText($prompt));
    }

    /**
     *****************string ko json smjh k php array me convert******************
     */
    protected function generateJson(string $prompt): array
    {
        $text = $this->generateText($prompt, jsonMode: true);

       
        $text = preg_replace('/^```(?:json)?|```$/m', '', trim($text));

        $decoded = json_decode(trim($text), true);

        if (! is_array($decoded)) {
            Log::warning('AiService: could not parse JSON response', ['raw' => $text]);

            return [];
        }

        return $decoded;
    }

    /**
     *********************Asli Groq ko phone call karo**************************
     */
    protected function generateText(string $prompt, bool $jsonMode = false): string
    {
        if ($this->apiKey === '') {
            throw new RuntimeException('GROQ_API_KEY is not configured.');
        }

        $body = [
            'model' => $this->model,
            'messages' => [
                ['role' => 'user', 'content' => $prompt],
            ],
        ];

        if ($jsonMode) {
            $body['response_format'] = ['type' => 'json_object'];
        }

        $response = Http::withToken($this->apiKey)
            ->timeout(30)
            ->retry(2, 500, throw: false)
            ->post('https://api.groq.com/openai/v1/chat/completions', $body);

        if ($response->failed()) {
            Log::error('AiService: API call failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new RuntimeException('The AI service is unavailable right now. Please try again shortly.');
        }

        return (string) data_get($response->json(), 'choices.0.message.content', '');
    }
}