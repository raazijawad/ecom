<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthSignInTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_from_sign_page(): void
    {
        $response = $this->post(route('sign-up.register'), [
            'name' => 'New Customer',
            'email' => 'new@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertRedirect(route('home'));
        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', [
            'email' => 'new@example.com',
            'is_admin' => false,
        ]);
    }

    public function test_admin_login_redirects_to_admin_panel(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => 'password',
            'is_admin' => true,
        ]);

        $response = $this->post(route('sign-in.login'), [
            'email' => $admin->email,
            'password' => 'password',
        ]);

        $response->assertRedirect('/admin');
        $this->assertAuthenticatedAs($admin);
    }

    public function test_regular_user_login_redirects_home(): void
    {
        $user = User::factory()->create([
            'password' => 'password',
            'is_admin' => false,
        ]);

        $response = $this->post(route('sign-in.login'), [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect(route('home'));
        $this->assertAuthenticatedAs($user);
    }
}
