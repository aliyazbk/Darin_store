<?php

namespace App\Services;

use App\Models\Order;
use App\Models\ProductVarient;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function create(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            $requestedItems = collect($data['items']);

            $variants = ProductVarient::query()
                ->with('product')
                ->whereIn(
                    'id',
                    $requestedItems->pluck('variant_id')
                )
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $calculatedItems = [];
            $subtotal = 0;

            foreach ($requestedItems as $requestedItem) {
                $variant = $variants->get(
                    $requestedItem['variant_id']
                );

                $quantity = $requestedItem['quantity'];

                if (
                    !$variant ||
                    !$variant->is_active ||
                    !$variant->product ||
                    !$variant->product->is_active
                ) {
                    throw ValidationException::withMessages([
                        'items' => [
                            'One of the selected products is unavailable.',
                        ],
                    ]);
                }

                if ($variant->stock_quantity < $quantity) {
                    throw ValidationException::withMessages([
                        'items' => [
                            "{$variant->product->name} "
                            . "({$variant->size} / {$variant->color}) "
                            . "does not have enough stock.",
                        ],
                    ]);
                }

                $unitPrice = (float) (
                    $variant->price
                    ?? $variant->product->base_price
                );

                $lineTotal = round(
                    $unitPrice * $quantity,
                    2
                );

                $subtotal += $lineTotal;

                $calculatedItems[] = [
                    'product_variant_id' => $variant->id,
                    'product_name' => $variant->product->name,
                    'sku' => $variant->sku,
                    'size' => $variant->size,
                    'color' => $variant->color,
                    'unit_price' => $unitPrice,
                    'quantity' => $quantity,
                    'line_total' => $lineTotal,
                ];
            }

            $deliveryFee = (float) config(
                'store.delivery_fee'
            );

            $subtotal = round($subtotal, 2);
            $total = round($subtotal + $deliveryFee, 2);

            $order = Order::create([
                'order_number' =>
                    'DRN-' . Str::upper(Str::random(10)),

                'customer_name' => $data['customer_name'],
                'phone' => $data['phone'],
                'email' => $data['email'] ?? null,
                'governorate' => $data['governorate'],
                'city' => $data['city'],
                'street_name' => $data['street_name'],
                'address' => $data['address'],
                'landmark' => $data['landmark'] ?? null,
                'customer_note' =>
                    $data['customer_note'] ?? null,

                'subtotal' => $subtotal,
                'delivery_fee' => $deliveryFee,
                'total' => $total,
                'currency' => config('store.currency'),
                'status' => 'pending',
            ]);

            $order->items()->createMany($calculatedItems);

            foreach ($requestedItems as $requestedItem) {
                $variants
                    ->get($requestedItem['variant_id'])
                    ->decrement(
                        'stock_quantity',
                        $requestedItem['quantity']
                    );
            }

            return $order->load('items');
        });
    }
}