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
    public function __construct(
        private \Illuminate\Contracts\Hashing\Hasher $hasher
    ) {}

    public function retrieveById($identifier): ?Authenticatable
    {
        return AdminUser::find($identifier)
            ?? ServiceUser::find($identifier)
            ?? User::find($identifier);
    }

    public function retrieveByToken($identifier, $token): ?Authenticatable
    {
        $user = $this->retrieveById($identifier);
        return $user && $user->getRememberToken() === $token ? $user : null;
    }

    public function updateRememberToken(Authenticatable $user, $token): void
    {
        $user->setRememberToken($token);
        $user->save();
    }

    public function retrieveByCredentials(array $credentials)
    {
        $model = $this->createModel();
        $query = $model->newQuery();

        if (!empty($credentials['login'])) {
            $regex = '^' . preg_quote($credentials['login']) . '$';
            $query->whereRaw(['username' => ['$regex' => $regex, '$options' => 'i']]);
        }

        // ----  TEMP  ----
        \Log::info('MONGO FILTER', $query->getQuery()->toMql());

        return $query->first();
    }

    public function validateCredentials(Authenticatable $user, array $credentials): bool
    {
        return $this->hasher->check($credentials['password'], $user->getAuthPassword());
    }

    public function rehashPasswordIfRequired(Authenticatable $user, array $credentials, bool $force = false): void
    {
        
    }
}