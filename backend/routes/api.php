<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\PdfParserController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\PasswordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\PasswordReset;

// PUBLIC   
Route::post('/login',    [AuthenticatedSessionController::class, 'store']);
//Route::post('/logout',   [AuthenticatedSessionController::class, 'destroy']);
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/forgot-password',  fn(Request $r) => … );
Route::post('/reset-password',   fn(Request $r) => … );

// Authenticated Logout for all users
// The auth.any middleware will allow logout requests even if not authenticated
Route::middleware(['auth.any'])->group(function() {
    Route::post('/logout',   [AuthenticatedSessionController::class, 'destroy']);
});

// AUTHENTICATED
Route::middleware(['auth:admin'])->group(function () {
    
    // user & password
    Route::get('/user', fn(Request $r) => $r->user());
    Route::post('/admin/change-password', [PasswordController::class, 'change']);

    // inventory
    Route::apiResource('inventory', EquipmentController::class)
         ->only(['index','store','update','destroy']);
    // pdf parse
    Route::post('parse-pdf', [PdfParserController::class, 'parse']);

    // admin maintenance
    Route::prefix('maintenance')->group(function () {
        Route::get('/schedule',      [MaintenanceController::class, 'index']);
        Route::post('/schedule',     [MaintenanceController::class, 'store']);
        Route::get('/admin/messages',[MaintenanceController::class, 'sent']);
    });
});

// SERVICE USER (service guard)
Route::middleware(['auth:admin'])->group(function () {
    Route::get('/service/user', fn(Request $r) => $r->user());
    Route::get('/my-messages', [MaintenanceController::class,'messages']);
    Route::patch('/maintenance-jobs/{job}/status', [MaintenanceController::class, 'updateStatus']);
    Route::post('/service/change-password', [PasswordController::class, 'change']);
});

// SERVICE-ONLY INVENTORY VIEWS (no auth required, or add auth:service if you want)
Route::prefix('service')->group(function () {
    Route::get('inventory',                    [MaintenanceController::class, 'serviceIndex']);
    Route::get('inventory/{id}/maintenance',   [EquipmentController::class, 'serviceMaintenance']);
});

// EMAIL
Route::post('/send-email', [EmailController::class, 'sendEmail']);
Route::get('/verify',      [EmailController::class, 'verify']);