<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CreateAccountRedirectTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_account_logs_user_in_and_redirects_to_customer_dashboard(): void
    {
        $response = $this->post(route('create-account.store'), [
            'name' => 'Jane Customer',
            'email' => 'jane.customer@example.com',
            'phone' => '+123456789',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'agreement' => true,
        ]);

        $response->assertRedirect(route('customer.dashboard'));

        $user = User::query()->where('email', 'jane.customer@example.com')->first();

        $this->assertNotNull($user);
        $this->assertSame('+123456789', $user->phone);
        $this->assertSame('customer', $user->role);
        $this->assertTrue(Hash::check('password123', $user->password));
        $this->assertAuthenticatedAs($user);
    }

    public function test_create_account_requires_agreement_and_phone(): void
    {
        $response = $this->from(route('create-account'))->post(route('create-account.store'), [
            'name' => 'Jane Customer',
            'email' => 'jane.customer@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'agreement' => false,
        ]);

        $response->assertRedirect(route('create-account'));
        $response->assertSessionHasErrors(['phone', 'agreement']);
        $this->assertGuest();
    }
}
