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
        'color_gallery_images',
        'image',
        'gallery_images',
        'is_featured',
        'is_visible',
    ];

    protected $appends = [
        'image_url',
        'gallery_image_urls',
        'color_gallery_image_urls',
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
        $galleryImages = is_array($this->gallery_images) ? $this->gallery_images : [];

        return collect($galleryImages)
            ->filter(fn ($path) => is_string($path) && trim($path) !== '')
            ->map(function (string $path): string {
                if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                    return $path;
                }

                return asset('storage/'.$path);
            })
            ->values()
            ->all();
    }


    public function getColorGalleryImageUrlsAttribute(): array
    {
        $colorGalleryImages = is_array($this->color_gallery_images) ? $this->color_gallery_images : [];

        return collect($colorGalleryImages)
            ->mapWithKeys(function ($images, $color): array {
                $normalizedColor = strtolower(trim((string) $color));

                if ($normalizedColor === '') {
                    return [];
                }

                $rawImages = is_array($images)
                    ? $images
                    : (preg_split('/[\r\n,]+/', (string) $images) ?: []);

                $imageUrls = collect($rawImages)
                    ->filter(fn ($path) => is_string($path) && trim($path) !== '')
                    ->map(function (string $path): string {
                        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                            return $path;
                        }

                        return asset('storage/'.$path);
                    })
                    ->values()
                    ->all();

                if ($imageUrls === []) {
                    return [];
                }

                return [$normalizedColor => $imageUrls];
            })
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

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
