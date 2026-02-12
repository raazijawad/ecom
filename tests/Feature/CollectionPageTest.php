<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CollectionPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_displays_products_for_a_collection_by_slug(): void
    {
        $mensCollection = Category::create([
            'name' => 'Mens Collection',
            'slug' => 'mens-collection',
            'description' => 'Mens shoes',
        ]);

        $otherCollection = Category::create([
            'name' => 'Womens Collection',
            'slug' => 'womens-collection',
            'description' => 'Womens shoes',
        ]);

        $mensProduct = Product::create([
            'category_id' => $mensCollection->id,
            'name' => 'Men Apex Motion',
            'slug' => 'men-apex-motion',
            'description' => 'Mens product',
            'price' => 129,
            'stock' => 10,
            'is_featured' => false,
        ]);

        Product::create([
            'category_id' => $otherCollection->id,
            'name' => 'Women Luna Sprint',
            'slug' => 'women-luna-sprint',
            'description' => 'Womens product',
            'price' => 127,
            'stock' => 12,
            'is_featured' => false,
        ]);

        $response = $this->get(route('collections.show', $mensCollection));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('shop/collection-show')
            ->where('category.slug', 'mens-collection')
            ->has('products.data', 1)
            ->where('products.data.0.id', $mensProduct->id)
            ->where('products.data.0.name', 'Men Apex Motion'));
    }
}
