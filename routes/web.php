<?php

use App\Http\Controllers\Auth\CreateAccountController;
use App\Http\Controllers\Auth\SignInController;
use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\CollectionController;
use App\Http\Controllers\Shop\CheckoutController;
use App\Http\Controllers\Shop\HomeController;
use App\Http\Controllers\Shop\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');
Route::get('/collections/{category:slug}', [CollectionController::class, 'show'])->name('collections.show');

Route::get('/sign-in', [SignInController::class, 'create'])->name('sign-in');
Route::post('/sign-in', [SignInController::class, 'store'])->name('sign-in.store');
Route::post('/sign-out', [SignInController::class, 'destroy'])->name('sign-out');

Route::get('/create-account', [CreateAccountController::class, 'create'])->name('create-account');
Route::post('/create-account', [CreateAccountController::class, 'store'])->name('create-account.store');

Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::patch('/cart/{product}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{product}', [CartController::class, 'destroy'])->name('cart.destroy');

Route::get('/checkout', [CheckoutController::class, 'create'])->name('checkout.create');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/success/{order}', [CheckoutController::class, 'success'])->name('checkout.success');
