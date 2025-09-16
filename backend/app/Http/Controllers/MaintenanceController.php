<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceJob;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use MongoDB\Client;

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

        /* -----------------------------------------------------------------
        * 1.  Create MongoDB client (Laravel already has it in the container)
        * ----------------------------------------------------------------- */
        $client = new Client(config('database.mongodb.uri'));   // adjust if you use a different key

        /* -----------------------------------------------------------------
        * 2.  Build the callback that will run inside the transaction
        * ----------------------------------------------------------------- */
        $callback = function (\MongoDB\Driver\Session $session) use ($req) {
            /* ---------------------------------------------------------
            * 2a.  Create job
            * --------------------------------------------------------- */
            $job = MaintenanceJob::create([
                'assetId'     => $req->assetId,
                'assetName'   => $req->assetName,
                'userEmail'   => $req->recipientEmail,
                'scheduledAt' => $req->scheduledAt,
                'status'      => 'pending',
            ]);

            /* ---------------------------------------------------------
            * 2b.  Send Resend e-mail
            * --------------------------------------------------------- */
            $subject  = "[Maint Due] {$req->assetName} – ".$job->scheduledAt->format('d M Y');
            $resendId = Resend::emails()->send([
                'from'    => config('services.resend.from'),
                'to'      => $req->recipientEmail,
                'subject' => $subject,
                'html'    => nl2br(e($req->message)),
            ])['id'];

            Log::debug('Maintenance scheduled', [
                'job_id'    => $job->id,
                'resend_id' => $resendId,
            ]);

            /* ---------------------------------------------------------
            * 2c.  Create in-app message
            * --------------------------------------------------------- */
            Message::create([
                'senderId'       => auth()->id(),
                'recipientEmail' => $req->recipientEmail,
                'subject'        => $subject,
                'bodyHtml'       => $req->message,
                'resendMsgId'    => $resendId,
                'jobId'          => $job->_id,
                'status'         => ['read' => false],
            ]);

            return $job;   // returned value becomes the result of with_transaction
        };

        /* -----------------------------------------------------------------
        * 3.  Start session and run the transaction
        * ----------------------------------------------------------------- */
        $session = $client->startSession();

        try {
            $job = \MongoDB\with_transaction($session, $callback);
        } catch (\Exception $e) {
            Log::error('Maintenance scheduling failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error'   => 'Maintenance scheduling failed',
                'message' => $e->getMessage(),
            ], 500);
        }

        return response()->json(['job' => $job], 201);   
    }

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

    // admin monitor maintenance
    public function index(Request $req)
    {
        return Message::where('senderId', auth()->id())
                      ->orderBy('created_at','desc')
                      ->get();
    }
}