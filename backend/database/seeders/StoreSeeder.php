<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVarient;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::updateOrCreate(
            ['slug' => 'dresses'],
            [
                'name' => 'Dresses',
                'description' => 'Women’s dresses for different occasions.',
                'is_active' => true,
                'display_order' => 1,
            ]
        );

        $product = Product::updateOrCreate(
            ['slug' => 'classic-black-dress'],
            [
                'category_id' => $category->id,
                'name' => 'Classic Black Dress',
                'description' => 'An elegant black dress for evening occasions.',
                'base_price' => 35.00,
                'compare_at_price' => 45.00,
                'is_active' => true,
                'is_featured' => true,
            ]
        );

        ProductVarient::updateOrCreate(
            ['sku' => 'DRS-BLK-S'],
            [
                'product_id' => $product->id,
                'size' => 'S',
                'color' => 'Black',
                'stock_quantity' => 5,
                'price' => null,
                'is_active' => true,
            ]
        );

        ProductVarient::updateOrCreate(
            ['sku' => 'DRS-BLK-M'],
            [
                'product_id' => $product->id,
                'size' => 'M',
                'color' => 'Black',
                'stock_quantity' => 8,
                'price' => null,
                'is_active' => true,
            ]
        );

        ProductImage::updateOrCreate(
            [
                'product_id' => $product->id,
                'image_path' => 'products/classic-black-dress.jpg',
            ],
            [
                'alt_text' => 'Classic black dress',
                'is_primary' => true,
                'display_order' => 1,
            ]
        );
    }
}