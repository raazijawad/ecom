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


    public function test_home_banner_checkout_cta_points_to_product_detail_page(): void
    {
        $category = Category::create([
            'name' => 'Lifestyle',
            'slug' => 'lifestyle',
            'description' => 'Lifestyle shoes',
        ]);

        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Urban Step',
            'slug' => 'urban-step',
            'description' => 'Street-ready comfort',
            'price' => 120,
            'stock' => 15,
            'is_featured' => false,
            'is_visible' => true,
        ]);

        HeroBanner::create([
            'title' => 'Checkout this pair',
            'cta_link' => '/checkout',
            'product_id' => $product->id,
            'sort_order' => 0,
            'is_active' => true,
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('shop/home')
                ->where('heroBanners.0.cta_link', "/products/{$product->id}"));
    }

    public function test_home_banner_without_product_has_no_cta_link(): void
    {
        HeroBanner::create([
            'title' => 'No linked product',
            'cta_link' => '/checkout',
            'sort_order' => 0,
            'is_active' => true,
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('shop/home')
                ->where('heroBanners.0.cta_link', null));
    }


    public function test_home_banner_uses_selected_home_banner_product_image(): void
    {
        $category = Category::create([
            'name' => 'Training',
            'slug' => 'training',
            'description' => 'Training shoes',
        ]);

        $buttonProduct = Product::create([
            'category_id' => $category->id,
            'name' => 'Button Product',
            'slug' => 'button-product',
            'description' => 'Button product description',
            'price' => 99,
            'stock' => 10,
            'image_url' => 'https://example.com/button-product.jpg',
            'is_featured' => false,
            'is_visible' => true,
        ]);

        $homeImageProduct = Product::create([
            'category_id' => $category->id,
            'name' => 'Home Image Product',
            'slug' => 'home-image-product',
            'description' => 'Home image product description',
            'price' => 149,
            'stock' => 5,
            'image_url' => 'https://example.com/home-image.jpg',
            'is_featured' => false,
            'is_visible' => true,
        ]);

        HeroBanner::create([
            'title' => 'Image From Product',
            'image_url' => 'https://example.com/fallback.jpg',
            'product_id' => $buttonProduct->id,
            'home_banner_product_id' => $homeImageProduct->id,
            'sort_order' => 0,
            'is_active' => true,
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('shop/home')
                ->where('heroBanners.0.image_url', 'https://example.com/home-image.jpg'));
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
