<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HeroBanner extends Model
{
    use HasFactory;

    protected $fillable = [
        'eyebrow',
        'title',
        'description',
        'image_url',
        'cta_label',
        'product_id',
        'home_banner_product_id',
        'off_percentage',
        'cta_link',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'off_percentage' => 'integer',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function homeBannerProduct(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'home_banner_product_id');
    }
}
