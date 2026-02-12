<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Support\Cart;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function show(Product $product)
    {
        return Inertia::render('shop/product-show', [
            'product' => $product->load('category'),
            'relatedProducts' => Product::query()
                ->where('category_id', $product->category_id)
                ->whereKeyNot($product->id)
                ->take(4)
                ->get(),
            'cartSummary' => Cart::summary(),
        ]);
    }
}
