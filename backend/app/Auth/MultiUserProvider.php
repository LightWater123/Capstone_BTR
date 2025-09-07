<?php

namespace App\Auth;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Support\Facades\Hash;
use App\Models\AdminUser;
use App\Models\ServiceUser;
use App\Models\User;

class MultiUserProvider implements UserProvider
{
    public function retrieveById($identifier): ?Authenticatable
    {
        return AdminUser::find($identifier)
            ?? ServiceUser::find($identifier)
            ?? User::find($identifier);
    }

    public function retrieveByToken($identifier, $token): ?Authenticatable
    {
        $user = $this->retrieveById($identifier);
        return ($user && $user->getRememberToken() === $token) ? $user : null;
    }

    public function updateRememberToken(Authenticatable $user, $token): void
    {
        $user->setRememberToken($token);
        $user->save();
    }

    public function retrieveByCredentials(array $credentials): ?Authenticatable
    {
        $loginType = filter_var($credentials['login'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        return AdminUser::where($loginType, $credentials['login'])->first()
            ?? ServiceUser::where($loginType, $credentials['login'])->first()
            ?? User::where($loginType, $credentials['login'])->first();
    }

    public function validateCredentials(Authenticatable $user, array $credentials): bool
    {
        return Hash::check($credentials['password'], $user->getAuthPassword());
    }

    public function rehashPasswordIfRequired(Authenticatable $user, array $credentials, bool $force = false): void
    {
        // Optional: implement password rehashing if needed
    }
}
