<?php

namespace App\Services;

use App\Mail\NewsletterMail;
use App\Models\Newsletter;
use App\Models\NewsletterLog;
use App\Models\Subscriber;
use Illuminate\Support\Facades\Mail;

class NewsletterSender
{
    public function send(Newsletter $newsletter): int
    {
        $sentAt = now();
        $subscribers = Subscriber::query()->orderBy('id')->get();

        foreach ($subscribers as $subscriber) {
            Mail::to($subscriber->email)->send(new NewsletterMail($newsletter));

            NewsletterLog::query()->updateOrCreate(
                [
                    'newsletter_id' => $newsletter->id,
                    'subscriber_id' => $subscriber->id,
                ],
                [
                    'sent_at' => $sentAt,
                ],
            );
        }

        $newsletter->forceFill([
            'sent_at' => $sentAt,
        ])->save();

        return $subscribers->count();
    }
}
