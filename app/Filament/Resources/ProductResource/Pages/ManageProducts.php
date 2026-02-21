<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Filament\Resources\ProductResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageProducts extends ManageRecords
{
    protected static string $resource = ProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()
                ->label('Add Product')
                ->mutateDataUsing(fn (array $data): array => ProductResource::mapColourVariantData($data)),
        ];
    }

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return ProductResource::mapColourVariantData($data);
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        return ProductResource::mapColourVariantData($data);
    }
}
