<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRecipeRequest;
use App\Http\Requests\UpdateRecipeRequest;
use App\Http\Resources\RecipeResource;
use App\Services\RecipeService;
use Illuminate\Http\Request;

class RecipeController extends Controller
{
    public function __construct(protected RecipeService $recipeService)
    {
    }

    public function index(Request $request)
    {
        return RecipeResource::collection(
            $this->recipeService->listForUser($request->user())
        );
    }

    public function store(StoreRecipeRequest $request)
    {
        $recipe = $this->recipeService->create($request->validated(), $request->user());

        return new RecipeResource($recipe);
    }

    public function show(Request $request, int $id)
    {
        $recipe = $this->recipeService->findOwnedById($request->user(), $id);

        return new RecipeResource($recipe);
    }

    public function update(UpdateRecipeRequest $request, int $id)
    {
        $recipe = $this->recipeService->findOwnedById($request->user(), $id);
        $recipe = $this->recipeService->update($recipe, $request->validated());

        return new RecipeResource($recipe);
    }

    public function destroy(Request $request, int $id)
    {
        $recipe = $this->recipeService->findOwnedById($request->user(), $id);
        $this->recipeService->delete($recipe);

        return response()->json([
            'message' => 'Recipe deleted successfully.',
        ]);
    }
}
