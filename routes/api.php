<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CepController;
use App\Http\Controllers\Api\ClienteController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'store'])->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', [AuthController::class, 'show']);
    Route::post('logout', [AuthController::class, 'destroy']);

    Route::apiResource('clientes', ClienteController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::get('cep/{cep}', [CepController::class, 'show']);
});
