<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model; // mongodb support for Eloquent

class MaintenanceJob extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'maintenance_jobs';
    protected $fillable = [
        'assetId','assetName','userId','scheduledAt','status','confirmedVia','confirmedAt','gmailThreadId','created_at','updated_at'
    ];
    protected $casts = [
        'scheduledAt' => 'datetime',
        'confirmedAt' => 'datetime',
    ];
}
