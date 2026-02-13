<?php

namespace App\Support\Billing;

class PaypalBillingService
{
    public function charge(string $paypalEmail, float $amount): array
    {
        return [
            'status' => 'captured',
            'brand' => 'paypal',
            'last_four' => null,
            'reference' => 'PP-'.strtoupper(bin2hex(random_bytes(4))),
            'amount' => round($amount, 2),
            'paid_at' => now(),
            'payer' => $paypalEmail,
        ];
    }
}
