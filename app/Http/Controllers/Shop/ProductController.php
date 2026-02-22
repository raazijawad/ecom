<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\HeroBanner;
use App\Models\Product;
use App\Support\Cart;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function show(Product $product)
    {
        $heroBanner = HeroBanner::query()
            ->where('is_active', true)
            ->where('product_id', $product->id)
            ->whereNotNull('off_percentage')
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->first();

        $discount = null;

        if ($heroBanner?->off_percentage) {
            $basePrice = (float) $product->price;
            $discount = [
                'off_percentage' => $heroBanner->off_percentage,
                'discount_price' => round($basePrice * ((100 - $heroBanner->off_percentage) / 100), 2),
            ];
        }

        return Inertia::render('shop/product-show', [
            'product' => $product->load(['category', 'productColors.mainImage', 'productColors.galleryImages']),
            'discount' => $discount,
            'relatedProducts' => Product::query()
                ->isVisible()
                ->where('category_id', $product->category_id)
                ->whereKeyNot($product->id)
                ->take(4)
                ->get(),
            'cartSummary' => Cart::summary(),
        ]);
    }
}
