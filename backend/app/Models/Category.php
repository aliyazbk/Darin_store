<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
  public function up(): void
{
    Schema::create('categories', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('slug')->unique();
        $table->text('description')->nullable();
        $table->string('image')->nullable();
        $table->boolean('is_active')->default(true);
        $table->unsignedInteger('display_order')->default(0);
        $table->timestamps();
    });
}
public function down(): void
{
    Schema::dropIfExists('categories');
}
}
