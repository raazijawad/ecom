<?php

namespace App\Filament\Resources\NewsletterLogResource\Pages;

use App\Filament\Resources\NewsletterLogResource;
use Filament\Resources\Pages\ManageRecords;

class ManageNewsletterLogs extends ManageRecords
{
    protected static string $resource = NewsletterLogResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
