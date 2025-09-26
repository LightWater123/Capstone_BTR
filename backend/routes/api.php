<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\PdfParserController;
use App\Http\Controllers\EmailController;

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

// MAINTENANCE SCHEDULE

// admin user view - schedule modal, maintenance list, service messages,
Route::middleware('auth:sanctum')->post('/maintenance/schedule', [MaintenanceController::class,'store']);
// service user view - user inbox jsx
Route::middleware('auth:sanctum')->get('/my-messages', [MaintenanceController::class,'messages']);
// service user inventory view
Route::prefix('service')->group(function () {
    Route::get('inventory', [EquipmentController::class, 'serviceIndex']);
    Route::get('inventory/{id}/maintenance', [EquipmentController::class, 'serviceMaintenance']);
});
// update equipment status for service user
Route::middleware('auth:sanctum')
     ->patch('/maintenance-jobs/{job}/status', [MaintenanceController::class, 'updateStatus'])
     ->where('job', '[0-9a-fA-F]{24}');


// Email Resend Routes
Route::post('/send-email', [App\Http\Controllers\EmailController::class, 'sendEmail']);
Route::get('/verify', [App\Http\Controllers\EmailController::class, 'verify']);

// register route
Route::post('/register', [RegisteredUserController::class, 'store']);


