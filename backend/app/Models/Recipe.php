<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Recipe extends Model
{
    use HasFactory;

    protected $casts = [
        'user_id' => 'integer',
        'preparation_time' => 'integer',
        'cooking_time' => 'integer',
        'servings' => 'integer',
    ];

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'ingredients',
        'instructions',
        'category',
        'difficulty',
        'preparation_time',
        'cooking_time',
        'servings',
        'image_url',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
