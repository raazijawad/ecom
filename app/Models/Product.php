<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'sizes',
        'colors',
        'color_image_urls',
        'image',
        'is_featured',
        'is_visible',
    ];

    protected $appends = [
        'image_url',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'is_visible' => 'boolean',
            'price' => 'decimal:2',
            'sizes' => 'array',
            'colors' => 'array',
            'color_image_urls' => 'array',
        ];
    }


    public function getImageUrlAttribute(): ?string
    {
        if (! is_string($this->image) || trim($this->image) === '') {
            return null;
        }

        if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
            return $this->image;
        }

        return asset('storage/'.$this->image);
    }

    public function scopeIsVisible(Builder $query): Builder
    {
        return $query->where('is_visible', true);
    }


    public function resolveRouteBindingQuery($query, $value, $field = null): Builder
    {
        return $query->isVisible()->where($field ?? $this->getRouteKeyName(), $value);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
