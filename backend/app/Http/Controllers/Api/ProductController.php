public function index(\Illuminate\Http\Request $request)
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