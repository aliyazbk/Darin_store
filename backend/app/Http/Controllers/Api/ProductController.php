<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'max:150'],
        ]);

        $products = Product::query()
            ->where('is_active', true)
            ->whereHas('category', function ($query) use ($validated) {
                $query->where('is_active', true);

                if (!empty($validated['category'])) {
                    $query->where('slug', $validated['category']);
                }
            })
            ->when(
                !empty($validated['search']),
                function ($query) use ($validated) {
                    $term = $validated['search'];

                    $query->where(function ($query) use ($term) {
                        $query->where('name', 'like', "%{$term}%")
                            ->orWhere('description', 'like', "%{$term}%");
                    });
                }
            )
            ->with([
                'category:id,name,slug',
                'variants' => function ($query) {
                    $query->where('is_active', true)
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
                $query->where('is_active', true)
                    ->where('stock_quantity', '>', 0);
            },
            'images',
        ]);

        return response()->json($product);
    }
}