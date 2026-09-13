<?php

namespace Tests\Feature;

use App\Models\Recipe;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SecurityAndObserverTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_hashes_password_and_rejects_duplicate_email(): void
    {
        $data = ['name' => 'Prueba', 'email' => 'test@example.com', 'password' => 'password123'];
        $this->postJson('/api/register', $data)->assertCreated();
        $this->assertTrue(Hash::check($data['password'], User::first()->password));
        $this->postJson('/api/register', $data)->assertUnprocessable()->assertJsonValidationErrors('email');
    }

    public function test_logout_revokes_only_current_bearer_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('current');
        $other = $user->createToken('other');
        $this->withToken($token->plainTextToken)->postJson('/api/logout')->assertOk();
        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $token->accessToken->id]);
        $this->assertDatabaseHas('personal_access_tokens', ['id' => $other->accessToken->id]);
        $this->app['auth']->forgetGuards();
        $this->withToken($token->plainTextToken)->getJson('/api/recipes')->assertUnauthorized();
    }

    public function test_client_cannot_assign_or_transfer_ownership(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        Sanctum::actingAs($owner);
        $attributes = Recipe::factory()->make()->toArray();
        $attributes['user_id'] = $other->id;
        $response = $this->postJson('/api/recipes', $attributes)->assertCreated()->assertJsonPath('data.user_id', $owner->id);
        $id = $response->json('data.id');
        $this->patchJson('/api/recipes/'.$id, ['user_id' => $other->id, 'title' => 'Nuevo t?tulo'])
            ->assertOk()->assertJsonPath('data.user_id', $owner->id);
        $this->assertDatabaseHas('recipes', ['id' => $id, 'user_id' => $owner->id, 'title' => 'Nuevo t?tulo']);
    }

    public function test_observer_logs_all_three_model_events(): void
    {
        Log::spy();
        $recipe = Recipe::factory()->create();
        $recipe->update(['title' => 'T?tulo actualizado']);
        $recipe->delete();
        foreach (['created', 'updated', 'deleted'] as $event) {
            Log::shouldHaveReceived('info')->with('Recipe '.$event, [
                'recipe_id' => $recipe->id, 'user_id' => $recipe->user_id,
            ])->once();
        }
        $this->assertDatabaseMissing('recipes', ['id' => $recipe->id]);
    }

    public function test_invalid_numeric_fields_and_url_return_validation_errors(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $this->postJson('/api/recipes', array_merge(Recipe::factory()->make()->toArray(), [
            'preparation_time' => -1, 'cooking_time' => 1.5, 'servings' => 0, 'image_url' => 'invalid',
        ]))->assertUnprocessable()->assertJsonValidationErrors(['preparation_time', 'cooking_time', 'servings', 'image_url']);
    }
}
