<?php

namespace App\Support\Billing;

use Carbon\CarbonImmutable;

class CardBillingService
{
    public function charge(array $card, float $amount): array
    {
        $number = preg_replace('/\D+/', '', $card['number']);

        $brand = $this->detectCardBrand($number);

        if (! $brand) {
            throw new UnsupportedCardException('Only Visa and Mastercard are supported.');
        }

        if (! $this->passesLuhn($number)) {
            throw new UnsupportedCardException('Invalid card number.');
        }

        if (! $this->isExpiryValid((int) $card['exp_month'], (int) $card['exp_year'])) {
            throw new UnsupportedCardException('Card expiry date is invalid or in the past.');
        }

        return [
            'status' => 'captured',
            'brand' => $brand,
            'last_four' => substr($number, -4),
            'reference' => 'PAY-'.strtoupper(bin2hex(random_bytes(4))),
            'amount' => round($amount, 2),
            'paid_at' => now(),
        ];
    }

    private function detectCardBrand(string $number): ?string
    {
        $length = strlen($number);

        if (preg_match('/^4\d+$/', $number) && in_array($length, [13, 16, 19], true)) {
            return 'visa';
        }

        if ($length === 16 && preg_match('/^(5[1-5]\d{14}|2(2[2-9]\d{12}|[3-6]\d{13}|7([01]\d{12}|20\d{12})))$/', $number)) {
            return 'mastercard';
        }

        return null;
    }

    private function passesLuhn(string $number): bool
    {
        $sum = 0;
        $alternate = false;

        for ($i = strlen($number) - 1; $i >= 0; $i--) {
            $digit = (int) $number[$i];

            if ($alternate) {
                $digit *= 2;
                if ($digit > 9) {
                    $digit -= 9;
                }
            }

            $sum += $digit;
            $alternate = ! $alternate;
        }

        return $sum % 10 === 0;
    }

    private function isExpiryValid(int $month, int $year): bool
    {
        if ($month < 1 || $month > 12) {
            return false;
        }

        $expiryEnd = CarbonImmutable::create($year, $month, 1)->endOfMonth();

        return $expiryEnd->greaterThanOrEqualTo(now());
    }
}
