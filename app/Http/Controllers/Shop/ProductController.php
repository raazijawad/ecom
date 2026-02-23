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
        $product->color_image_urls = collect($product->color_image_urls ?? [])
            ->map(function ($entry, $key) use ($product) {
                if (is_array($entry) && array_key_exists('color', $entry)) {
                    $gallery = collect($entry['image_gallery'] ?? [])
                        ->map(fn ($path) => $this->resolveImagePath($path))
                        ->filter()
                        ->values()
                        ->all();

                    return [
                        'color' => $entry['color'],
                        'product_image' => $this->resolveImagePath($entry['product_image'] ?? null) ?? $product->resolveColorImageUrl((string) ($entry['color'] ?? '')),
                        'image_gallery' => $gallery,
                    ];
                }

                return [
                    'color' => is_string($key) ? $key : null,
                    'product_image' => $this->resolveImagePath($entry),
                    'image_gallery' => [],
                ];
            })
            ->filter(fn ($entry) => is_string($entry['color'] ?? null) && ($entry['color'] ?? '') !== '')
            ->values()
            ->all();

        $relatedProducts = Product::query()
            ->with('category')
            ->isVisible()
            ->where('category_id', $product->category_id)
            ->whereKeyNot($product->id)
            ->take(4)
            ->get()
            ->map(function (Product $relatedProduct) {
                $relatedProduct->image_url = $this->resolveImagePath($relatedProduct->image_url)
                    ?? $this->resolveFirstColorImagePath($relatedProduct->color_image_urls);

                return $relatedProduct;
            });

        return Inertia::render('shop/product-show', [
            'product' => $product,
            'discount' => $discount,
            'relatedProducts' => $relatedProducts,
            'cartSummary' => Cart::summary(),
        ]);
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

    private function resolveFirstColorImagePath(mixed $colorImageUrls): ?string
    {
        if (! is_array($colorImageUrls)) {
            return null;
        }

        foreach ($colorImageUrls as $key => $entry) {
            if (is_array($entry) && array_key_exists('product_image', $entry)) {
                return $this->resolveImagePath($entry['product_image']);
            }

            if (is_string($key)) {
                return $this->resolveImagePath($entry);
            }
        }

        return null;
    }
}
