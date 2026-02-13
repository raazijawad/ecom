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

    public function test_hidden_products_are_excluded_from_home_and_product_page(): void
    {
        $category = Category::create([
            'name' => 'Mens Collection',
            'slug' => 'mens-collection',
            'description' => 'Mens shoes',
        ]);

        $visibleProduct = Product::create([
            'category_id' => $category->id,
            'name' => 'Visible Shoe',
            'slug' => 'visible-shoe',
            'description' => 'Visible product',
            'price' => 100,
            'stock' => 10,
            'is_featured' => true,
            'is_visible' => true,
        ]);

        $hiddenProduct = Product::create([
            'category_id' => $category->id,
            'name' => 'Hidden Shoe',
            'slug' => 'hidden-shoe',
            'description' => 'Hidden product',
            'price' => 120,
            'stock' => 5,
            'is_featured' => true,
            'is_visible' => false,
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('shop/home')
                ->has('products.data', 1)
                ->where('products.data.0.id', $visibleProduct->id)
                ->has('featuredProducts', 1)
                ->where('featuredProducts.0.id', $visibleProduct->id));

        $this->get(route('products.show', $hiddenProduct))->assertNotFound();
        $this->get(route('products.show', $visibleProduct))->assertOk();
    }
}
