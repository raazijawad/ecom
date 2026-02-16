<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TestimonialFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_create_testimonial(): void
    {
        $response = $this->post(route('testimonials.store'), [
            'comment' => 'Great experience!',
        ]);

        $response->assertRedirect(route('sign-in'));
        $this->assertDatabaseCount('testimonials', 0);
    }

    public function test_logged_in_user_can_create_testimonial(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('testimonials.store'), [
                'comment' => 'Great comfort and fast delivery.',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('testimonials', [
            'user_id' => $user->id,
            'comment' => 'Great comfort and fast delivery.',
        ]);
    }

    public function test_home_page_receives_testimonials_with_user_details(): void
    {
        Category::query()->create([
            'name' => 'Running',
            'slug' => 'running',
            'description' => 'Running shoes',
        ]);
        $user = User::factory()->create(['name' => 'Customer One', 'email' => 'customer@example.com']);
        Testimonial::query()->create([
            'user_id' => $user->id,
            'comment' => 'Amazing sneakers.',
        ]);

        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('shop/home')
            ->has('testimonials', 1)
            ->where('testimonials.0.user.name', 'Customer One')
            ->where('testimonials.0.user.email', 'customer@example.com')
            ->where('testimonials.0.comment', 'Amazing sneakers')
        );
    }
}
