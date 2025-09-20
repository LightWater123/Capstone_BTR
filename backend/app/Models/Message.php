<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Message extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'messages';

    protected $fillable = [
        'sender_id',
        'recipient_email', // we don’t store recipientId
        'subject',
        'body_html',
        'maint_job_id',    // matches controller & React
        'read_at',
        'status',          // simple string now (not array)
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    protected $visible = [
        '_id', 'sender_id', 'recipient_email', 'subject', 'body_html', 'maint_job_id', 'job', 'created_at'
    ];

    /* optional: quick relationship */
    public function job()
    {
        return $this->belongsTo(MaintenanceJob::class, 'maint_job_id', '_id');
    }
}