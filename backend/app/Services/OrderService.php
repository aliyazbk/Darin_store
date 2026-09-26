<?php

namespace App\Services;

use App\Models\Order;
use App\Models\ProductVarient;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function preview(array $items): array
    {
        return $this->priceItems($items);
    }

    private function priceItems(array $items, bool $lock = false): array
    {
        $requestedItems = collect($items);

        $query = ProductVarient::query()
            ->with('product.category')
            ->whereIn('id', $requestedItems->pluck('variant_id'));

        $variants = ($lock ? $query->lockForUpdate() : $query)
            ->get()
            ->keyBy('id');

        $calculatedItems = [];
        $subtotal = 0;

        foreach ($requestedItems as $requestedItem) {
            $variant = $variants->get($requestedItem['variant_id']);
            $quantity = $requestedItem['quantity'];

            if (
                !$variant ||
                !$variant->is_active ||
                !$variant->product ||
                !$variant->product->is_active ||
                !$variant->product->category?->is_active
            ) {
                throw ValidationException::withMessages([
                    'items' => ['One of the selected products is unavailable.'],
                ]);
            }

            if ($variant->stock_quantity < $quantity) {
                throw ValidationException::withMessages([
                    'items' => [
                        "{$variant->product->name} ({$variant->size} / {$variant->color}) does not have enough stock.",
                    ],
                ]);
            }

            $unitPrice = ProductPricing::finalPrice(
                $variant->product,
                $variant
            );

            $lineTotal = round($unitPrice * $quantity, 2);
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

        $subtotal = round($subtotal, 2);
        $deliveryFee = (float) config('store.delivery_fee');

        return [
            'items' => $calculatedItems,
            'subtotal' => $subtotal,
            'delivery_fee' => $deliveryFee,
            'total' => round($subtotal + $deliveryFee, 2),
            'currency' => config('store.currency'),
        ];
    }

    public function create(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            $quote = $this->priceItems($data['items'], true);

            if (
                (int) round($data['expected_total'] * 100) !==
                (int) round($quote['total'] * 100)
            ) {
                throw ValidationException::withMessages([
                    'items' => [
                        'The order total changed. Review the updated prices before placing your order.',
                    ],
                ]);
            }

            $order = Order::create([
                'order_number' => 'DRN-' . Str::upper(Str::random(10)),
                'customer_name' => $data['customer_name'],
                'phone' => $data['phone'],
                'email' => $data['email'] ?? null,
                'governorate' => $data['governorate'],
                'city' => $data['city'],
                'street_name' => $data['street_name'],
                'address' => $data['address'],
                'landmark' => $data['landmark'] ?? null,
                'customer_note' => $data['customer_note'] ?? null,
                'subtotal' => $quote['subtotal'],
                'delivery_fee' => $quote['delivery_fee'],
                'total' => $quote['total'],
                'currency' => $quote['currency'],
                'status' => 'pending',
            ]);

            $order->items()->createMany($quote['items']);

            foreach ($quote['items'] as $item) {
                ProductVarient::whereKey($item['product_variant_id'])
                    ->decrement('stock_quantity', $item['quantity']);
            }

            return $order->load('items');
        });
    }
}