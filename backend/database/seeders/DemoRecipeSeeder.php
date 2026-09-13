<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoRecipeSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(['email' => 'demo@example.com'], [
            'name' => 'Usuario de demostración',
            'password' => Hash::make('Recetas123!'),
        ]);

        $dishes = [
            ['Arroz con verduras', 'Almuerzo', "1 taza de arroz\n2 tazas de agua\n1 zanahoria\n100 g de arvejas", 'Cortar las verduras. Cocinar el arroz con el agua 18 minutos. Agregar las verduras y cocinar 7 minutos más.', 25],
            ['Tortilla de espinaca', 'Desayuno', "2 huevos\n50 g de espinaca\n1 cucharadita de aceite", 'Batir los huevos. Mezclar con la espinaca lavada y picada. Cocinar en sartén con aceite 3 minutos por lado.', 6],
            ['Ensalada de garbanzos', 'Almuerzo', "200 g de garbanzos cocidos\n1 tomate\nMedio pepino\n1 limón", 'Lavar y cortar las verduras. Mezclar con los garbanzos y el jugo de limón. Servir.', 0],
        ];

        foreach ($dishes as [$title, $category, $ingredients, $instructions, $cookingTime]) {
            $user->recipes()->firstOrCreate(['title' => $title], [
                'description' => 'Receta casera de demostración.',
                'ingredients' => $ingredients, 'instructions' => $instructions,
                'category' => $category, 'difficulty' => 'easy',
                'preparation_time' => 10, 'cooking_time' => $cookingTime,
                'servings' => 2, 'image_url' => null,
            ]);
        }
    }
}
