<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\HeroBanner;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HeroBannerTest extends TestCase
{
    use RefreshDatabase;


    public function test_home_calculates_discount_price_for_banner_product(): void
    {
        $category = Category::create([
            'name' => 'Running',
            'slug' => 'running',
            'description' => 'Running shoes',
        ]);

        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Speed Runner',
            'slug' => 'speed-runner',
            'description' => 'Lightweight runner',
            'price' => 200,
            'stock' => 10,
            'is_featured' => false,
            'is_visible' => true,
        ]);

        $banner = HeroBanner::create([
            'title' => 'Speed Deal',
            'image_url' => null,
            'product_id' => $product->id,
            'off_percentage' => 15,
            'sort_order' => 0,
            'is_active' => true,
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('shop/home')
                ->where('heroBanners.0.id', $banner->id)
                ->where('heroBanners.0.product_price', 200.0)
                ->where('heroBanners.0.discount_price', 170.0)
                ->where('heroBanners.0.off_percentage', 15));
    }

    public function test_home_receives_only_active_hero_banners_in_sort_order(): void
    {
        $firstBanner = HeroBanner::create([
            'title' => 'First Banner',
            'image_url' => 'https://example.com/first.jpg',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        HeroBanner::create([
            'title' => 'Inactive Banner',
            'image_url' => 'https://example.com/inactive.jpg',
            'sort_order' => 0,
            'is_active' => false,
        ]);

        $secondBanner = HeroBanner::create([
            'title' => 'Second Banner',
            'image_url' => 'https://example.com/second.jpg',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('shop/home')
                ->has('heroBanners', 2)
                ->where('heroBanners.0.id', $firstBanner->id)
                ->where('heroBanners.1.id', $secondBanner->id));
    }
}
