<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StoreSetting;
use Illuminate\Http\JsonResponse;

class StoreSettingController extends Controller
{
    public function show(): JsonResponse
    {
        $settings = StoreSetting::firstOrCreate(
            ['id' => 1],
            [
                'hero_title' => 'Darin Clothet',
                'hero_button_text' => 'Shop now',
                'hero_button_url' => '/products',
            ]
        );

        return response()->json(['settings' => $settings]);
    }
}