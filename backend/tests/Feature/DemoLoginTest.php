<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DemoRecipeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DemoLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_seeder_is_repeatable_and_credentials_allow_access_to_recipes(): void
    {
        $this->seed(DemoRecipeSeeder::class);
        $this->seed(DemoRecipeSeeder::class);
        $this->assertDatabaseCount('users', 1);
        $this->assertDatabaseCount('recipes', 3);
        $response = $this->postJson('/api/login', ['email' => 'demo@example.com', 'password' => 'Recetas123!'])
            ->assertOk();
        $this->withToken($response->json('token'))->getJson('/api/recipes')->assertOk()->assertJsonCount(3, 'data');
    }
}
