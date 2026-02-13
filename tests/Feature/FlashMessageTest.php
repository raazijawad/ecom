<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FlashMessageTest extends TestCase
{
    use RefreshDatabase;

    public function test_success_flash_message_is_shared_with_inertia_pages(): void
    {
        $response = $this->withSession([
            'success' => 'Product added to cart.',
        ])->get(route('home'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('shop/home')
            ->where('flash.success', 'Product added to cart.'));
    }
}
