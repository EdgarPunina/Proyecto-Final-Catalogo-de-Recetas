<?php

namespace Database\Seeders;

use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $userA = User::factory()->create([
            'name' => 'Alice',
            'email' => 'alice@example.com',
            'password' => Hash::make('password123'),
        ]);

        $userB = User::factory()->create([
            'name' => 'Bob',
            'email' => 'bob@example.com',
            'password' => Hash::make('password123'),
        ]);

        Recipe::factory()->count(3)->create([
            'user_id' => $userA->id,
        ]);

        Recipe::factory()->count(2)->create([
            'user_id' => $userB->id,
        ]);
    }
}
