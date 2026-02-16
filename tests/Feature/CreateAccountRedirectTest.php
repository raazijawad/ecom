<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateAccountRedirectTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_account_logs_user_in_and_redirects_to_home(): void
    {
        $response = $this->post(route('create-account.store'), [
            'name' => 'Jane Customer',
            'email' => 'jane.customer@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect(route('home'));

        $user = User::query()->where('email', 'jane.customer@example.com')->first();

        $this->assertNotNull($user);
        $this->assertAuthenticatedAs($user);
    }

    public function test_register_route_creates_customer_account(): void
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Public Customer',
            'email' => 'public.customer@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect(route('home'));

        $user = User::query()->where('email', 'public.customer@example.com')->first();

        $this->assertNotNull($user);
        $this->assertFalse((bool) $user->is_admin);
        $this->assertAuthenticatedAs($user);
    }
}
