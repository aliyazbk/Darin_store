<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SaveCategoryRequest;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class AdminCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::query()
            ->withCount('products')
            ->orderBy('display_order')
            ->orderBy('name')
            ->get();

        return response()->json([
            'categories' => $categories,
        ]);
    }

    public function store(
        SaveCategoryRequest $request
    ): JsonResponse {
        $validated = $request->validated();

        $category = Category::create([
            ...$validated,
            'slug' => $this->createUniqueSlug(
                $validated['name']
            ),
        ]);

        return response()->json([
            'message' => 'Category created successfully.',
            'category' => $category,
        ], 201);
    }

    public function update(
        SaveCategoryRequest $request,
        Category $category
    ): JsonResponse {
        $validated = $request->validated();

        if ($category->name !== $validated['name']) {
            $validated['slug'] =
                $this->createUniqueSlug(
                    $validated['name'],
                    $category->id
                );
        }

        $category->update($validated);

        return response()->json([
            'message' => 'Category updated successfully.',
            'category' => $category->fresh(),
        ]);
    }

    private function createUniqueSlug(
        string $name,
        ?int $ignoreId = null
    ): string {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $number = 2;

        while (
            Category::query()
                ->when(
                    $ignoreId,
                    fn ($query) =>
                        $query->whereKeyNot($ignoreId)
                )
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$number}";
            $number++;
        }

        return $slug;
    }
}