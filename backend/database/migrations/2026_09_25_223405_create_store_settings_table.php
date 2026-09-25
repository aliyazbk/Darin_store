<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_settings', function (Blueprint $table) {
            $table->id();
            $table->string('logo_path')->nullable();
            $table->string('hero_video_path')->nullable();
            $table->string('hero_title')->default('Darin Clothet');
            $table->string('hero_subtitle')->nullable();
            $table->string('hero_button_text')->default('Shop now');
            $table->string('hero_button_url')->default('/products');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_settings');
    }
};