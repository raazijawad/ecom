<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Support\Billing\CardBillingService;
use App\Support\Billing\PaypalBillingService;
use App\Support\Billing\UnsupportedCardException;
use App\Support\Cart;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
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

    public function store(Request $request, CardBillingService $billingService, PaypalBillingService $paypalBillingService): RedirectResponse
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
            'payment_method' => ['required', Rule::in(['card', 'paypal'])],
            'payment_paypal_email' => ['nullable', Rule::requiredIf($request->input('payment_method') === 'paypal'), 'email', 'max:255'],
            'payment_cardholder_name' => ['nullable', Rule::requiredIf($request->input('payment_method') === 'card'), 'string', 'max:255'],
            'payment_card_number' => ['nullable', Rule::requiredIf($request->input('payment_method') === 'card'), 'string', 'max:25'],
            'payment_exp_month' => ['nullable', Rule::requiredIf($request->input('payment_method') === 'card'), 'integer', 'between:1,12'],
            'payment_exp_year' => ['nullable', Rule::requiredIf($request->input('payment_method') === 'card'), 'integer', 'between:'.now()->year.','.now()->addYears(20)->year],
            'payment_cvv' => ['nullable', Rule::requiredIf($request->input('payment_method') === 'card'), 'digits_between:3,4'],
        ]);

        if ($validated['payment_method'] === 'paypal') {
            $charge = $paypalBillingService->charge($validated['payment_paypal_email'], $cartSummary['total']);
        } else {
            try {
                $charge = $billingService->charge([
                    'cardholder_name' => $validated['payment_cardholder_name'],
                    'number' => $validated['payment_card_number'],
                    'exp_month' => $validated['payment_exp_month'],
                    'exp_year' => $validated['payment_exp_year'],
                    'cvv' => $validated['payment_cvv'],
                ], $cartSummary['total']);
            } catch (UnsupportedCardException $exception) {
                throw ValidationException::withMessages([
                    'payment_card_number' => $exception->getMessage(),
                ]);
            }
        }

        $order = DB::transaction(function () use ($validated, $cartSummary, $charge) {
            $order = Order::create([
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'shipping_address' => $validated['shipping_address'],
                'order_number' => 'ORD-'.strtoupper(Str::random(8)),
                'subtotal' => $cartSummary['subtotal'],
                'shipping_fee' => $cartSummary['shipping_fee'],
                'total' => $cartSummary['total'],
                'status' => $charge['status'] === 'captured' ? 'paid' : 'pending',
                'payment_method' => $validated['payment_method'],
                'payment_brand' => $charge['brand'],
                'payment_last_four' => $charge['last_four'],
                'payment_reference' => $charge['reference'],
                'paid_at' => $charge['paid_at'],
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
