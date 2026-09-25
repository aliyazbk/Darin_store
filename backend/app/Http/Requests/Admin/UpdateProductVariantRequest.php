<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductVariantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $product = $this->route('product');
        $variant = $this->route('variant');

        return [
            'sku' => [
                'required',
                'string',
                'max:100',

                Rule::unique('product_varients', 'sku')
                    ->ignore($variant->id),
            ],

            'size' => [
                'required',
                'string',
                'max:50',

                Rule::unique('product_varients', 'size')
                    ->ignore($variant->id)
                    ->where(function ($query) use ($product) {
                        return $query
                            ->where('product_id', $product->id)
                            ->where('color', $this->input('color'));
                    }),
            ],

            'color' => [
                'required',
                'string',
                'max:100',
            ],

            'stock_quantity' => [
                'required',
                'integer',
                'min:0',
            ],

            'price' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'is_active' => [
                'required',
                'boolean',
            ],
        ];
    }
}