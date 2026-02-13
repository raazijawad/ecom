<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Support\Cart;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function create()
    {
        $cartSummary = Cart::summary();

        if ($cartSummary['count'] === 0) {
            return redirect()->route('home');
        }

        return Inertia::render('shop/checkout', [
            'cartSummary' => $cartSummary,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $cartSummary = Cart::summary();

        if ($cartSummary['count'] === 0) {
            return redirect()->route('home');
        }

        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:40'],
            'shipping_address' => ['required', 'string', 'max:1000'],
        ]);

        $order = DB::transaction(function () use ($validated, $cartSummary) {
            $order = Order::create([
                ...$validated,
                'order_number' => 'ORD-'.strtoupper(Str::random(8)),
                'subtotal' => $cartSummary['subtotal'],
                'shipping_fee' => $cartSummary['shipping_fee'],
                'total' => $cartSummary['total'],
                'status' => 'pending',
            ]);

            foreach ($cartSummary['items'] as $item) {
                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'product_name' => $item['name'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'line_total' => $item['line_total'],
                ]);
            }

            return $order;
        });

        Cart::clear();

        return redirect()->route('checkout.success', $order);
    }

    public function success(Order $order)
    {
        return Inertia::render('shop/order-success', [
            'order' => $order->load('items'),
        ]);
    }
}
