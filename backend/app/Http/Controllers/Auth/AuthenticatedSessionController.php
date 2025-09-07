<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate(); // checks credentials
        $request->session()->regenerate(); // changes session ID after logging in

        return response()->json(null, 204); // Always return JsonResponse
    }

    public function destroy(Request $request): JsonResponse
    {
        Auth::logout(); // remove user from the auth guard
        $request->session()->invalidate(); // delete current session
        $request->session()->regenerateToken(); // Generate a new CSRF token so the old one can’t be reused

        return response()->json(['message' => 'Logged out']);
    }
}
