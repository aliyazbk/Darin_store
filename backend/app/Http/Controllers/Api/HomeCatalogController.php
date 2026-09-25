<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Models\HomeSection;
class HomeCatalogController extends Controller
{
    public function index(): JsonResponse
    {
        $relations = [
            'category:id,name,slug',
            'images',
            'variants' => function ($query) {
                $query
                    ->where('is_active', true)
                    ->where('stock_quantity', '>', 0);
            },
        ];

        $available = function () use ($relations) {
            return Product::query()
                ->where('is_active', true)
                ->whereHas('category', function ($query) {
                    $query->where('is_active', true);
                })
                ->with($relations);
        };

        $onSale = $available()
            ->whereIn('sale_percentage', [25, 50, 75])
            ->latest()
            ->limit(8)
            ->get();

        $bestSellers = $available()
            ->addSelect([
                'sold_quantity' => DB::table('order_items')
                    ->join(
                        'product_varients',
                        'product_varients.id',
                        '=',
                        'order_items.product_varient_id'
                    )
                    ->join(
                        'orders',
                        'orders.id',
                        '=',
                        'order_items.order_id'
                    )
                    ->whereColumn(
                        'product_varients.product_id',
                        'products.id'
                    )
                    ->whereIn('orders.status', [
                        'confirmed',
                        'shipped',
                        'delivered',
                    ])
                    ->selectRaw(
                        'COALESCE(SUM(order_items.quantity), 0)'
                    ),
            ])
            ->whereHas('variants.orderItems.order', function ($query) {
                $query->whereIn('status', [
                    'confirmed',
                    'shipped',
                    'delivered',
                ]);
            })
            ->orderByDesc('sold_quantity')
            ->limit(8)
            ->get();

        $newest = $available()
            ->latest()
            ->limit(12)
            ->get();
            $sections = HomeSection::query()
    ->where('is_active', true)
    ->whereHas('category', function ($query) {
        $query->where('is_active', true);
    })
    ->with('category:id,name,slug')
    ->orderBy('display_order')
    ->orderBy('id')
    ->get()
    ->map(function (HomeSection $section) use ($available) {
        $section->setRelation(
            'products',
            $available()
                ->where('category_id', $section->category_id)
                ->latest()
                ->limit(8)
                ->get()
        );

        return $section;
    });

        return response()->json([
            'on_sale' => $onSale,
            'best_sellers' => $bestSellers,
            'newest' => $newest,
            'sections' => $sections,
        ]);
    }

    public function categories(): JsonResponse
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('display_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return response()->json([
            'categories' => $categories,
        ]);
    }
}