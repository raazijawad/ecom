<?php

namespace App\Support;

use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;

class Cart
{
    private const SESSION_KEY = 'cart.items';

    public static function items(): Collection
    {
        $items = collect(Session::get(self::SESSION_KEY, []));

        if ($items->isEmpty()) {
            return collect();
        }

        $products = Product::query()
            ->isVisible()
            ->whereIn('id', $items->keys()->all())
            ->get()
            ->keyBy('id');

        return $items
            ->map(function ($quantity, $productId) use ($products) {
                $product = $products->get((int) $productId);

                if (! $product) {
                    return null;
                }

                return [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => (float) $product->price,
                    'quantity' => (int) $quantity,
                    'line_total' => (float) bcmul((string) $product->price, (string) $quantity, 2),
                    'image_url' => $product->image_url,
                ];
            })
            ->filter()
            ->values();
    }

    public static function add(Product $product, int $quantity = 1): void
    {
        $cart = Session::get(self::SESSION_KEY, []);
        $current = (int) ($cart[$product->id] ?? 0);
        $cart[$product->id] = min($product->stock, $current + max(1, $quantity));

        Session::put(self::SESSION_KEY, $cart);
    }

    public static function update(int $productId, int $quantity): void
    {
        $cart = Session::get(self::SESSION_KEY, []);

        if ($quantity <= 0) {
            unset($cart[$productId]);
        } else {
            $cart[$productId] = $quantity;
        }

        Session::put(self::SESSION_KEY, $cart);
    }

    public static function remove(int $productId): void
    {
        $cart = Session::get(self::SESSION_KEY, []);
        unset($cart[$productId]);
        Session::put(self::SESSION_KEY, $cart);
    }

    public static function clear(): void
    {
        Session::forget(self::SESSION_KEY);
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
