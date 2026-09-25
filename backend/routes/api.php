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
use App\Http\Controllers\Api\HomeCatalogController;
use App\Http\Controllers\Api\Admin\AdminHomeSectionController;
use App\Http\Controllers\Api\StoreSettingController;
use App\Http\Controllers\Api\Admin\AdminStoreSettingController;
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
Route::get('/store-settings', [
    StoreSettingController::class,
    'show',
]);

Route::post('/orders', [OrderController::class, 'store'])
    ->middleware('throttle:10,1');

Route::get('/home/catalog', [
    HomeCatalogController::class,
    'index',
]);

Route::get('/categories', [
    HomeCatalogController::class,
    'categories',
]);

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
    Route::get('/home-sections', [
    AdminHomeSectionController::class,
    'index',
]);

Route::post('/home-sections', [
    AdminHomeSectionController::class,
    'store',
]);

Route::put('/home-sections/{section}', [
    AdminHomeSectionController::class,
    'update',
]);

Route::delete('/home-sections/{section}', [
    AdminHomeSectionController::class,
    'destroy',
]);
Route::post('/store-settings', [
    AdminStoreSettingController::class,
    'update',
]);
                
            });
});