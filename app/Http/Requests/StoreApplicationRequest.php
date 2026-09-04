<?php

namespace App\Http\Requests;

use App\Models\Application;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(Application::STATUSES)],
            'applied_date' => ['required', 'date'],
            'job_url' => ['nullable', 'url', 'max:2048'],
            'notes' => ['nullable', 'string'],
            'follow_up_date' => ['nullable', 'date'],
        ];
    }
}