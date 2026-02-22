<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ProductColor extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'name',
    ];

    protected $appends = [
        'main_image_path',
        'gallery_image_paths',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductColorImage::class);
    }

    public function mainImage(): HasOne
    {
        return $this->hasOne(ProductColorImage::class)->where('is_main', true);
    }

    public function galleryImages(): HasMany
    {
        return $this->hasMany(ProductColorImage::class)->where('is_main', false);
    }

    public function getMainImagePathAttribute(): ?string
    {
        return $this->mainImage?->image_path;
    }

    public function getGalleryImagePathsAttribute(): array
    {
        return $this->galleryImages->pluck('image_path')->values()->all();
    }
}
