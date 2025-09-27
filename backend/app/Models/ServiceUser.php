<?php

namespace App\Models;

use MongoDB\Laravel\Auth\User as Authenticatable; // mongodb support for Eloquent
use Laravel\Sanctum\HasApiTokens; //enables API token support for user authentication via Sanctum
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;


class ServiceUser extends Authenticatable
{
    
    // contains service_user's username, email, and password

    use HasApiTokens; // handles login credentials

    // declare collection and connection
    protected $connection = 'mongodb';
    protected $collection = 'service_users';
    protected $appends = ['role'];

    public function getRoleAttribute()
    {
        return 'service_user';
    }
    // declare valid service types
    public const SERVICE_TYPES = [
        'Vehicle',
        'Appliances',
        'ICT Equipment'
    ];

    // columns for service user's credentials and fillable field for mass assignment
    protected $fillable = 
    [
        'username', 
        'email', 
        'password', 
        'mobile_number',
        'address', 
        'service_type',
    ];
    
    // hidden attribute
    protected $hidden = 
    [
        'password',
        'remember_token',
    ];

    // get all service types
    public function getServiceTypes()
    {
        return self::SERVICE_TYPES;
    }

    // check if user has a specific service type
    public function hasServiceType($type)
    {
        return $this->service_type === $type;
    }
}
