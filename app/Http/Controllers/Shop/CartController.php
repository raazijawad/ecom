<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Support\Cart;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        return Inertia::render('shop/cart', [
            'cartSummary' => Cart::summary(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1'],
            'size' => ['nullable', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:50'],
        ]);

        $product = Product::query()->isVisible()->findOrFail($validated['product_id']);
        Cart::add(
            $product,
            $validated['quantity'] ?? 1,
            $validated['size'] ?? null,
            $validated['color'] ?? null,
        );

        return back()->with('success', 'Product added to cart.');
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0', 'max:'.$product->stock],
            'item_key' => ['nullable', 'string'],
        ]);

        Cart::update($product->id, $validated['quantity'], $validated['item_key'] ?? null);

        return back();
    }

    public function destroy(Request $request, Product $product): RedirectResponse
    {
        Cart::remove($product->id, $request->input('item_key'));

        return back();
    }
}
