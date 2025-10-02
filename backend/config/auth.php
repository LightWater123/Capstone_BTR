<?php

return [

    'defaults' => [
        'guard'     => env('AUTH_GUARD', 'web'),
        'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
    ],

    'guards' => [
        'web' => [
            'driver'   => 'session',
            'provider' => 'users',
        ],

        'admin' => [          //only guard you need for username logins
            'driver'   => 'session',
            'provider' => 'admins',   // uses the “multi” driver
        ],

        
    ],

    'providers' => [
        'users' => [
            'driver' => 'mongodb',
            'model'  => App\Models\User::class,
        ],

        'admins' => [
            'driver' => 'multi',          //  searches admins + services + users
            'model'  => App\Models\AdminUser::class,
        ],

        
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table'    => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
            'expire'   => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),
];