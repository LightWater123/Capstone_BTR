<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use App\Mail\MaintenanceScheduled;

// This queued job handles sending a maintenance notification email.
class SendMaintenanceEmail implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public $job, public $body)
    {
        //
    }

    /**
     * Execute the job:
     * - Sends an email to the job's user_email using the MaintenanceScheduled Mailable.
     * - Uses Laravel's Mail facade to deliver the message.
     */
    public function handle(): void
    {
        Mail::to($this->job->user_email)
            ->send(new MaintenanceScheduled($this->job, $this->body));
    }
}
