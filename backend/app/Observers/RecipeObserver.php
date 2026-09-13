<?php

namespace App\Observers;

use App\Models\Recipe;
use Illuminate\Support\Facades\Log;

class RecipeObserver
{
    public function created(Recipe $recipe): void
    {
        Log::info('Recipe created', [
            'recipe_id' => $recipe->id,
            'user_id' => $recipe->user_id,
        ]);
    }

    public function updated(Recipe $recipe): void
    {
        Log::info('Recipe updated', [
            'recipe_id' => $recipe->id,
            'user_id' => $recipe->user_id,
        ]);
    }

    public function deleted(Recipe $recipe): void
    {
        Log::info('Recipe deleted', [
            'recipe_id' => $recipe->id,
            'user_id' => $recipe->user_id,
        ]);
    }
}
