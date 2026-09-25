<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductVariantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $product = $this->route('product');

        return [
            'sku' => [
                'required',
                'string',
                'max:100',
                'unique:product_varients,sku',
            ],

            'size' => [
                'required',
                'string',
                'max:50',

                Rule::unique('product_varients', 'size')
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
                'sometimes',
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'sku.unique' =>
                'This SKU is already being used.',

            'size.unique' =>
                'This size and color combination already exists.',
        ];
    }
}