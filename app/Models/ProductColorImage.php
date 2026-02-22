<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductColorImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_color_id',
        'image_path',
        'is_main',
    ];

    protected function casts(): array
    {
        return [
            'is_main' => 'boolean',
        ];
    }

    public function productColor(): BelongsTo
    {
        return $this->belongsTo(ProductColor::class);
    }
}
