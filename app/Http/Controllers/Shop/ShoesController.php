<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Support\Cart;
use Inertia\Inertia;

class ShoesController extends Controller
{
    public function __invoke()
    {
        return Inertia::render('shop/shoes', [
            'products' => Product::query()->with('category')->latest()->paginate(12)->withQueryString(),
            'cartSummary' => Cart::summary(),
        ]);
    }
}
