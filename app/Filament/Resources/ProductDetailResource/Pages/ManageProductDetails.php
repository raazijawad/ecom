<?php

namespace App\Filament\Resources\ProductDetailResource\Pages;

use App\Filament\Resources\ProductDetailResource;
use Filament\Resources\Pages\ManageRecords;

class ManageProductDetails extends ManageRecords
{
    protected static string $resource = ProductDetailResource::class;
}
