<?php

namespace App\Auth;

use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\Authenticatable as UserContract;
use Illuminate\Database\Eloquent\Model;

/**
 * MongoDB user provider (drop-in for Illuminate\Auth\EloquentUserProvider)
 */
class UserProvider extends EloquentUserProvider
{
    /**
     * Retrieve a user by their unique identifier.
     */
    public function retrieveById($identifier)
    {
        return $this->createModel()->newQuery()->find($identifier);
    }

    /**
     * Retrieve a user by the given credentials.
     */
    public function retrieveByCredentials(array $credentials)
    {
        // Remove password field
        $credentials = array_filter($credentials, fn ($key) => !str_contains($key, 'password'), ARRAY_FILTER_USE_KEY);

        // Build query
        $query = $this->createModel()->newQuery();
        foreach ($credentials as $key => $value) {
            if (is_array($value)) {
                $query->whereIn($key, $value);
            } else {
                $query->where($key, $value);
            }
        }

        return $query->first();
    }
}