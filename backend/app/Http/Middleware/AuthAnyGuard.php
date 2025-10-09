<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthAnyGuard
{
    public function handle(Request $request, Closure $next)
    {
        // Allow logout requests without authentication
        if ($request->is('api/logout')) {
            return $next($request);
        }
        
        if (Auth::guard('admin')->check() || Auth::guard('service')->check()) {
            return $next($request);
        }
        
        return response()->json(['message' => 'Unauthorized'], 401);
    }
}