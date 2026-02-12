<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@example.com',
        ]);

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'is_admin' => true,
        ]);

        $catalog = [
            'Electronics' => [
                ['name' => 'Wireless Headphones', 'price' => 79.99, 'stock' => 25, 'featured' => true],
                ['name' => '4K Monitor', 'price' => 299.00, 'stock' => 10, 'featured' => true],
                ['name' => 'Mechanical Keyboard', 'price' => 99.50, 'stock' => 18, 'featured' => false],
            ],
            'Home & Kitchen' => [
                ['name' => 'Ceramic Dinner Set', 'price' => 54.99, 'stock' => 40, 'featured' => true],
                ['name' => 'French Press', 'price' => 24.49, 'stock' => 32, 'featured' => false],
                ['name' => 'Air Fryer 5L', 'price' => 119.00, 'stock' => 12, 'featured' => false],
            ],
            'Fashion' => [
                ['name' => 'Classic Hoodie', 'price' => 45.00, 'stock' => 50, 'featured' => true],
                ['name' => 'Slim Fit Jeans', 'price' => 62.00, 'stock' => 35, 'featured' => false],
                ['name' => 'Canvas Sneakers', 'price' => 58.75, 'stock' => 28, 'featured' => false],
            ],
        ];

        foreach ($catalog as $categoryName => $products) {
            $category = Category::create([
                'name' => $categoryName,
                'slug' => Str::slug($categoryName),
                'description' => "Best-selling {$categoryName} products for daily life.",
            ]);

            foreach ($products as $entry) {
                Product::create([
                    'category_id' => $category->id,
                    'name' => $entry['name'],
                    'slug' => Str::slug($entry['name']),
                    'description' => $entry['name'].' crafted with reliable quality and fast shipping.',
                    'price' => $entry['price'],
                    'stock' => $entry['stock'],
                    'is_featured' => $entry['featured'],
                    'image_url' => 'https://picsum.photos/seed/'.urlencode($entry['name']).'/640/420',
                ]);
            }
        }
    }
}
