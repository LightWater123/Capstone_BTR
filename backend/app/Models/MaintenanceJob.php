<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class MaintenanceJob extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'maintenance_jobs';
    protected $fillable = ['asset_id','asset_name','user_email','scheduled_at','status'];
    protected $dates = ['scheduled_at'];
}

class Message extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'messages';
    protected $fillable = ['sender_id','recipient_email','subject','body_html','read_at','maint_job_id'];
}
