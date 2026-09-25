<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => [
                'required',
                'integer',
                'exists:categories,id',
            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'base_price' => [
                'required',
                'numeric',
                'min:0',
            ],

            'compare_at_price' => [
                'nullable',
                'numeric',
                'gte:base_price',
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],

            'is_featured' => [
                'sometimes',
                'boolean',
            ],

            'variants' => [
                'required',
                'array',
                'min:1',
            ],

            'variants.*.sku' => [
                'required',
                'string',
                'max:100',
                'distinct',
                'unique:product_varients,sku',
            ],

            'variants.*.size' => [
                'required',
                'string',
                'max:50',
            ],

            'variants.*.color' => [
                'required',
                'string',
                'max:100',
            ],

            'variants.*.stock_quantity' => [
                'required',
                'integer',
                'min:0',
            ],

            'variants.*.price' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'variants.*.is_active' => [
                'sometimes',
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.exists' =>
                'The selected category does not exist.',

            'variants.required' =>
                'Add at least one product variant.',

            'variants.*.sku.unique' =>
                'One of the SKUs is already being used.',

            'variants.*.sku.distinct' =>
                'Each variant must have a different SKU.',

            'compare_at_price.gte' =>
                'The comparison price must be greater than or equal to the base price.',
        ];
    }
}