<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\ResumeParserService;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
 public function updateResume(Request $request, ResumeParserService $resumeParser): RedirectResponse
{
    $request->validate([
        'resume_pdf' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
        'resume_text' => ['nullable', 'string'],
    ]);

    $user = $request->user();
    $resumeText = $request->input('resume_text');
    $resumePath = $user->resume_path;

    if ($request->hasFile('resume_pdf')) {
        // Clean up the old file before storing the new one.
        if ($resumePath) {
            Storage::disk('local')->delete($resumePath);
        }

        $resumePath = $request->file('resume_pdf')->store('resumes', 'local');
        $resumeText = $resumeParser->extractText($request->file('resume_pdf'));
    }

    $user->update([
        'resume_text' => $resumeText,
        'resume_path' => $resumePath,
    ]);

    return back();
}
}
