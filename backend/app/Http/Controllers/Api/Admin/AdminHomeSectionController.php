<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomeSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminHomeSectionController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'sections' => HomeSection::query()
                ->with('category:id,name,slug')
                ->orderBy('display_order')
                ->orderBy('id')
                ->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => [
                'required',
                'integer',
                'exists:categories,id',
                'unique:home_sections,category_id',
            ],
            'title' => ['required', 'string', 'max:100'],
            'display_order' => [
                'required',
                'integer',
                'min:0',
                'max:10000',
            ],
            'is_active' => ['required', 'boolean'],
        ]);

        $section = HomeSection::create($validated);

        return response()->json([
            'message' => 'Homepage section created.',
            'section' => $section->load('category:id,name,slug'),
        ], 201);
    }

    public function update(
        Request $request,
        HomeSection $section
    ): JsonResponse {
        $validated = $request->validate([
            'category_id' => [
                'required',
                'integer',
                'exists:categories,id',
                Rule::unique('home_sections', 'category_id')
                    ->ignore($section->id),
            ],
            'title' => ['required', 'string', 'max:100'],
            'display_order' => [
                'required',
                'integer',
                'min:0',
                'max:10000',
            ],
            'is_active' => ['required', 'boolean'],
        ]);

        $section->update($validated);

        return response()->json([
            'message' => 'Homepage section updated.',
            'section' => $section->fresh()
                ->load('category:id,name,slug'),
        ]);
    }

    public function destroy(HomeSection $section): JsonResponse
    {
        $section->delete();

        return response()->json([
            'message' => 'Homepage section removed.',
        ]);
    }
}