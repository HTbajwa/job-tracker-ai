<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\ResumeParserService;
use Illuminate\Support\Facades\Storage;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
   public function store(Request $request, ResumeParserService $resumeParser): RedirectResponse
{
    $request->validate([
        'name' => ['required', 'string', 'max:255'],
       'email' => ['required', 'string', 'lowercase', 'email:rfc,dns', 'max:255', 'unique:'.User::class],
        'password' => ['required', 'confirmed', Rules\Password::defaults()],
        'resume_pdf' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
        'resume_text' => ['nullable', 'string'],
    ]);

    $resumeText = $request->input('resume_text');
    $resumePath = null;

    if ($request->hasFile('resume_pdf')) {
        $resumePath = $request->file('resume_pdf')->store('resumes', 'local');
        $resumeText = $resumeParser->extractText($request->file('resume_pdf'));
    }

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'resume_text' => $resumeText,
        'resume_path' => $resumePath,
    ]);

    event(new Registered($user));

    Auth::login($user);

    return redirect(route('dashboard', absolute: false));
}
}
