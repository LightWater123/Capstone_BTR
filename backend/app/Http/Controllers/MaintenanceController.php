<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceJob;
use App\Models\Message;
use App\Services\GmailService;
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
    public function store(Request $req, GmailService $mail)
    {
        $req->validate([
            'assetId'        => 'required|string',
            'assetName'      => 'required|string',
            'recipientEmail' => 'required|email',
            'recipientName'  => 'nullable|string',
            'scheduledAt'    => 'required|date',
            'message'        => 'required|string',
        ]);

        $admin         = auth()->user();                // admin who clicked Schedule
        $recipientName = $req->recipientName ?: explode('@', $req->recipientEmail)[0];

        $job = null;
        DB::connection('mongodb')->transaction(function () use ($req, $admin, $mail, &$job) {
            // 1. job
            $job = MaintenanceJob::create([
                'assetId'       => $req->assetId,
                'assetName'     => $req->assetName,
                'userEmail'     => $req->recipientEmail, // for reply-matching later
                'scheduledAt'   => $req->scheduledAt,
                'status'        => 'pending',
                'gmailThreadId' => null,
            ]);

            // 2. Gmail (from admin's linked account)
            $subject = "[Maint Due] {$req->assetName} – ".$job->scheduledAt->format('d M Y');
            $gmailId = $mail->send($req->recipientEmail, $subject, $req->message);

            // 3. in-app copy
            Message::create([
                'senderId'      => $admin->_id,
                'recipientEmail'=> $req->recipientEmail,
                'subject'       => $subject,
                'bodyHtml'      => $req->message,
                'gmailMsgId'    => $gmailId,
                'jobId'         => $job->_id,
                'status'        => ['read' => false],
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
}