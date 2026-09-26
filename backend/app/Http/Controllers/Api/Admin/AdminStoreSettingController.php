<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\StoreSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminStoreSettingController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'hero_title' => ['required', 'string', 'max:150'],
            'hero_subtitle' => ['nullable', 'string', 'max:255'],
            'hero_button_text' => ['required', 'string', 'max:60'],
            'hero_button_url' => [
                'required',
                'string',
                'max:255',
                'regex:/^\/(?!\/)[A-Za-z0-9\/_-]*$/',
            ],
            'logo' => [
                'nullable',
                'file',
                'mimes:png,jpg,jpeg,webp,svg',
                'max:2048',
            ],
            'hero_video' => [
                'nullable',
                'file',
                'mimes:mp4,webm',
                'max:51200',
            ],
        ]);

        $settings = StoreSetting::firstOrCreate(['id' => 1]);

        $settings->fill([
            'hero_title' => $validated['hero_title'],
            'hero_subtitle' => $validated['hero_subtitle'] ?? null,
            'hero_button_text' => $validated['hero_button_text'],
            'hero_button_url' => $validated['hero_button_url'],
        ]);

        $oldLogo = $settings->logo_path;
        $oldVideo = $settings->hero_video_path;

        if ($request->hasFile('logo')) {
            $settings->logo_path = $request->file('logo')
                ->store('store/logo', 'public');
        }

        if ($request->hasFile('hero_video')) {
            $settings->hero_video_path = $request->file('hero_video')
                ->store('store/video', 'public');
        }

        $settings->save();

        if ($oldLogo && $oldLogo !== $settings->logo_path) {
            Storage::disk('public')->delete($oldLogo);
        }

        if ($oldVideo && $oldVideo !== $settings->hero_video_path) {
            Storage::disk('public')->delete($oldVideo);
        }

        return response()->json([
            'message' => 'Store appearance updated.',
            'settings' => $settings->fresh(),
        ]);
    }
}