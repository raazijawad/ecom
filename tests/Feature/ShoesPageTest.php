<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ShoesPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_displays_all_shoes_in_store(): void
    {
        $running = Category::create([
            'name' => 'Running',
            'slug' => 'running',
            'description' => 'Running shoes',
        ]);

        $lifestyle = Category::create([
            'name' => 'Lifestyle',
            'slug' => 'lifestyle',
            'description' => 'Lifestyle shoes',
        ]);

        $firstShoe = Product::create([
            'category_id' => $running->id,
            'name' => 'Apex Speed',
            'slug' => 'apex-speed',
            'description' => 'Lightweight runner',
            'price' => 149,
            'stock' => 10,
            'is_featured' => false,
        ]);

        $secondShoe = Product::create([
            'category_id' => $lifestyle->id,
            'name' => 'City Glide',
            'slug' => 'city-glide',
            'description' => 'Everyday comfort',
            'price' => 129,
            'stock' => 8,
            'is_featured' => false,
        ]);

        $response = $this->get(route('shoes.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('shop/shoes')
            ->has('products.data', 2)
            ->where('products.data.0.id', $secondShoe->id)
            ->where('products.data.1.id', $firstShoe->id));
    }
}
