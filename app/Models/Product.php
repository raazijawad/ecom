<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'image_url',
        'is_featured',
        'is_visible',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'is_visible' => 'boolean',
            'price' => 'decimal:2',
        ];
    }

    public function scopeVisible(Builder $query): Builder
    {
        if (! Schema::hasColumn($this->getTable(), 'is_visible')) {
            return $query;
        }

        return $query->where('is_visible', true);
    }

    public function getIsVisibleAttribute($value): bool
    {
        return $value ?? true;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
