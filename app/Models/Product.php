<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'color_gallery_images',
        'image',
        'gallery_images',
        'is_featured',
        'is_visible',
    ];

    protected $appends = [
        'image_url',
        'gallery_image_urls',
        'color_image_urls',
        'color_gallery_image_urls',
        'color_variants',
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
            'color_gallery_images' => 'array',
            'gallery_images' => 'array',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function productColors(): HasMany
    {
        return $this->hasMany(ProductColor::class);
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

    public function getGalleryImageUrlsAttribute(): array
    {
        return collect($this->gallery_images ?? [])
            ->filter(fn ($path) => is_string($path) && trim($path) !== '')
            ->map(fn (string $path): string => str_starts_with($path, 'http') ? $path : asset('storage/'.$path))
            ->values()
            ->all();
    }

    public function getColorImageUrlsAttribute(): array
    {
        return $this->productColors
            ->mapWithKeys(function (ProductColor $color): array {
                $path = trim((string) $color->main_image_path);

                if ($path === '') {
                    return [];
                }

                return [strtolower($color->name) => str_starts_with($path, 'http') ? $path : asset('storage/'.$path)];
            })
            ->all();
    }

    public function getColorGalleryImageUrlsAttribute(): array
    {
        return $this->productColors
            ->mapWithKeys(function (ProductColor $color): array {
                $images = collect($color->gallery_image_paths)
                    ->filter(fn ($path) => is_string($path) && trim($path) !== '')
                    ->map(fn (string $path): string => str_starts_with($path, 'http') ? $path : asset('storage/'.$path))
                    ->values()
                    ->all();

                if ($images === []) {
                    return [];
                }

                return [strtolower($color->name) => $images];
            })
            ->all();
    }

    public function getColorVariantsAttribute(): array
    {
        return $this->productColors
            ->map(function (ProductColor $color): array {
                $mainImage = trim((string) $color->main_image_path);

                return [
                    'id' => $color->id,
                    'name' => $color->name,
                    'main_image' => $mainImage === '' ? null : (str_starts_with($mainImage, 'http') ? $mainImage : asset('storage/'.$mainImage)),
                    'gallery_images' => collect($color->gallery_image_paths)
                        ->map(fn (string $path): string => str_starts_with($path, 'http') ? $path : asset('storage/'.$path))
                        ->values()
                        ->all(),
                ];
            })
            ->values()
            ->all();
    }

    public function scopeIsVisible(Builder $query): Builder
    {
        return $query->where('is_visible', true);
    }

    public function resolveRouteBindingQuery($query, $value, $field = null): Builder
    {
        return $query->isVisible()->where($field ?? $this->getRouteKeyName(), $value);
    }
}
