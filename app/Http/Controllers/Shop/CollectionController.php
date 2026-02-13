<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Support\Cart;
use Inertia\Inertia;

class CollectionController extends Controller
{
    public function show(Category $category)
    {
        return Inertia::render('shop/collection-show', [
            'category' => $category,
            'products' => $category->products()->isVisible()->latest()->paginate(12)->withQueryString(),
            'cartSummary' => Cart::summary(),
        ]);
    }
}
