<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')
            ->scopes(['https://www.googleapis.com/auth/gmail.send'])
            ->redirect();
    }

    public function callback()
    {
        $googleUser = Socialite::driver('google')->user();

        auth()->user()->update([
            'google_access_token'  => $googleUser->token,
            'google_refresh_token' => $googleUser->refreshToken, // ONLY returned on first consent
            'google_expires_at'    => now()->addSeconds($googleUser->expiresIn),
        ]);

        return redirect('/dashboard')->with('success','Gmail linked!');
    }

    public function send(string $to, string $subject, string $html)
    {
        
    }
}