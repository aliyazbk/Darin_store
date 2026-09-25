<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductVarient;

class ProductPricing
{
    public static function originalPrice(
        Product $product,
        ?ProductVarient $variant = null
    ): float {
        return (float) ($variant?->price ?? $product->base_price);
    }

    public static function finalPrice(
        Product $product,
        ?ProductVarient $variant = null
    ): float {
        $original = self::originalPrice($product, $variant);
        $percentage = (int) $product->sale_percentage;

        return round($original * (100 - $percentage) / 100, 2);
    }
}