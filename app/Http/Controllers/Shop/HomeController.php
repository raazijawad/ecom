<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\HeroBanner;
use App\Models\Product;
use App\Support\Cart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __invoke(Request $request)
    {
        $search = (string) $request->query('q', '');
        $categorySlug = (string) $request->query('category', '');

        $productsQuery = Product::query()
            ->isVisible()
            ->with('category')
            ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->when($categorySlug !== '', fn ($query) => $query->whereHas('category', fn ($q) => $q->where('slug', $categorySlug)))
            ->latest();

        return Inertia::render('shop/home', [
            'filters' => [
                'q' => $search,
                'category' => $categorySlug,
            ],
            'featuredProducts' => Product::query()->isVisible()->where('is_featured', true)->take(4)->get(),
            'heroBanners' => HeroBanner::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderByDesc('id')
                ->get(),
            'products' => $productsQuery->paginate(8)->withQueryString(),
            'categories' => Category::query()->orderBy('name')->get(),
            'cartSummary' => Cart::summary(),
        ]);
    }
}
