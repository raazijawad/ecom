<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Discount;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductDiscountTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_page_receives_discount_from_product_discount(): void
    {
        $category = Category::create([
            'name' => 'Deals',
            'slug' => 'deals',
            'description' => 'Deal shoes',
        ]);

        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Deal Shoe',
            'slug' => 'deal-shoe',
            'description' => 'Discounted product',
            'price' => 120,
            'stock' => 12,
            'is_featured' => false,
            'is_visible' => true,
        ]);

        Discount::create([
            'product_id' => $product->id,
            'percentage' => 15,
            'is_active' => true,
        ]);

        $this->get(route('products.show', $product))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('shop/product-show')
                ->where('discount.off_percentage', 15)
                ->where('discount.discount_price', 102.0));
    }
}
