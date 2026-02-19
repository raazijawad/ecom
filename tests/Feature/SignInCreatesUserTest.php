<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SignInCreatesUserTest extends TestCase
{
    use RefreshDatabase;

    public function test_sign_in_creates_a_user_when_email_does_not_exist(): void
    {
        $response = $this->post(route('sign-in.store'), [
            'email' => 'new.customer@example.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('home'));

        $user = User::query()->where('email', 'new.customer@example.com')->first();

        $this->assertNotNull($user);
        $this->assertSame('New Customer', $user->name);
        $this->assertFalse($user->is_admin);
        $this->assertAuthenticatedAs($user);
    }
}
