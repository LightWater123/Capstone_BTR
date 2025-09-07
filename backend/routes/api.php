<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\MaintenanceScheduleController;

Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);


// admin user
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/inventory', [EquipmentController::class, 'index']);
    Route::post('/inventory', [EquipmentController::class, 'store']);
    Route::put('/inventory/{id}', [EquipmentController::class, 'update']);
    Route::delete('/inventory/{id}', [EquipmentController::class, 'destroy']);
});

// service user
Route::middleware(['auth:sanctum', 'role:service_user'])->group(function () {
    Route::get('/maintenance-schedule/service', [MaintenanceScheduleController::class, 'forService']);
    Route::post('/maintenance-schedule', [MaintenanceScheduleController::class, 'store']);
});

// register route
Route::post('/register', [RegisteredUserController::class, 'store']);

