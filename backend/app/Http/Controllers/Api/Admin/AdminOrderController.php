<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\ProductVarient;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
class AdminOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = Order::query()
            ->withCount('items')
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->string('status'));
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = trim($request->string('search'));

                $query->where(function ($query) use ($search) {
                    $query
                        ->where('customer_name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");

                    if (is_numeric($search)) {
                        $query->orWhere('id', (int) $search);
                    }
                });
            })
            ->latest()
            ->paginate(15);

        return response()->json($orders);
    }

    public function show(Order $order): JsonResponse
    {
        $order->load('items');

        return response()->json([
            'order' => $order,
        ]);
    }
    public function updateStatus(
    Request $request,
    Order $order
): JsonResponse {
    $validated = $request->validate([
        'status' => [
            'required',
            Rule::in([
                'pending',
                'confirmed',
                'shipped',
                'delivered',
                'cancelled',
            ]),
        ],
    ]);

    $allowedTransitions = [
        'pending' => ['confirmed', 'cancelled'],
        'confirmed' => ['shipped', 'cancelled'],
        'shipped' => ['delivered'],
        'delivered' => [],
        'cancelled' => [],
    ];

    $newStatus = $validated['status'];

    if ($newStatus === $order->status) {
        return response()->json([
            'message' => 'The order already has this status.',
            'order' => $order->load('items'),
        ]);
    }

    if (
        !in_array(
            $newStatus,
            $allowedTransitions[$order->status] ?? [],
            true
        )
    ) {
        throw ValidationException::withMessages([
            'status' => [
                "The order cannot move from {$order->status} to {$newStatus}.",
            ],
        ]);
    }

    $updatedOrder = DB::transaction(function () use ($order, $newStatus) {
        $lockedOrder = Order::query()
            ->with('items')
            ->lockForUpdate()
            ->findOrFail($order->id);

        if ($newStatus === 'cancelled') {
            foreach ($lockedOrder->items as $item) {
                
                    if ($item->product_varient_id) {
                    ProductVarient::whereKey($item->product_varient_id)
                        ->increment('stock_quantity', $item->quantity);

            }
        }
        }

        $lockedOrder->update([
            'status' => $newStatus,
        ]);

        return $lockedOrder->fresh('items');
    });

    return response()->json([
        'message' => 'Order status updated successfully.',
        'order' => $updatedOrder,
    ]);
}
}