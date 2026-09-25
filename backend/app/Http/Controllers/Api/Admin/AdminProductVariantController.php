<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductVariantRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Admin\UpdateProductVariantRequest;
use App\Models\ProductVarient;

class AdminProductVariantController extends Controller
{
    public function store(
        StoreProductVariantRequest $request,
        Product $product
    ): JsonResponse {
        $variant = $product->variants()->create(
            $request->validated()
        );

        return response()->json([
            'message' => 'Product variant created successfully.',
            'variant' => $variant,
        ], 201);
    }
    public function update(
    UpdateProductVariantRequest $request,
    Product $product,
    ProductVarient $variant
): JsonResponse {
    abort_if(
        $variant->product_id !== $product->id,
        404
    );

    $variant->update($request->validated());

    return response()->json([
        'message' => 'Product variant updated successfully.',
        'variant' => $variant->fresh(),
    ]);
}

public function destroy(
    Product $product,
    ProductVarient $variant
): JsonResponse {
    abort_if(
        $variant->product_id !== $product->id,
        404
    );

    // Preserve variants referenced by previous orders.
    $variant->update([
        'is_active' => false,
    ]);

    return response()->json([
        'message' => 'Product variant deactivated successfully.',
    ]);
}
}