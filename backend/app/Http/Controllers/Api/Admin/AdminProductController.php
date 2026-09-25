<?php

namespace App\Http\Controllers\Api\Admin;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdminProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $products = Product::query()
            ->with([
                'category:id,name,slug',
                'variants',
                'images',
            ])
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {
                    $search = $request->string('search');

                    $query->where(function ($query) use ($search) {
                        $query
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('slug', 'like', "%{$search}%");
                    });
                }
            )
            ->when(
                $request->filled('category_id'),
                fn ($query) => $query->where(
                    'category_id',
                    $request->integer('category_id')
                )
            )
            ->latest()
            ->paginate(15);

        return response()->json($products);
    }

    public function store(
        StoreProductRequest $request
    ): JsonResponse {
        $validated = $request->validated();

        $product = DB::transaction(function () use ($validated) {
            $baseSlug = Str::slug($validated['name']);
            $slug = $baseSlug;
            $number = 2;

            while (
                Product::where('slug', $slug)->exists()
            ) {
                $slug = "{$baseSlug}-{$number}";
                $number++;
            }

            $product = Product::create([
                'category_id' =>
                    $validated['category_id'],

                'name' =>
                    $validated['name'],

                'slug' =>
                    $slug,

                'description' =>
                    $validated['description'] ?? null,

                'base_price' =>
                    $validated['base_price'],

                'compare_at_price' =>
                    $validated['compare_at_price'] ?? null,
                'sale_percentage' =>
                     $validated['sale_percentage'],

                'is_active' =>
                    $validated['is_active'] ?? true,

                'is_featured' =>
                    $validated['is_featured'] ?? false,
                    
            ]);

            foreach ($validated['variants'] as $variant) {
                $product->variants()->create([
                    'sku' =>
                        $variant['sku'],

                    'size' =>
                        $variant['size'],

                    'color' =>
                        $variant['color'],

                    'stock_quantity' =>
                        $variant['stock_quantity'],

                    'price' =>
                        $variant['price'] ?? null,

                    'is_active' =>
                        $variant['is_active'] ?? true,
                ]);
            }

            return $product;
        });

        $product->load([
            'category:id,name,slug',
            'variants',
            'images',
        ]);

        return response()->json([
            'message' => 'Product created successfully.',
            'product' => $product,
        ], 201);
    }

    public function show(Product $product): JsonResponse
    {
        $product->load([
            'category:id,name,slug',
            'variants',
            'images',
        ]);

        return response()->json($product);
    }
    public function update(
    UpdateProductRequest $request,
    Product $product
): JsonResponse {
    $validated = $request->validated();

    if ($product->name !== $validated['name']) {
        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $number = 2;

        while (
            Product::where('slug', $slug)
                ->whereKeyNot($product->id)
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$number}";
            $number++;
        }

        $validated['slug'] = $slug;
    }

    $product->update($validated);

    $product->load([
        'category:id,name,slug',
        'variants',
        'images',
    ]);

    return response()->json([
        'message' => 'Product updated successfully.',
        'product' => $product,
    ]);
}
}