<?php
// app/Services/GmailService.php
<?php

namespace App\Services;

use Google\Client;
use Google\Service\Gmail;
use App\Models\User;

class GmailService
{
    protected Gmail $service;

    public function __construct(protected User $admin)
    {
        $client = new Client();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect'));
        $client->setAccessToken($admin->google_access_token);

        // auto-refresh if needed
        if ($client->isAccessTokenExpired()) {
            $new = $client->fetchAccessTokenWithRefreshToken($admin->google_refresh_token);
            $admin->update(['google_access_token' => $new['access_token']]);
            $client->setAccessToken($new['access_token']);
        }

        $this->service = new Gmail($client);
    }

    public function send(string $to, string $subject, string $html): string
    {
        $raw = base64_encode(
            "To: {$to}\r\nSubject: {$subject}\r\nContent-Type: text/html; charset=utf-8\r\n\r\n{$html}"
        );
        $msg = new \Google\Service\Gmail\Message();
        $msg->setRaw(strtr($raw, '+/', '-_'));
        return $this->service->users_messages->send('me', $msg)->getId();
    }
}