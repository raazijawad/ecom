<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\HeroBanner;
use App\Models\Product;
use App\Support\Cart;
use Illuminate\Support\Facades\Storage;
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

        $product->load('category');
        $this->normalizeProductMedia($product);

        $relatedProducts = Product::query()
            ->isVisible()
            ->where('category_id', $product->category_id)
            ->whereKeyNot($product->id)
            ->take(4)
            ->get();

        $relatedProducts->each(fn (Product $relatedProduct) => $this->normalizeProductMedia($relatedProduct));

        return Inertia::render('shop/product-show', [
            'product' => $product,
            'discount' => $discount,
            'relatedProducts' => $relatedProducts,
            'cartSummary' => Cart::summary(),
        ]);
    }

    private function normalizeProductMedia(Product $product): void
    {
        $product->image_url = $this->resolvePublicImageUrl($product->image_url);
        $product->angle_image_urls = collect($product->angle_image_urls ?? [])
            ->map(fn ($imagePath) => $this->resolvePublicImageUrl($imagePath))
            ->filter()
            ->values()
            ->all();
    }

    private function resolvePublicImageUrl(mixed $imagePath): ?string
    {
        if (! is_string($imagePath) || $imagePath === '') {
            return null;
        }

        if (str_starts_with($imagePath, 'http://') || str_starts_with($imagePath, 'https://') || str_starts_with($imagePath, '/')) {
            return $imagePath;
        }

        return Storage::disk('public')->url($imagePath);
    }
}
