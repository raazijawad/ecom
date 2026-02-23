<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\BestSellingShoe;
use App\Models\Category;
use App\Models\HeroBanner;
use App\Models\Product;
use App\Models\Testimonial;
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
            'bestSellingShoes' => BestSellingShoe::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->with(['product' => fn ($query) => $query->isVisible()->with('category')])
                ->get()
                ->pluck('product')
                ->filter()
                ->values(),
            'heroBanners' => HeroBanner::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderByDesc('id')
                ->with('product:id,name,image_url,price')
                ->get()
                ->map(function (HeroBanner $banner) {
                    $banner->cta_link = $banner->product_id ? "/products/{$banner->product_id}" : null;
                    $banner->image_url = $banner->product_id
                        ? ($banner->product?->image_url ?: $banner->image_url)
                        : ($banner->image_url ?: $banner->product?->image_url);

                    $productPrice = $banner->product ? (float) $banner->product->price : null;
                    $offPercentage = $banner->off_percentage;

                    $banner->product_price = $productPrice;
                    $banner->discount_price = $productPrice !== null && $offPercentage
                        ? round($productPrice * ((100 - $offPercentage) / 100), 2)
                        : null;

                    return $banner;
                }),
            'products' => $productsQuery->paginate(8)->withQueryString(),
            'categories' => Category::query()->orderBy('name')->get(),
            'testimonials' => Testimonial::query()
                ->with('user:id,name,email')
                ->latest()
                ->take(9)
                ->get(),
            'cartSummary' => Cart::summary(),
        ]);
    }
}
