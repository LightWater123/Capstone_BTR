<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\PdfParserController;

Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);


// admin user
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/inventory', [EquipmentController::class, 'index']);
    Route::post('/inventory', [EquipmentController::class, 'store']);
    Route::put('/inventory/{id}', [EquipmentController::class, 'update']);
    Route::delete('/inventory/{id}', [EquipmentController::class, 'destroy']);
    Route::post('parse-pdf', [PdfParserController::class, 'parse']);
    Route::middleware('auth:sanctum')->get('/admin/messages', [MaintenanceController::class, 'sent']);
    Route::middleware('auth:sanctum')->get('/maintenance/schedule', [MaintenanceController::class,'index']);
});

// service user
Route::middleware('auth:sanctum')->post('/maintenance/schedule', [MaintenanceController::class,'store']);
Route::middleware('auth:sanctum')->get('/my-messages', [MaintenanceController::class,'messages']);

// register route
Route::post('/register', [RegisteredUserController::class, 'store']);


