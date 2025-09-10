<?php

// app/Events/MaintenanceConfirmed.php
namespace App\Events;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

class MaintenanceConfirmed implements ShouldBroadcast
{
    use Dispatchable;
    public function __construct(
        public string $jobId,
        public string $userId,
        public string $message
    ) {}
    public function broadcastOn(): array
    {
        return [new Channel('user.'.$this->userId)];
    }
}