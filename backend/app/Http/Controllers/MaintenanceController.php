<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceJob;
use App\Models\Message;
use App\Jobs\SendMaintenanceEmail;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use MongoDB\BSON\ObjectId;

class MaintenanceController extends Controller
{
    /**
     * Schedule maintenance:
     * 1. create job
     * 2. queue e-mail job
     * 3. store in-app message
     */
    public function store(Request $req)
    {
        // validate incoming request
        $req->validate([
            'assetId'        => 'required|string',
            'assetName'      => 'required|string',
            'recipientEmail' => 'required|email',
            'recipientName'  => 'nullable|string',
            'scheduledAt'    => 'required|date',
            'message'        => 'required|string',
        ]);

        /* ---------- 1.  create job ---------- */
        $job = MaintenanceJob::create([
            'asset_id'    => $req->assetId,
            'asset_name'  => $req->assetName,
            'user_email'  => $req->recipientEmail,
            'scheduled_at'=> Carbon::parse($req->scheduledAt),
            'status'      => 'pending',
        ]);

        /* ---------- 2.  queue e-mail ---------- */
        SendMaintenanceEmail::dispatch($job, $req->message);

        /* ---------- 3.  inbox message ---------- */
        Message::create([
            'sender_id'       => Auth::id(),
            'recipient_email' => $req->recipientEmail,
            'subject'         => "[Maint Due] {$req->assetName} – ".$job->scheduled_at->format('d M Y'),
            'body_html'       => nl2br(e($req->message)),
            'maint_job_id'    => $job->_id,
            'read_at'         => null,
        ]);

        return response()->json(['job' => $job], 201);
    }

    /* service-user inbox
        returns sent messages to service user inbox
        filters by status if provided
    */
    public function messages(Request $req)
    {
        \Log::info('messages() called – raw query result');

        $query = Message::with('job')
                    ->where('recipient_email', Auth::user()->email)
                    ->orderBy('created_at', 'desc');

        // Filter by status if provided
        if ($req->has('status') && in_array($req->status, ['pending', 'in-progress', 'done'])) {
            $query->whereHas('job', function($q) use ($req) {
                $q->where('status', $req->status);
            });
        }

        $data = $query->get();

        // dump the very first job._id we find
        if ($data->isNotEmpty() && $data->first()->job) {
            \Log::info('first job raw', $data->first()->job->toArray());
        }

        return $data;

    }

    /* admin: messages he sent */
    public function sent(Request $req)
    {
        return Message::where('sender_id', Auth::id())
                      ->orderBy('created_at', 'desc')
                      ->get();
    }

    /* admin: maintenance monitor list 
        returns the messages sent by the admin to admin monitor list
    */
    public function index(Request $req)
    {
        return MaintenanceJob::query()
                      ->orderBy('created_at', 'desc')
                      ->get();
    }

    // service user maintenance list
    public function serviceIndex()
    {
        // fetch jobs that are pending or in-progress
        $jobs = MaintenanceJob::whereIn('status', ['pending', 'in-progress'])
                          ->orderBy('created_at', 'desc')
                          ->get();
        
        return response()->json($jobs);
    }

    // update status of equipment maintenance
    public function updateStatus(Request $request, MaintenanceJob $job) // <-- type-hint
    {
        $request->validate(['status' => 'required|in:pending,in-progress,done']);

        // authorisation
        if (! auth()->user()->email === 'admin@yourdomain.com' &&   // or any admin check you use
            $job->user_email !== auth()->user()->email) {
            abort(403);
        }

        $job->update(['status' => $request->status]);

        return response()->json($job);
    }
}