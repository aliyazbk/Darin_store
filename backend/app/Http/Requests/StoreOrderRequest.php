<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => [
                'required',
                'string',
                'max:255',
            ],
            'phone' => [
                'required',
                'string',
                'max:30',
                'regex:/^[0-9+\s()-]+$/',
            ],
            'email' => [
                'nullable',
                'email',
                'max:255',
            ],
            'governorate' => [
                'required',
                'string',
                'max:100',
            ],
            'city' => [
                'required',
                'string',
                'max:100',
            ],
            'address' => [
                'required',
                'string',
                'max:1000',
            ],
            'landmark' => [
                'nullable',
                'string',
                'max:255',
            ],
            'customer_note' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'items' => [
                'required',
                'array',
                'min:1',
                'max:50',
            ],
            'items.*.variant_id' => [
                'required',
                'integer',
                'distinct',
            ],
            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
                'max:20',
            ],
            'street_name' =>  [
                'required', 
                  'string',
                    'max:255'
            ],
             'address' =>[
                'required',
                'string'
             ,  'max:500'
             ],


             'sale_percentage' => [
             'required',
             'integer',
             'in:0,25,50,75',
            ],
            ];
        
    }
}