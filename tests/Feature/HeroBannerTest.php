<?php

namespace Tests\Feature;

use App\Models\HeroBanner;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HeroBannerTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_receives_only_active_hero_banners_in_sort_order(): void
    {
        $firstBanner = HeroBanner::create([
            'title' => 'First Banner',
            'image_url' => 'https://example.com/first.jpg',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        HeroBanner::create([
            'title' => 'Inactive Banner',
            'image_url' => 'https://example.com/inactive.jpg',
            'sort_order' => 0,
            'is_active' => false,
        ]);

        $secondBanner = HeroBanner::create([
            'title' => 'Second Banner',
            'image_url' => 'https://example.com/second.jpg',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('shop/home')
                ->has('heroBanners', 2)
                ->where('heroBanners.0.id', $firstBanner->id)
                ->where('heroBanners.1.id', $secondBanner->id));
    }
}
