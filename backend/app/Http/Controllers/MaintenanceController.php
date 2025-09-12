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
     * 2. send e-mail via Resend
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

        $recipientName = $req->recipientName ?: explode('@', $req->recipientEmail)[0];
        $job           = null;

        DB::connection('mongodb')->transaction(function () use ($req, $recipientName, &$job) {
            // 1. job
            $job = MaintenanceJob::create([
                'assetId'     => $req->assetId,
                'assetName'   => $req->assetName,
                'userEmail'   => $req->recipientEmail,
                'scheduledAt' => $req->scheduledAt,
                'status'      => 'pending',
            ]);

            // 2. Resend e-mail
            $subject = "[Maint Due] {$req->assetName} – ".$job->scheduledAt->format('d M Y');
            $resendId = Resend::emails()->send([
                'from'    => config('services.resend.from'), // e.g. neo@updates.example.com
                'to'      => $req->recipientEmail,
                'subject' => $subject,
                'html'    => nl2br(e($req->message)),
            ])['id'];   // Resend returns an array with an 'id' key

            \Log::debug('Maintenance scheduled', [
                'job_id'    => $job->id,
                'resend_id' => $resendId,
            ]);

            // 3. in-app copy
            Message::create([
                'senderId'       => auth()->id(),          // or any system ID you prefer
                'recipientEmail' => $req->recipientEmail,
                'subject'        => $subject,
                'bodyHtml'       => $req->message,
                'resendMsgId'    => $resendId,             // new column (optional)
                'jobId'          => $job->_id,
                'status'         => ['read' => false],
            ]);
        });

        return response()->json(['job' => $job], 201);
    }

    /* --------------  the methods below stay the same  -------------- */
    public function messages(Request $req)
    {
        return Message::where('recipientEmail', auth()->user()->email)
                      ->orderBy('created_at', 'desc')
                      ->get();
    }

    public function sent(Request $req)
    {
        return Message::where('senderId', auth()->id())
                      ->orderBy('created_at', 'desc')
                      ->get();
    }

    public function index(Request $req)
    {
        return Message::where('senderId', auth()->id())
                      ->orderBy('created_at','desc')
                      ->get();
    }
}