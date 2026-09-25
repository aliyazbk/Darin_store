<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminOrderController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\Admin\AdminProductVariantController;
use App\Http\Controllers\Api\Admin\AdminProductImageController;
use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

Route::get('/products', [ProductController::class, 'index']);

Route::get('/products/{product:slug}', [
    ProductController::class,
    'show',
]);

Route::post('/orders', [OrderController::class, 'store'])
    ->middleware('throttle:10,1');

/*
|--------------------------------------------------------------------------
| Admin routes
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->group(function () {
    Route::post('/login', [
        AdminAuthController::class,
        'login',
    ])->middleware('throttle:5,1');

    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/me', [
            AdminAuthController::class,
            'me',
        ]);

        Route::post('/logout', [
            AdminAuthController::class,
            'logout',
        ]);

        Route::get('/orders', [
            AdminOrderController::class,
            'index',
        ]);

        Route::get('/orders/{order}', [
            AdminOrderController::class,
            'show',
        ]);

        Route::patch('/orders/{order}/status', [
            AdminOrderController::class,
            'updateStatus',
        ]);
        Route::get('/products', [
            AdminProductController::class,
            'index',
        ]);
        
        Route::post('/products', [
            AdminProductController::class,
            'store',
        ]);
        
        Route::get('/products/{product}', [
            AdminProductController::class,
            'show',
        ]);
        Route::put('/products/{product}', [
            AdminProductController::class,
            'update',
        ]);
        Route::post('/products/{product}/variants', [
          AdminProductVariantController::class,
            'store',
                ]);
        Route::put('/products/{product}/variants/{variant}', [
            AdminProductVariantController::class,
            'update',
        ]);

        Route::delete('/products/{product}/variants/{variant}', [
            AdminProductVariantController::class,
            'destroy',
        ]);
        Route::post('/products/{product}/images', [
           AdminProductImageController::class,
           'store',
        ]);
        Route::patch(
                '/products/{product}/images/{image}/primary',
                [
                    AdminProductImageController::class,
                    'setPrimary',
                ]
            );

        Route::delete(
            '/products/{product}/images/{image}',
            [
                AdminProductImageController::class,
                'destroy',
            ]
        );
        Route::get('/categories', [
    AdminCategoryController::class,
    'index',
        ]);
        Route::post('/categories', [
    AdminCategoryController::class,
    'store',
]);

    Route::put('/categories/{category}', [
        AdminCategoryController::class,
        'update',
    ]);
    Route::get('/dashboard', [
        AdminDashboardController::class,
        'index',
    ]);
                
            });
});