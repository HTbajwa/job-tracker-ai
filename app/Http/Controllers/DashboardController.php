<?php

namespace App\Http\Controllers;

use App\Services\AiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(protected AiService $aiService) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $applications = $user->applications()->get();

        $total = $applications->count();
        $responded = $applications->whereIn('status', ['interview', 'offer'])->count();
        $responseRate = $total > 0 ? round(($responded / $total) * 100) : 0;
        $thisWeek = $applications->where('created_at', '>=', now()->subDays(7))->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total' => $total,
                'responseRate' => $responseRate,
                'thisWeek' => $thisWeek,
            ],
            'statusBreakdown' => [
                'applied' => $applications->where('status', 'applied')->count(),
                'interview' => $applications->where('status', 'interview')->count(),
                'offer' => $applications->where('status', 'offer')->count(),
                'rejected' => $applications->where('status', 'rejected')->count(),
            ],
            'insight' => $this->getInsight($user, $applications),

            'upcomingFollowUps' => $applications
                ->filter(fn($app) => $app->follow_up_date !== null && $app->follow_up_date->lte(now()->addDays(7)))
                ->sortBy('follow_up_date')
                ->values()
                ->map(fn($app) => [
                    'id' => $app->id,
                    'company' => $app->company,
                    'role' => $app->role,
                    'follow_up_date' => $app->follow_up_date->toDateString(),
                    'is_overdue' => $app->follow_up_date->isPast(),
                ]),
        ]);
    }

    //**********after 6 hours we are again rendring the ai response or if the new application added otherwise the cacheed one*********************
    protected function getInsight($user, $applications): ?string
    {
        if ($applications->count() < 3) {
            return null; // not enough data for a meaningful pattern
        }

        $cacheKey = "dashboard-insight-user-{$user->id}-count-{$applications->count()}";

        return Cache::remember($cacheKey, now()->addHours(6), function () use ($applications) {
            $summary = $applications
                ->groupBy('status')
                ->map(fn($group, $status) => "{$status}: {$group->count()}")
                ->implode(', ');

            $byRole = $applications
                ->groupBy(fn($app) => str_contains(strtolower($app->role), 'wordpress') ? 'WordPress' : 'Other')
                ->map(function ($group, $type) {
                    $responded = $group->whereIn('status', ['interview', 'offer'])->count();
                    return "{$type} roles: {$group->count()} applied, {$responded} got a response";
                })
                ->implode('; ');

            $summaryInput = "Status counts: {$summary}. By role type: {$byRole}.";

            try {
                return $this->aiService->applicationInsights($summaryInput);
            } catch (\Throwable $e) {
                report($e);
                return null; // fail silently — insight is a nice-to-have, not critical
            }
        });
    }
}
