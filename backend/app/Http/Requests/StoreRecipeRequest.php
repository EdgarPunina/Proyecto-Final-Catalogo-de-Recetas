<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRecipeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'ingredients' => ['required', 'string'],
            'instructions' => ['required', 'string'],
            'category' => ['required', 'string', 'max:100'],
            'difficulty' => ['required', 'string', Rule::in(['easy', 'medium', 'hard'])],
            'preparation_time' => ['required', 'integer', 'min:0'],
            'cooking_time' => ['required', 'integer', 'min:0'],
            'servings' => ['required', 'integer', 'min:1'],
            'image_url' => ['nullable', 'url', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'El campo :attribute es obligatorio.',
            'string' => 'El campo :attribute debe ser texto.',
            'integer' => 'El campo :attribute debe ser un número entero.',
            'min' => 'El campo :attribute debe ser al menos :min.',
            'max' => 'El campo :attribute no debe superar :max caracteres.',
            'in' => 'Selecciona una dificultad válida.',
            'url' => 'Introduce una URL de imagen válida.',
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => 'título', 'ingredients' => 'ingredientes',
            'instructions' => 'instrucciones', 'category' => 'categoría',
            'difficulty' => 'dificultad', 'preparation_time' => 'tiempo de preparación',
            'cooking_time' => 'tiempo de cocción', 'servings' => 'porciones',
            'image_url' => 'URL de imagen', 'description' => 'descripción',
        ];
    }
}
