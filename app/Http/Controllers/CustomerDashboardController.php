<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CustomerDashboardController extends Controller
{
    public function __invoke(): Response
    {
        $user = Auth::user();

        $recentOrders = Order::query()
            ->where('customer_email', $user->email)
            ->latest()
            ->take(5)
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'orderNumber' => $order->order_number,
                'orderDate' => $order->created_at->format('M d, Y'),
                'status' => ucfirst($order->status),
                'total' => '$'.number_format((float) $order->total, 2),
            ])
            ->values();

        return Inertia::render('customer/dashboard', [
            'recentOrders' => $recentOrders,
        ]);
    }
}
