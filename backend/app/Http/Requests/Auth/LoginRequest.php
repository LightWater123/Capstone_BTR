<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'login'    => ['required', 'string'], // email or username
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the user.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        // pick guard that owns the credentials
        $guard = $this->has('login') && filter_var($this->input('login'), FILTER_VALIDATE_EMAIL)
                ? 'web'
                : 'admin';                 // username → admin collection

        if (! Auth::guard($guard)->attempt($this->only('login', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'login' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate-limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'login' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate-limiting throttle key for the request.
     */
    protected function throttleKey(): string
    {
        return Str::transliterate(
            Str::lower($this->input('login')).'|'.$this->ip()
        );
    }

    public function retrieveByCredentials(array $credentials): ?Authenticatable
    {
        $type = filter_var($credentials['login'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        \Log::debug('Mongo lookup', [
            'collection' => 'admins',   // or services / users
            'field'      => $type,
            'value'      => $credentials['login'],
        ]);

        return AdminUser::whereRaw([$type => ['$regex' => '^' . preg_quote($credentials['login']) . '$', '$options' => 'i']])->first()
            ?? ServiceUser::whereRaw([$type => ['$regex' => '^' . preg_quote($credentials['login']) . '$', '$options' => 'i']])->first()
            ?? User::whereRaw([$type => ['$regex' => '^' . preg_quote($credentials['login']) . '$', '$options' => 'i']])->first();
    }
}