<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'comment' => ['required', 'string', 'max:1000'],
        ]);

        $request->user()->testimonials()->create($validated);

        return back();
    }
}

