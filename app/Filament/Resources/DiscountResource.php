<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DiscountResource\Pages\ManageDiscounts;
use App\Models\Discount;
use App\Models\Product;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class DiscountResource extends Resource
{
    protected static ?string $model = Discount::class;

    protected static string|null|\BackedEnum $navigationIcon = 'heroicon-o-ticket';

    protected static ?string $navigationLabel = 'Discounts';

    protected static string|null|\UnitEnum $navigationGroup = 'Advertisement';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('product_id')
                ->label('Product')
                ->relationship('product', 'name')
                ->required()
                ->searchable()
                ->preload()
                ->unique(ignoreRecord: true)
                ->live(),
            Select::make('percentage')
                ->label('Discount Percentage')
                ->required()
                ->options([
                    5 => '5%',
                    10 => '10%',
                    15 => '15%',
                    20 => '20%',
                    25 => '25%',
                    30 => '30%',
                    40 => '40%',
                    50 => '50%',
                    60 => '60%',
                    70 => '70%',
                ])
                ->live(),
            Placeholder::make('original_price')
                ->label('Original Price')
                ->content(function (Get $get): string {
                    $product = Product::query()->find($get('product_id'));

                    if (! $product) {
                        return 'Select a product';
                    }

                    return '$'.number_format((float) $product->price, 2);
                }),
            Placeholder::make('calculated_price')
                ->label('Calculated Price')
                ->content(function (Get $get): string {
                    $product = Product::query()->find($get('product_id'));
                    $percentage = (int) $get('percentage');

                    if (! $product || $percentage <= 0) {
                        return 'Select product and discount percentage';
                    }

                    $discountedPrice = round(((float) $product->price) * ((100 - $percentage) / 100), 2);

                    return '$'.number_format($discountedPrice, 2);
                }),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('product.name')
                    ->label('Product')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('product.price')
                    ->label('Original Price')
                    ->money('USD')
                    ->sortable(),
                TextColumn::make('percentage')
                    ->label('Discount')
                    ->suffix('%')
                    ->sortable(),
                TextColumn::make('calculated_price')
                    ->label('Calculated Price')
                    ->state(function (Discount $record): float {
                        return round(((float) $record->product->price) * ((100 - $record->percentage) / 100), 2);
                    })
                    ->money('USD')
                    ->sortable(),
                TextColumn::make('updated_at')
                    ->since()
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageDiscounts::route('/'),
        ];
    }
}
