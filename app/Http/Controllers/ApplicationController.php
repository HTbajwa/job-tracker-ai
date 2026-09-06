<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreApplicationRequest;
use App\Http\Requests\UpdateApplicationRequest;
use App\Models\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    /**
     * Applications list — powers both the List view and the Kanban board.
     * The frontend decides which layout to render; this controller just
     * hands over the (filtered) data both views need.
     */
  public function index(Request $request): Response
{
    $filters = $request->only(['search', 'status']);

    $paginated = $request->user()
        ->applications()
        ->filter($filters)
        ->latest('applied_date')
        ->paginate(15)
        ->withQueryString();

    $all = $request->user()
        ->applications()
        ->filter($filters)
        ->latest('applied_date')
        ->get();

    return Inertia::render('Applications/Index', [
        'applications' => $paginated,
        'allApplications' => $all,
        'filters' => $filters,
    ]);
}

    public function create(): Response
    {
        return Inertia::render('Applications/Create');
    }

    public function store(StoreApplicationRequest $request): RedirectResponse
    {
        $request->user()->applications()->create($request->validated());

        return redirect()->route('applications.index')
            ->with('success', 'Application added.');
    }

    public function show(Application $application): Response
    {
        Gate::authorize('view', $application);

        return Inertia::render('Applications/Show', [
            'application' => $application->load('aiMatches'),
        ]);
    }

    public function edit(Application $application): Response
    {
        Gate::authorize('update', $application);

        return Inertia::render('Applications/Edit', [
            'application' => $application,
        ]);
    }

    public function update(UpdateApplicationRequest $request, Application $application): RedirectResponse
    {
        Gate::authorize('update', $application);

        $application->update($request->validated());

        return redirect()->route('applications.index')
            ->with('success', 'Application updated.');
    }

    public function destroy(Application $application): RedirectResponse
    {
        Gate::authorize('delete', $application);

        $application->delete();

        return redirect()->route('applications.index')
            ->with('success', 'Application moved to trash.');
    }

    /**
     * Dedicated endpoint for Kanban drag-and-drop — only the status
     * changes, so it doesn't need the full update-validation payload.
     */
    public function updateStatus(Request $request, Application $application): RedirectResponse
    {
        Gate::authorize('update', $application);

        $request->validate([
            'status' => ['required', 'in:' . implode(',', Application::STATUSES)],
        ]);

        $application->update(['status' => $request->input('status')]);

        return back();
    }
}