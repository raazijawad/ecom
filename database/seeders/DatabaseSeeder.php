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
            'Running Shoes' => [
                ['name' => 'AeroSprint Pro Runner', 'price' => 129.99, 'stock' => 25, 'featured' => true],
                ['name' => 'CloudStride Cushion 2', 'price' => 149.00, 'stock' => 20, 'featured' => true],
                ['name' => 'TempoFlex Daily Trainer', 'price' => 109.50, 'stock' => 30, 'featured' => false],
            ],
            'Lifestyle Sneakers' => [
                ['name' => 'StreetLite Classic Low', 'price' => 94.99, 'stock' => 40, 'featured' => true],
                ['name' => 'MetroCourt Leather', 'price' => 119.49, 'stock' => 32, 'featured' => false],
                ['name' => 'Urban Pulse Knit', 'price' => 99.00, 'stock' => 28, 'featured' => false],
            ],
            'Outdoor & Hiking' => [
                ['name' => 'TrailGuard Mid Hiker', 'price' => 139.00, 'stock' => 18, 'featured' => true],
                ['name' => 'SummitGrip Waterproof', 'price' => 162.00, 'stock' => 16, 'featured' => false],
                ['name' => 'RidgeRoam Trek Low', 'price' => 126.75, 'stock' => 22, 'featured' => false],
            ],
        ];

        foreach ($catalog as $categoryName => $products) {
            $category = Category::create([
                'name' => $categoryName,
                'slug' => Str::slug($categoryName),
                'description' => "Top-rated {$categoryName} designed for comfort and performance.",
            ]);

            foreach ($products as $entry) {
                Product::create([
                    'category_id' => $category->id,
                    'name' => $entry['name'],
                    'slug' => Str::slug($entry['name']),
                    'description' => $entry['name'].' engineered for long-lasting comfort and dependable grip.',
                    'price' => $entry['price'],
                    'stock' => $entry['stock'],
                    'is_featured' => $entry['featured'],
                    'image_url' => 'https://picsum.photos/seed/'.urlencode($entry['name']).'/640/420',
                ]);
            }
        }
    }
}
