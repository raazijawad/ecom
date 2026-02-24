<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\HeroBanner;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HeroBannerProductSelectionTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_includes_selected_hero_banner_product_id(): void
    {
        $category = Category::create([
            'name' => 'Running',
            'slug' => 'running',
            'description' => 'Running shoes',
        ]);

        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Sprint X',
            'slug' => 'sprint-x',
            'description' => 'Fast shoe',
            'price' => 120,
            'stock' => 15,
            'is_featured' => false,
            'is_visible' => true,
        ]);

        HeroBanner::create([
            'title' => 'Main Banner',
            'badge_text' => 'Hot',
            'headline' => 'Run Faster',
            'description' => 'Performance shoes',
            'cta_text' => 'Shop now',
            'product_id' => $product->id,
            'image_path' => 'hero-banners/main.png',
            'is_active' => true,
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('shop/home')
                ->has('heroBanners', 1)
                ->where('heroBanners.0.product_id', $product->id));
    }
}
