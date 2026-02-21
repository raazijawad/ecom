<?php

namespace Tests\Unit;

use App\Models\Product;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ProductColorGalleryTest extends TestCase
{
    #[Test]
    public function it_builds_color_gallery_image_urls_from_color_mapping(): void
    {
        $product = new Product([
            'color_gallery_images' => [
                'Blue' => 'products/gallery/blue-1.jpg, products/gallery/blue-2.jpg',
                'Red' => ['https://cdn.example.com/red-1.jpg', 'products/gallery/red-2.jpg'],
            ],
        ]);

        $this->assertSame(
            [
                'blue' => [
                    asset('storage/products/gallery/blue-1.jpg'),
                    asset('storage/products/gallery/blue-2.jpg'),
                ],
                'red' => [
                    'https://cdn.example.com/red-1.jpg',
                    asset('storage/products/gallery/red-2.jpg'),
                ],
            ],
            $product->color_gallery_image_urls,
        );
    }

    #[Test]
    public function it_builds_color_image_urls_from_uploaded_file_paths(): void
    {
        $product = new Product([
            'color_image_urls' => [
                'Blue' => 'products/colors/blue-thumb.jpg',
                'Red' => 'https://cdn.example.com/red-thumb.jpg',
            ],
        ]);

        $this->assertSame(
            [
                'blue' => asset('storage/products/colors/blue-thumb.jpg'),
                'red' => 'https://cdn.example.com/red-thumb.jpg',
            ],
            $product->color_image_urls,
        );
    }
}
