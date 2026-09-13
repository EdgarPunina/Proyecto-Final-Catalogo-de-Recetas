<?php

namespace Tests\Feature;

use App\Models\Recipe;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RecipeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_returns_token_for_valid_user(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Alice',
            'email' => 'alice@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email'],
                'token',
            ]);
    }

    public function test_login_returns_token_for_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'alice@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'alice@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email'],
                'token',
            ]);
    }

    public function test_login_with_invalid_credentials_returns_401(): void
    {
        User::factory()->create([
            'email' => 'alice@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'alice@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401);
    }

    public function test_recipes_require_authentication(): void
    {
        $response = $this->getJson('/api/recipes');

        $response->assertStatus(401);
    }

    public function test_user_can_only_list_own_recipes(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        Recipe::factory()->count(2)->create(['user_id' => $userA->id]);
        Recipe::factory()->count(3)->create(['user_id' => $userB->id]);

        Sanctum::actingAs($userA);

        $response = $this->getJson('/api/recipes');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_user_can_create_valid_recipe(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/recipes', [
            'title' => 'Pasta Primavera',
            'description' => 'Una receta ligera.',
            'ingredients' => 'Pasta, tomate, albahaca',
            'instructions' => 'Cocinar pasta y mezclar con ingredientes.',
            'category' => 'Dinner',
            'difficulty' => 'easy',
            'preparation_time' => 10,
            'cooking_time' => 20,
            'servings' => 2,
            'image_url' => 'https://example.com/pasta.jpg',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'Pasta Primavera');
    }

    public function test_invalid_recipe_returns_422(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/recipes', [
            'title' => '',
            'difficulty' => 'wrong',
        ]);

        $response->assertStatus(422);
    }

    public function test_user_can_view_own_recipe(): void
    {
        $user = User::factory()->create();
        $recipe = Recipe::factory()->create(['user_id' => $user->id]);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/recipes/' . $recipe->id);

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $recipe->id);
    }

    public function test_user_can_update_own_recipe(): void
    {
        $user = User::factory()->create();
        $recipe = Recipe::factory()->create(['user_id' => $user->id]);
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/recipes/' . $recipe->id, [
            'title' => 'Pasta actualizada',
            'ingredients' => 'Pasta, queso',
            'instructions' => 'Nuevo procedimiento',
            'category' => 'Dinner',
            'difficulty' => 'medium',
            'preparation_time' => 5,
            'cooking_time' => 15,
            'servings' => 3,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.title', 'Pasta actualizada');
    }

    public function test_user_can_delete_own_recipe(): void
    {
        $user = User::factory()->create();
        $recipe = Recipe::factory()->create(['user_id' => $user->id]);
        Sanctum::actingAs($user);

        $response = $this->deleteJson('/api/recipes/' . $recipe->id);

        $response->assertStatus(200);
    }

    public function test_user_cannot_view_other_users_recipe(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $recipe = Recipe::factory()->create(['user_id' => $userB->id]);
        Sanctum::actingAs($userA);

        $response = $this->getJson('/api/recipes/' . $recipe->id);

        $response->assertStatus(404);
    }

    public function test_user_cannot_update_other_users_recipe(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $recipe = Recipe::factory()->create(['user_id' => $userB->id]);
        Sanctum::actingAs($userA);

        $response = $this->putJson('/api/recipes/' . $recipe->id, [
            'title' => 'Intento',
            'ingredients' => 'X',
            'instructions' => 'Y',
            'category' => 'Dinner',
            'difficulty' => 'easy',
            'preparation_time' => 1,
            'cooking_time' => 1,
            'servings' => 1,
        ]);

        $response->assertStatus(404);
    }

    public function test_user_cannot_delete_other_users_recipe(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $recipe = Recipe::factory()->create(['user_id' => $userB->id]);
        Sanctum::actingAs($userA);

        $response = $this->deleteJson('/api/recipes/' . $recipe->id);

        $response->assertStatus(404);
    }
}
