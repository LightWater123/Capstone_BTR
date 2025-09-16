<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

// this Mailable class represents the email sent when a maintenance job is scheduled.
class MaintenaceScheduled extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Public properties injected via constructor.
     * - $job: The MaintenanceJob model instance containing asset and schedule info.
     * - $body: The raw message body to be sent in the email.
     */
    public function __construct(public $job, public $body)
    {
        //
    }

    /**
     * Build the email message.
     * - Sets a dynamic subject line based on asset name and scheduled date.
     * - Converts plain text body to HTML using nl2br() and escapes it for safety.
     */

    public function build()
    {
        return $this->subject("[Maint Due] {$this->job->asset_name} – ".$this->job->scheduled_at->format('d M Y'))
                    ->html(nl2br(e($this->body)));
    }
}
