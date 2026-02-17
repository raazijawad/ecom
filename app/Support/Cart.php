<?php

namespace App\Support;

use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;

class Cart
{
    private const SESSION_KEY = 'cart.items';

    private const ALLOWED_VARIANT_FIELDS = ['size', 'color'];

    public static function items(): Collection
    {
        $items = collect(Session::get(self::SESSION_KEY, []));

        if ($items->isEmpty()) {
            return collect();
        }

        $productIds = $items
            ->keys()
            ->map(fn ($itemKey) => (int) explode(':', (string) $itemKey)[0])
            ->unique()
            ->values()
            ->all();

        $products = Product::query()
            ->isVisible()
            ->whereIn('id', $productIds)
            ->get()
            ->keyBy('id');

        return $items
            ->map(function ($itemData, $itemKey) use ($products) {
                $quantity = is_array($itemData) ? (int) ($itemData['quantity'] ?? 0) : (int) $itemData;
                $size = is_array($itemData) ? ($itemData['size'] ?? null) : null;
                $color = is_array($itemData) ? ($itemData['color'] ?? null) : null;
                $productId = (int) explode(':', (string) $itemKey)[0];
                $product = $products->get($productId);

                if (! $product) {
                    return null;
                }

                return [
                    'item_key' => (string) $itemKey,
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => (float) $product->price,
                    'quantity' => $quantity,
                    'size' => is_string($size) ? $size : null,
                    'color' => is_string($color) ? $color : null,
                    'line_total' => (float) bcmul((string) $product->price, (string) $quantity, 2),
                    'image_url' => self::resolveImageUrl($product, $color),
                ];
            })
            ->filter()
            ->values();
    }

    public static function add(Product $product, int $quantity = 1, ?string $size = null, ?string $color = null): void
    {
        $cart = self::normalizedCart();
        $key = self::itemKey($product->id, $size, $color);
        $current = (int) ($cart[$key]['quantity'] ?? 0);

        $cart[$key] = [
            'quantity' => min($product->stock, $current + max(1, $quantity)),
            'size' => $size,
            'color' => $color,
        ];

        Session::put(self::SESSION_KEY, $cart);
    }

    public static function update(int $productId, int $quantity, ?string $itemKey = null): void
    {
        $cart = self::normalizedCart();

        if ($quantity <= 0) {
            foreach (array_keys($cart) as $key) {
                if (self::matchesCartItem((string) $key, $productId, $itemKey)) {
                    unset($cart[$key]);
                }
            }
        } else {
            foreach ($cart as $key => $itemData) {
                if (self::matchesCartItem((string) $key, $productId, $itemKey)) {
                    $cart[$key]['quantity'] = $quantity;
                }
            }
        }

        Session::put(self::SESSION_KEY, $cart);
    }

    public static function remove(int $productId, ?string $itemKey = null): void
    {
        $cart = self::normalizedCart();

        foreach (array_keys($cart) as $key) {
            if (self::matchesCartItem((string) $key, $productId, $itemKey)) {
                unset($cart[$key]);
            }
        }

        Session::put(self::SESSION_KEY, $cart);
    }

    public static function clear(): void
    {
        Session::forget(self::SESSION_KEY);
    }



    private static function matchesCartItem(string $key, int $productId, ?string $itemKey = null): bool
    {
        if (is_string($itemKey) && $itemKey !== '') {
            return $key === $itemKey;
        }

        return (int) explode(':', $key)[0] === $productId;
    }

    private static function normalizedCart(): array
    {
        $cart = Session::get(self::SESSION_KEY, []);

        return collect($cart)
            ->mapWithKeys(function ($itemData, $itemKey) {
                if (is_array($itemData)) {
                    $normalized = [
                        'quantity' => (int) ($itemData['quantity'] ?? 0),
                        'size' => is_string($itemData['size'] ?? null) ? $itemData['size'] : null,
                        'color' => is_string($itemData['color'] ?? null) ? $itemData['color'] : null,
                    ];

                    return [(string) $itemKey => $normalized];
                }

                return [
                    (string) $itemKey => [
                        'quantity' => (int) $itemData,
                        'size' => null,
                        'color' => null,
                    ],
                ];
            })
            ->all();
    }

    private static function itemKey(int $productId, ?string $size, ?string $color): string
    {
        $normalized = [
            'size' => is_string($size) ? trim($size) : '',
            'color' => is_string($color) ? trim($color) : '',
        ];

        $segments = collect(self::ALLOWED_VARIANT_FIELDS)
            ->map(fn (string $field) => $normalized[$field] !== '' ? $field.'='.mb_strtolower($normalized[$field]) : null)
            ->filter()
            ->implode('|');

        return $segments === '' ? (string) $productId : $productId.':'.$segments;
    }

    private static function resolveImageUrl(Product $product, ?string $color): ?string
    {
        if (! is_string($color) || trim($color) === '') {
            return $product->image_url;
        }

        $lookup = mb_strtolower(trim($color));
        $colorImage = collect($product->color_image_urls ?? [])
            ->mapWithKeys(fn ($url, $name) => [mb_strtolower(trim((string) $name)) => $url])
            ->get($lookup);

        return is_string($colorImage) && $colorImage !== '' ? $colorImage : $product->image_url;
    }

    public static function summary(): array
    {
        $items = self::items();
        $subtotal = $items->sum('line_total');
        $shippingFee = $subtotal >= 100 || $subtotal === 0.0 ? 0.0 : 9.99;

        return [
            'items' => $items,
            'count' => $items->sum('quantity'),
            'subtotal' => round($subtotal, 2),
            'shipping_fee' => $shippingFee,
            'total' => round($subtotal + $shippingFee, 2),
        ];
    }
}
