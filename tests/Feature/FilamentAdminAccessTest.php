<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FilamentAdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_user_can_access_admin_panel(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->actingAs($admin)
            ->followingRedirects()
            ->get('/admin')
            ->assertOk();
    }

    public function test_employee_is_redirected_to_admin_login(): void
    {
        $employee = User::factory()->create([
            'role' => 'employee',
        ]);

        $this->actingAs($employee)
            ->get('/admin')
            ->assertRedirect('/admin/login');
    }
}
