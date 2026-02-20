<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SignOutRedirectTest extends TestCase
{
    use RefreshDatabase;

    public function test_sign_out_redirects_home_and_user_can_sign_in_again(): void
    {
        $user = User::factory()->create([
            'email' => 'customer@example.com',
            'password' => 'password123',
        ]);

        $this->actingAs($user)
            ->post(route('sign-out'))
            ->assertRedirect(route('home'));

        $this->assertGuest();

        $this->post(route('sign-in.store'), [
            'email' => 'customer@example.com',
            'password' => 'password123',
        ])->assertRedirect(route('home'));

        $this->assertAuthenticated();
    }
}
