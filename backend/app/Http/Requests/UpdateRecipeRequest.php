<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRecipeRequest extends StoreRecipeRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'ingredients' => ['sometimes', 'required', 'string'],
            'instructions' => ['sometimes', 'required', 'string'],
            'category' => ['sometimes', 'required', 'string', 'max:100'],
            'difficulty' => ['sometimes', 'required', 'string', Rule::in(['easy', 'medium', 'hard'])],
            'preparation_time' => ['sometimes', 'required', 'integer', 'min:0'],
            'cooking_time' => ['sometimes', 'required', 'integer', 'min:0'],
            'servings' => ['sometimes', 'required', 'integer', 'min:1'],
            'image_url' => ['nullable', 'url', 'max:255'],
        ];
    }
}
