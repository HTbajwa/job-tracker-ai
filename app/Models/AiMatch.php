<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiMatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'job_description_hash',
        'job_description',
        'match_score',
        'missing_keywords',
        'cover_letter',
    ];

    protected function casts(): array
    {
        return [
            'missing_keywords' => 'array',
        ];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }
}