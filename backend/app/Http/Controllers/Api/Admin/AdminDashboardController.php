<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVarient;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $statistics = [
            'total_products' =>
                Product::count(),

            'active_products' =>
                Product::where('is_active', true)->count(),

            'pending_orders' =>
                Order::where('status', 'pending')->count(),

            'low_stock_variants' =>
                ProductVarient::query()
                    ->where('is_active', true)
                    ->where('stock_quantity', '<=', 5)
                    ->count(),

            'delivered_orders' =>
                Order::where('status', 'delivered')->count(),

            'total_revenue' =>
                Order::where('status', 'delivered')
                    ->sum('total'),
        ];

        $recentOrders = Order::query()
            ->latest()
            ->limit(5)
            ->get([
                'id',
                'order_number',
                'customer_name',
                'total',
                'status',
                'created_at',
            ]);

        return response()->json([
            'statistics' => $statistics,
            'recent_orders' => $recentOrders,
        ]);
    }
}