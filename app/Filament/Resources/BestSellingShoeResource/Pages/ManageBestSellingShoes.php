<?php

namespace App\Filament\Resources\BestSellingShoeResource\Pages;

use App\Filament\Resources\BestSellingShoeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageBestSellingShoes extends ManageRecords
{
    protected static string $resource = BestSellingShoeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
