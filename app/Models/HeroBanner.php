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
        'accent_text',
        'image_url',
        'cta_label',
        'product_id',
        'home_banner_product_id',
        'off_percentage',
        'badge_price',
        'cta_link',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'off_percentage' => 'integer',
            'badge_price' => 'decimal:2',
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
