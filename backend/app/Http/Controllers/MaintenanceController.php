<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceJob;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MaintenanceController extends Controller
{
    /**
     * Schedule maintenance:
     * 1. create job
     * 2. send Gmail (admin's account)
     * 3. store in-app message
     */
    public function store(Request $req)
    {
        $req->validate([
            'assetId'        => 'required|string',
            'assetName'      => 'required|string',
            'recipientEmail' => 'required|email',
            'recipientName'  => 'nullable|string',
            'scheduledAt'    => 'required|date',
            'message'        => 'required|string',
        ]);

        // 1. grab the admin that actually has tokens
        $admin = \App\Models\AdminUser::where('username', 'admin1')
                                  ->first();

        if (!$admin) {
            return response()->json(['error' => 'Admin Gmail account not linked'], 503);
        }

        // 2. manually inject the correct user
        $mail = new GmailService($admin);

        $recipientName = $req->recipientName ?: explode('@', $req->recipientEmail)[0];

        $job = null;
        DB::connection('mongodb')->transaction(function () use ($req, $admin, $mail, &$job) {
            // 1. job
            $job = MaintenanceJob::create([
                'assetId'       => $req->assetId,
                'assetName'     => $req->assetName,
                'userEmail'     => $req->recipientEmail,
                'scheduledAt'   => $req->scheduledAt,
                'status'        => 'pending',
                'gmailThreadId' => null,
            ]);

            // 2. Gmail (from admin's linked account)
            $subject = "[Maint Due] {$req->assetName} – ".$job->scheduledAt->format('d M Y');
            $gmailId = $mail->send($req->recipientEmail, $subject, $req->message);

            \Log::debug('Maintenance scheduled', [
                'admin_id' => $admin->id,
                'gmail_id' => $gmailId,
            ]);

            // 3. in-app copy
            Message::create([
                'senderId'       => $admin->_id,
                'recipientEmail' => $req->recipientEmail,
                'subject'        => $subject,
                'bodyHtml'       => $req->message,
                'gmailMsgId'     => $gmailId,
                'jobId'          => $job->_id,
                'status'         => ['read' => false],
            ]);
        });

        return response()->json(['job' => $job], 201);
    }

    /**
     * Service-user inbox list
     */
    public function messages(Request $req)
    {
        return Message::where('recipientEmail', auth()->user()->email)
                      ->orderBy('created_at', 'desc')
                      ->get();
    }

    // admin sent messages
    public function sent(Request $req)
    {
        return Message::where('senderId', auth()->id())
                      ->orderBy('created_at', 'desc')
                      ->get();
    }

    // maintenance schedule list admin
    public function index(Request $req)
    {
        return Message::where('senderId', auth()->id())
                      ->orderBy('created_at','desc')
                      ->get();
    }
}