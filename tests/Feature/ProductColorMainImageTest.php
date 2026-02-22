<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductColor;
use App\Models\ProductColorImage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductColorMainImageTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_page_prefers_color_main_image_for_selected_variant(): void
    {
        $category = Category::create([
            'name' => 'Running',
            'slug' => 'running',
            'description' => 'Running shoes',
        ]);

        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Velocity Runner',
            'slug' => 'velocity-runner',
            'description' => 'Lightweight shoe',
            'price' => 140,
            'stock' => 10,
            'is_featured' => false,
            'is_visible' => true,
            'image' => 'products/fallback-main.jpg',
        ]);

        $red = ProductColor::create([
            'product_id' => $product->id,
            'name' => 'Red',
        ]);

        ProductColorImage::create([
            'product_color_id' => $red->id,
            'image_path' => 'products/colors/main/red-main.jpg',
            'is_main' => true,
        ]);

        ProductColorImage::create([
            'product_color_id' => $red->id,
            'image_path' => 'products/colors/gallery/red-gallery.jpg',
            'is_main' => false,
        ]);

        $this->get(route('products.show', $product))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('shop/product-show')
                ->where('product.color_variants.0.name', 'Red')
                ->where('product.color_variants.0.main_image', asset('storage/products/colors/main/red-main.jpg'))
                ->where('product.color_variants.0.gallery_images.0', asset('storage/products/colors/gallery/red-gallery.jpg')));
    }
}
