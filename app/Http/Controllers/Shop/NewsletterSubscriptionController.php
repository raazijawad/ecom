<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NewsletterSubscriptionController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
        ]);

        Subscriber::query()->updateOrCreate(
            ['email' => $validated['email']],
            [
                'name' => $validated['name'] ?? $request->user()?->name,
                'subscribed_at' => now(),
            ],
        );

        return back()->with('success', 'Thanks for subscribing to our newsletter.');
    }
}
