<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Auth\Authenticatable;
use App\Auth\MultiUserProvider;

class MongoDBAuthServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->app['auth']->provider('mongodb', function ($app, array $config) {
            return new class($app['hash'], $config['model']) extends EloquentUserProvider implements UserProvider
            {
                public function retrieveById($identifier)
                {
                    $model = $this->createModel();
                    return $model->newQuery()->find($identifier);
                }

                public function retrieveByToken($identifier, $token)
                {
                    $model = $this->createModel();
                    return $model->newQuery()
                                 ->where($model->getAuthIdentifierName(), $identifier)
                                 ->where($model->getRememberTokenName(), $token)
                                 ->first();
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

                    // 1. log what we received
                    \Log::info('credentials', $credentials);

                    // 2. log the raw MongoDB filter that will be sent
                    if (!empty($credentials['login'])) {
                        $regex = '^' . preg_quote($credentials['login']) . '$';
                        $query->whereRaw(['username' => ['$regex' => $regex, '$options' => 'i']]);
                        \Log::info('mongo filter', $query->getQuery()->toMql()); // <-- shows real filter
                    }

                    // 3. execute and log result
                    $user = $query->first();
                    \Log::info('result', ['user' => $user?->_id]);
                    return $user;
                }

                public function validateCredentials(Authenticatable $user, array $credentials): bool
                {
                    return $this->hasher->check(
                        $credentials['password'], $user->getAuthPassword()
                    );
                }
            };
        });

        // new driver
        $this->app['auth']->provider('multi', fn($app, $config) =>
            new MultiUserProvider($app['hash'])
        );
    }
}