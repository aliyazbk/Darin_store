<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class OrderController extends Controller
{
    public function preview(
    Request $request,
    OrderService $orderService
): JsonResponse {
    $items = Validator::make($request->all(), [
        'items' => ['required', 'array', 'min:1', 'max:50'],
        'items.*.variant_id' => ['required', 'integer', 'distinct'],
        'items.*.quantity' => ['required', 'integer', 'min:1', 'max:20'],
    ])->validate()['items'];

    return response()->json([
        'quote' => $orderService->preview($items),
    ]);
}
    public function store(
        StoreOrderRequest $request,
        OrderService $orderService
    ): JsonResponse {
        $order = $orderService->create(
            $request->validated()
        );

        return response()->json([
            'message' => 'Order placed successfully.',
            'order' => $order,
        ], 201);
    }
}