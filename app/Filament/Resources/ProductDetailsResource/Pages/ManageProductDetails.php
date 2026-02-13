<?php

namespace App\Filament\Resources\ProductDetailsResource\Pages;

use App\Filament\Resources\ProductDetailsResource;
use Filament\Resources\Pages\ManageRecords;

class ManageProductDetails extends ManageRecords
{
    protected static string $resource = ProductDetailsResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
