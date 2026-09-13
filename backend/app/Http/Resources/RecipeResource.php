<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'description' => $this->description,
            'ingredients' => $this->ingredients,
            'instructions' => $this->instructions,
            'category' => $this->category,
            'difficulty' => $this->difficulty,
            'preparation_time' => $this->preparation_time,
            'cooking_time' => $this->cooking_time,
            'servings' => $this->servings,
            'image_url' => $this->image_url,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
