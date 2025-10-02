<?php
declare(strict_types=1);

namespace App\Auth;

use App\Models\AdminUser;
use App\Models\ServiceUser;
use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider as UserContract;
use Illuminate\Contracts\Hashing\Hasher;
use Illuminate\Support\Str;

class MultiUserProvider implements UserContract
{
    /* ---------- lookup order ---------- */
    private const MODELS = [
        AdminUser::class,
        ServiceUser::class,
        User::class,
    ];

    public function __construct(
        private Hasher $hasher
    ) {}

    /* ------------------------------------------------------------------
     * Find user by primary key (used for “remember me”, session restore)
     * ------------------------------------------------------------------ */
    public function retrieveById($identifier): ?Authenticatable
    {
        foreach (self::MODELS as $model) {
            if ($user = $model::find($identifier)) {
                return $user;
            }
        }
        return null;
    }

    /* ------------------------------------------------------------------
     * Find user by credentials (login field)
     * ------------------------------------------------------------------ */
    public function retrieveByCredentials(array $credentials): ?Authenticatable
    {
        $login = $credentials['login'] ?? $credentials['username'] ?? $credentials['email'] ?? null;
        if (blank($login)) {
            return null;
        }

        $field = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $regex = ['$regex' => '^'.preg_quote($login, '/').'$', '$options' => 'i'];

        foreach (self::MODELS as $model) {
            if ($user = $model::whereRaw([$field => $regex])->first()) {
                return $user;
            }
        }
        return null;
    }

    /* ------------------------------------------------------------------
     * Password check + optional re-hash
     * ------------------------------------------------------------------ */
    public function validateCredentials(Authenticatable $user, array $credentials): bool
    {
        $plain = $credentials['password'];
        $hash  = $user->getAuthPassword();

        if (! $this->hasher->check($plain, $hash)) {
            return false;
        }

        /* ---- auto-upgrade hash strength ---- */
        if ($this->hasher->needsRehash($hash)) {
            $user->setAttribute('password', $this->hasher->make($plain));
            $user->save();
        }

        return true;
    }

    /* ------------------------------------------------------------------
     * Laravel 9+ hook – we already handle re-hash inline, so no-op here
     * ------------------------------------------------------------------ */
    public function rehashPasswordIfRequired(Authenticatable $user, array $credentials, bool $force = false): void
    {
        // handled in validateCredentials
    }

    /* ------------------------------------------------------------------
     * Remember-token boiler-plate (kept for compatibility)
     * ------------------------------------------------------------------ */
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
}