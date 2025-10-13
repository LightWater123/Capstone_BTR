<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): View
    {
        return view('auth.login');
    }

    /**
     * Handle an incoming authentication request.
     * RETURNS JSON – no redirect
     */
    public function store(LoginRequest $request)
    {
        \Log::info('Login attempt started', [
            'login' => $request->input('login'),
            'ip' => $request->ip(),
        ]);

        // 1. Authenticate the user. This also determines and stores the correct guard.
        $request->authenticate();
        
        // 2. Get the guard that was used for authentication from the request object.
        $guard = $request->getUsedGuard();
        
        // 3. DYNAMICALLY SET THE SESSION COOKIE BASED ON THE GUARD.
        // This is the key to isolating the sessions.
        if ($guard === 'admin') {
            config(['session.cookie' => env('ADMIN_SESSION_COOKIE', 'btr_admin_session')]);
        } elseif ($guard === 'service') {
            config(['session.cookie' => env('SERVICE_SESSION_COOKIE', 'btr_service_session')]);
        }

        // 4. Get the user from the correct guard.
        $user = Auth::guard($guard)->user();
        
        // 5. Regenerate the session ID with the NEW, ISOLATED cookie name.
        // This must be done AFTER setting the config.
        $request->session()->regenerate();

        \Log::info('Authentication successful', [
            'user' => $user?->toArray(),
            'guard' => $guard,
            'session_id' => $request->session()->getId(),
        ]);

        $redirectUrl = $this->getRedirectUrl($user);
        
        \Log::info('Redirect URL determined', [
            'user' => $user?->toArray(),
            'role' => $user?->role,
            'guard_used' => $guard,
            'redirect_url' => $redirectUrl,
        ]);

        \Log::info('Login process completed', [
            'status' => 'success',
            'user_id' => $user?->getAuthIdentifier(),
            'guard' => $guard,
            'redirect_to' => $redirectUrl,
            'session_id' => $request->session()->getId(),
        ]);

        // destroys other sessions for different devices
        // $tokenId = $request->user()->currentAccessToken()->id;

        // $user->tokens()->where('id', '!=',$tokenId)->delete(); 

        return response()->json([
            'redirect' => $redirectUrl
        ]);
    }
    
    /**
     * Get the appropriate redirect URL based on user role
     */
    private function getRedirectUrl($user)
    {
        if (!$user) {
            return '/login';
        }
        
        // Check user role and return appropriate dashboard
        if (isset($user->role)) {
            switch (strtolower(trim($user->role))) {
                case 'admin':
                    return '/admin/dashboard';
                case 'service_user':
                    return '/service/dashboard';
                case 'director':
                    return '/oic/dashboard';
            }
        }
        
        // If no role, log an error and fail securely
        \Log::warning('User logged in without a recognizable role.', [
            'user_id' => $user->getAuthIdentifier(),
            'role' => $user->role ?? 'NULL'
        ]);
        
        // Don't guess. Log them out or send them to a "no permission" page.
        return '/login?error=no_role';
    }

    /**
     * Destroy an authenticated session.
     * ALSO JSON – no redirect
     */
    public function destroy(Request $request)
    {
        \Log::info('test');
        $activeGuard = null;
        $guards = array_keys(config('auth.guards')); // Get all defined guards dynamically

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $activeGuard = $guard;
                break;
            }
        }

        if ($activeGuard) {
            Auth::guard($activeGuard)->logout();
            \Log::info('Logged out from active guard', ['guard' => $activeGuard, 'session_id' => $request->session()->getId()]);
        } else {
            // Fallback: if no specific guard was found, log out from all configured guards
            foreach ($guards as $guard) {
                Auth::guard($guard)->logout();
            }
            \Log::info('Logged out from all guards (no active guard found)', ['session_id' => $request->session()->getId()]);
        }

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out']);
    }
}