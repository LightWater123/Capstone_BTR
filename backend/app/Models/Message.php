<?php
// app/Models/Message.php
namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;

class Message extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'messages';
    protected $fillable = ['senderId','recipientId','subject','bodyHtml','gmailMsgId','jobId','status','created_at','updated_at'];
    protected $casts = ['status' => 'array'];
}