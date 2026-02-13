<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HomePageVisibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_hides_inactive_products_from_the_home_page(): void
    {
        $category = Category::create([
            'name' => 'Running',
            'slug' => 'running',
            'description' => 'Running shoes',
        ]);

        $activeProduct = Product::create([
            'category_id' => $category->id,
            'name' => 'Skyline Racer',
            'slug' => 'skyline-racer',
            'description' => 'Visible on storefront',
            'price' => 120,
            'stock' => 12,
            'is_featured' => true,
            'is_active' => true,
        ]);

        Product::create([
            'category_id' => $category->id,
            'name' => 'Hidden Sprint',
            'slug' => 'hidden-sprint',
            'description' => 'Hidden on storefront',
            'price' => 115,
            'stock' => 10,
            'is_featured' => true,
            'is_active' => false,
        ]);

        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('shop/home')
            ->has('products.data', 1)
            ->where('products.data.0.id', $activeProduct->id)
            ->has('featuredProducts', 1)
            ->where('featuredProducts.0.id', $activeProduct->id));
    }
}
