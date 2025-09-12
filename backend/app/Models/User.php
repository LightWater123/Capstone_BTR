<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Eloquent;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Auth\Authenticatable as AuthenticableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Eloquent implements Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, AuthenticableTrait;

    protected $connection = 'mongodb';
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'mobile_number',
        'role',
        'address',
        'service_type',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'google_access_token' => 'array',
        ];
    }
}
