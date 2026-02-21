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

        $catalog = [
            'New Arrivals' => [
                ['name' => 'FreshDrop Velocity One', 'price' => 119.99, 'stock' => 30, 'featured' => true],
                ['name' => 'FirstLook Urban Glide', 'price' => 109.00, 'stock' => 35, 'featured' => false],
            ],
            'Best Sellers' => [
                ['name' => 'TopPick Runner Elite', 'price' => 139.99, 'stock' => 26, 'featured' => true],
                ['name' => 'CustomerChoice Street Pro', 'price' => 124.50, 'stock' => 28, 'featured' => true],
            ],
            'Men’s Collection' => [
                ['name' => 'Men Apex Motion', 'price' => 129.00, 'stock' => 22, 'featured' => false],
                ['name' => 'Men Metro Flex', 'price' => 118.75, 'stock' => 24, 'featured' => false],
            ],
            'Women’s Collection' => [
                ['name' => 'Women Luna Sprint', 'price' => 127.25, 'stock' => 30, 'featured' => true],
                ['name' => 'Women Bloom Runner', 'price' => 112.00, 'stock' => 32, 'featured' => false],
            ],
            'Kids’ Collection' => [
                ['name' => 'Kids Turbo Dash', 'price' => 74.99, 'stock' => 40, 'featured' => false],
                ['name' => 'Kids Comfy Jump', 'price' => 69.99, 'stock' => 42, 'featured' => false],
            ],
            'Sports & Performance Shoes' => [
                ['name' => 'SprintForce Carbon X', 'price' => 179.00, 'stock' => 18, 'featured' => true],
                ['name' => 'PowerRun Stability Max', 'price' => 154.00, 'stock' => 20, 'featured' => true],
            ],
            'Casual Sneakers' => [
                ['name' => 'Daily Drift Canvas', 'price' => 92.00, 'stock' => 34, 'featured' => false],
                ['name' => 'City Walk Low', 'price' => 98.99, 'stock' => 31, 'featured' => false],
            ],
            'Boots Collection' => [
                ['name' => 'TrailCore Mid Boot', 'price' => 149.99, 'stock' => 20, 'featured' => false],
                ['name' => 'Summit Guard Waterproof', 'price' => 169.50, 'stock' => 16, 'featured' => true],
            ],
            'Sandals & Summer Wear' => [
                ['name' => 'BreezeStep Comfort Sandal', 'price' => 64.00, 'stock' => 38, 'featured' => false],
                ['name' => 'SunWalk Stride', 'price' => 59.50, 'stock' => 40, 'featured' => false],
            ],
            'Limited Edition / Premium Collection' => [
                ['name' => 'Aurora Luxe Limited', 'price' => 229.00, 'stock' => 10, 'featured' => true],
                ['name' => 'Signature Goldline', 'price' => 249.99, 'stock' => 8, 'featured' => true],
            ],
        ];

        foreach ($catalog as $categoryName => $products) {
            $category = Category::updateOrCreate(
                ['slug' => Str::slug($categoryName)],
                [
                    'name' => $categoryName,
                    'description' => "Top-rated {$categoryName} designed for comfort and performance.",
                ]
            );

            foreach ($products as $entry) {
                Product::updateOrCreate(
                    ['slug' => Str::slug($entry['name'])],
                    [
                        'category_id' => $category->id,
                        'name' => $entry['name'],
                        'description' => $entry['name'].' engineered for long-lasting comfort and dependable grip.',
                        'price' => $entry['price'],
                        'stock' => $entry['stock'],
                        'is_featured' => $entry['featured'],
                        'image' => 'https://picsum.photos/seed/'.urlencode($entry['name']).'/640/420',
                    ]
                );
            }
        }
    }
}
