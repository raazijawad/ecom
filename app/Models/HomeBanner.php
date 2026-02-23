<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class HomeBanner extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'manual_image_path',
        'sort_order',
        'is_active',
    ];

    protected $appends = ['resolved_image_url'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getResolvedImageUrlAttribute(): ?string
    {
        if (filled($this->manual_image_path)) {
            return Storage::disk('public')->url($this->manual_image_path);
        }

        return $this->product?->primary_image_url;
    }
}
