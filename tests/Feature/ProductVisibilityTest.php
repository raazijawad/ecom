<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductVisibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_only_shows_visible_products(): void
    {
        $category = Category::create([
            'name' => 'Mens Collection',
            'slug' => 'mens-collection',
            'description' => 'Mens shoes',
        ]);

        $visibleProduct = Product::create([
            'category_id' => $category->id,
            'name' => 'Visible Product',
            'slug' => 'visible-product',
            'description' => 'Visible product',
            'price' => 129,
            'stock' => 10,
            'is_featured' => true,
            'is_visible' => true,
        ]);

        Product::create([
            'category_id' => $category->id,
            'name' => 'Hidden Product',
            'slug' => 'hidden-product',
            'description' => 'Hidden product',
            'price' => 129,
            'stock' => 10,
            'is_featured' => true,
            'is_visible' => false,
        ]);

        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('shop/home')
            ->has('products.data', 1)
            ->where('products.data.0.id', $visibleProduct->id)
            ->has('featuredProducts', 1)
            ->where('featuredProducts.0.id', $visibleProduct->id));
    }

    public function test_collection_page_hides_invisible_products(): void
    {
        $category = Category::create([
            'name' => 'Mens Collection',
            'slug' => 'mens-collection',
            'description' => 'Mens shoes',
        ]);

        $visibleProduct = Product::create([
            'category_id' => $category->id,
            'name' => 'Visible Product',
            'slug' => 'visible-product',
            'description' => 'Visible product',
            'price' => 129,
            'stock' => 10,
            'is_visible' => true,
        ]);

        Product::create([
            'category_id' => $category->id,
            'name' => 'Hidden Product',
            'slug' => 'hidden-product',
            'description' => 'Hidden product',
            'price' => 129,
            'stock' => 10,
            'is_visible' => false,
        ]);

        $response = $this->get(route('collections.show', $category));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('shop/collection-show')
            ->has('products.data', 1)
            ->where('products.data.0.id', $visibleProduct->id));
    }

    public function test_hidden_product_page_returns_not_found(): void
    {
        $category = Category::create([
            'name' => 'Mens Collection',
            'slug' => 'mens-collection',
            'description' => 'Mens shoes',
        ]);

        $hiddenProduct = Product::create([
            'category_id' => $category->id,
            'name' => 'Hidden Product',
            'slug' => 'hidden-product',
            'description' => 'Hidden product',
            'price' => 129,
            'stock' => 10,
            'is_visible' => false,
        ]);

        $this->get(route('products.show', $hiddenProduct))->assertNotFound();
    }
}
