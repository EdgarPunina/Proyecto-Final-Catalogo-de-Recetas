<?php

namespace Database\Factories;

use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Recipe> */
class RecipeFactory extends Factory
{
    protected $model = Recipe::class;

    public function definition(): array
    {
        $dish = fake()->randomElement([
            ['Arroz con verduras', 'Almuerzo', '1 taza de arroz\n2 tazas de agua\n1 zanahoria\n100 g de arvejas', 'Lavar y cortar las verduras. Cocinar el arroz en agua durante 18 minutos. Agregar las verduras y cocinar 7 minutos más.'],
            ['Tortilla de espinaca', 'Desayuno', '2 huevos\n50 g de espinaca\n1 cucharadita de aceite\nSal al gusto', 'Lavar y picar la espinaca. Batir los huevos con sal. Mezclar y cocinar en una sartén con aceite 3 minutos por lado.'],
            ['Ensalada de garbanzos', 'Almuerzo', '200 g de garbanzos cocidos\n1 tomate\nMedio pepino\n1 limón', 'Lavar y cortar el tomate y el pepino. Mezclar con los garbanzos. Añadir el jugo de limón y servir.'],
            ['Compota de manzana', 'Postre', '2 manzanas\n100 ml de agua\nCanela al gusto', 'Pelar y cortar las manzanas. Cocinar con el agua y la canela durante 15 minutos. Triturar y dejar enfriar.'],
        ]);
        return [
            'user_id' => User::factory(),
            'title' => $dish[0],
            'description' => 'Una receta casera sencilla para compartir.',
            'ingredients' => str_replace('\\n', "\n", $dish[2]),
            'instructions' => $dish[3],
            'category' => $dish[1],
            'difficulty' => 'easy',
            'preparation_time' => 10,
            'cooking_time' => $dish[0] === 'Ensalada de garbanzos' ? 0 : 25,
            'servings' => 2,
            'image_url' => null,
        ];
    }
}
