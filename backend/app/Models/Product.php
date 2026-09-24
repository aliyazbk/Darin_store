<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
  
  protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'base_price',
        'compare_at_price',
        'is_active',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'base_price' => 'decimal:2',
            'compare_at_price' => 'decimal:2',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
    public function variants(): HasMany
{
    return $this->hasMany(ProductVarient::class);
}
public function images(): HasMany
{
    return $this->hasMany(ProductImage::class)
        ->orderBy('display_order');
}
}
