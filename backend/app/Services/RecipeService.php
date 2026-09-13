<?php

namespace App\Services;

use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class RecipeService
{
    public function listForUser(User $user): Collection
    {
        return Recipe::query()
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();
    }

    public function create(array $attributes, User $user): Recipe
    {
        $attributes['user_id'] = $user->id;

        return Recipe::create($attributes);
    }

    public function findOwnedById(User $user, int $id): Recipe
    {
        return $user->recipes()->findOrFail($id);
    }

    public function update(Recipe $recipe, array $attributes): Recipe
    {
        $recipe->fill($attributes);
        $recipe->save();

        return $recipe->fresh();
    }

    public function delete(Recipe $recipe): void
    {
        $recipe->delete();
    }
}
