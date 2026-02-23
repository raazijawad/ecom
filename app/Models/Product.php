<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $with = ['discount'];

    protected $appends = ['original_price', 'discount_percentage', 'discounted_price', 'primary_image_url'];

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
            'sizes' => 'array',
            'colors' => 'array',
            'color_image_urls' => 'array',
        ];
    }

    public function scopeIsVisible(Builder $query): Builder
    {
        return $query->where('is_visible', true);
    }


    public function resolveRouteBindingQuery($query, $value, $field = null): Builder
    {
        return $query->isVisible()->where($field ?? $this->getRouteKeyName(), $value);
    }



    public function resolveColorImageUrl(?string $color = null): ?string
    {
        if (! is_string($color) || trim($color) === '') {
            return $this->resolveImagePath($this->image_url);
        }

        $lookup = mb_strtolower(trim($color));
        $entries = $this->color_image_urls ?? [];

        if ($this->isAssocArray($entries)) {
            $colorImage = collect($entries)
                ->mapWithKeys(fn ($url, $name) => [mb_strtolower(trim((string) $name)) => $url])
                ->get($lookup);

            return $this->resolveImagePath($colorImage) ?? $this->resolveImagePath($this->image_url);
        }

        $colorImage = collect($entries)
            ->first(function ($entry) use ($lookup) {
                if (! is_array($entry)) {
                    return false;
                }

                return mb_strtolower(trim((string) ($entry['color'] ?? ''))) === $lookup;
            });

        return $this->resolveImagePath($colorImage['product_image'] ?? null) ?? $this->resolveImagePath($this->image_url);
    }

    public function getPrimaryImageUrlAttribute(): ?string
    {
        $entries = $this->color_image_urls ?? [];

        if (is_array($entries)) {
            foreach ($entries as $entry) {
                if (! is_array($entry)) {
                    continue;
                }

                $resolved = $this->resolveImagePath($entry['product_image'] ?? null);

                if ($resolved) {
                    return $resolved;
                }
            }
        }

        return $this->resolveImagePath($this->image_url);
    }

    private function resolveImagePath(mixed $path): ?string
    {
        if (! is_string($path) || trim($path) === '') {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/')) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }

    private function isAssocArray(mixed $value): bool
    {
        if (! is_array($value)) {
            return false;
        }

        return array_keys($value) !== range(0, count($value) - 1);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function discount(): HasOne
    {
        return $this->hasOne(Discount::class);
    }

    public function getOriginalPriceAttribute(): float
    {
        return (float) $this->getRawOriginal('price');
    }

    public function getDiscountPercentageAttribute(): ?int
    {
        return $this->discount?->percentage;
    }

    public function getDiscountedPriceAttribute(): ?float
    {
        $percentage = $this->discount_percentage;

        if (! $percentage) {
            return null;
        }

        return round($this->original_price * ((100 - $percentage) / 100), 2);
    }
}
