<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Application extends Model
{
    use HasFactory, SoftDeletes;

    public const STATUSES = ['applied', 'interview', 'offer', 'rejected'];

    protected $fillable = [
        'user_id',
        'company',
        'role',
        'status',
        'applied_date',
        'job_url',
        'notes',
        'follow_up_date',
    ];

    protected function casts(): array
    {
        return [
            'applied_date' => 'date',
            'follow_up_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function aiMatches(): HasMany
    {
        return $this->hasMany(AiMatch::class);
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, function (Builder $q, string $search) {
                $q->where(function (Builder $q) use ($search) {
                    $q->where('company', 'like', "%{$search}%")
                        ->orWhere('role', 'like', "%{$search}%");
                });
            })
            ->when($filters['status'] ?? null, function (Builder $q, string $status) {
                $q->where('status', $status);
            });
    }
}