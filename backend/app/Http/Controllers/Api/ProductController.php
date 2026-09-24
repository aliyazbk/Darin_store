<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::query()
            ->where('is_active', true)
            ->with([
                'category:id,name,slug',
                'variants' => function ($query) {
                    $query
                        ->where('is_active', true)
                        ->where('stock_quantity', '>', 0);
                },
                'images',
            ])
            ->latest()
            ->paginate(12);

        return response()->json($products);
    }

    public function show(Product $product): JsonResponse
    {
        abort_if(!$product->is_active, 404);

        $product->load([
            'category:id,name,slug',
            'variants' => function ($query) {
                $query
                    ->where('is_active', true)
                    ->where('stock_quantity', '>', 0);
            },
            'images',
        ]);

        return response()->json($product);
    }
}