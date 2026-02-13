<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutBillingTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_accepts_visa_and_creates_paid_order(): void
    {
        $product = $this->createVisibleProduct();

        $response = $this->withSession([
            'cart.items' => [$product->id => 1],
        ])->post(route('checkout.store'), [
            'customer_name' => 'Jane Buyer',
            'customer_email' => 'jane@example.com',
            'customer_phone' => '+12345678',
            'shipping_address' => '123 Main St',
            'payment_cardholder_name' => 'Jane Buyer',
            'payment_card_number' => '4111111111111111',
            'payment_exp_month' => now()->month,
            'payment_exp_year' => now()->addYear()->year,
            'payment_cvv' => '123',
        ]);

        $response->assertRedirect();

        $order = Order::first();

        $this->assertNotNull($order);
        $this->assertSame('paid', $order->status);
        $this->assertSame('visa', $order->payment_brand);
        $this->assertSame('1111', $order->payment_last_four);
    }

    public function test_it_rejects_non_visa_or_mastercard_cards(): void
    {
        $product = $this->createVisibleProduct();

        $response = $this->from(route('checkout.create'))->withSession([
            'cart.items' => [$product->id => 1],
        ])->post(route('checkout.store'), [
            'customer_name' => 'Jane Buyer',
            'customer_email' => 'jane@example.com',
            'customer_phone' => '+12345678',
            'shipping_address' => '123 Main St',
            'payment_cardholder_name' => 'Jane Buyer',
            'payment_card_number' => '378282246310005',
            'payment_exp_month' => now()->month,
            'payment_exp_year' => now()->addYear()->year,
            'payment_cvv' => '1234',
        ]);

        $response->assertRedirect(route('checkout.create'));
        $response->assertSessionHasErrors('payment_card_number');
        $this->assertDatabaseCount('orders', 0);
    }

    private function createVisibleProduct(): Product
    {
        $category = Category::create([
            'name' => 'Mens Collection',
            'slug' => 'mens-collection',
            'description' => 'Mens shoes',
        ]);

        return Product::create([
            'category_id' => $category->id,
            'name' => 'Runner',
            'slug' => 'runner',
            'description' => 'Runner shoe',
            'price' => 120,
            'stock' => 10,
            'is_featured' => true,
            'is_visible' => true,
        ]);
    }
}
