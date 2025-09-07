<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Auth\MultiUserProvider;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */ 
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {   
        // wires it up to the 'providers' in config/auth.php
         Auth::provider('multiuser', function ($app, array $config) {
            return new MultiUserProvider();
        });
    }
}
