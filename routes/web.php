<?php

use App\Http\Controllers\Auth\SignInController;
use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\CheckoutController;
use App\Http\Controllers\Shop\HomeController;
use App\Http\Controllers\Shop\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

Route::middleware('guest')->group(function (): void {
    Route::get('/sign-in', SignInController::class)->name('sign-in');
    Route::post('/sign-in', [SignInController::class, 'login'])->name('sign-in.login');
    Route::post('/sign-up', [SignInController::class, 'register'])->name('sign-up.register');
});

Route::post('/logout', [SignInController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::patch('/cart/{product}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{product}', [CartController::class, 'destroy'])->name('cart.destroy');

Route::get('/checkout', [CheckoutController::class, 'create'])->name('checkout.create');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/success/{order}', [CheckoutController::class, 'success'])->name('checkout.success');
