<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductImageRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;

class AdminProductImageController extends Controller
{
    public function store(
        StoreProductImageRequest $request,
        Product $product
    ): JsonResponse {
        $validated = $request->validated();

        $path = $request->file('image')->store(
            "products/{$product->id}",
            'public'
        );
        $image = DB::transaction(function () use (
            $product,
            $validated,
            $path
        ) {
            $isPrimary =
                $validated['is_primary'] ??
                !$product->images()->exists();

            if ($isPrimary) {
                $product->images()->update([
                    'is_primary' => false,
                ]);
            }

            return $product->images()->create([
                'image_path' => $path,
                'alt_text' =>
                    $validated['alt_text'] ?? $product->name,
                'color' => $validated['color'] ?? null,
                'is_primary' => $isPrimary,

                'display_order' =>
                    $validated['display_order'] ?? 0,
            ]);
        });

        return response()->json([
            'message' => 'Product image uploaded successfully.',
            'image' => $image,
        ], 201);
    }
    public function setPrimary(
    Product $product,
    ProductImage $image
): JsonResponse {
    abort_if(
        $image->product_id !== $product->id,
        404
    );

    DB::transaction(function () use ($product, $image) {
        $product->images()->update([
            'is_primary' => false,
        ]);

        $image->update([
            'is_primary' => true,
        ]);
    });

    return response()->json([
        'message' => 'Primary image updated successfully.',
        'image' => $image->fresh(),
    ]);
}

public function destroy(
    Product $product,
    ProductImage $image
): JsonResponse {
    abort_if(
        $image->product_id !== $product->id,
        404
    );

    $imagePath = $image->image_path;
    $wasPrimary = $image->is_primary;

    DB::transaction(function () use (
        $product,
        $image,
        $wasPrimary
    ) {
        $image->delete();

        if ($wasPrimary) {
            $nextImage = $product
                ->images()
                ->orderBy('display_order')
                ->first();

            $nextImage?->update([
                'is_primary' => true,
            ]);
        }
    });

    Storage::disk('public')->delete($imagePath);

    return response()->json([
        'message' => 'Product image deleted successfully.',
    ]);
}
}