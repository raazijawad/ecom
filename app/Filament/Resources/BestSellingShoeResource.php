<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BestSellingShoeResource\Pages\ManageBestSellingShoes;
use App\Models\BestSellingShoe;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class BestSellingShoeResource extends Resource
{
    protected static ?string $model = BestSellingShoe::class;

    protected static string|null|\BackedEnum $navigationIcon = 'heroicon-o-fire';

    protected static ?string $navigationLabel = 'Best-selling shoes';

    protected static string|null|\UnitEnum $navigationGroup = 'Dashboard';

    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('product_id')
                ->label('Product')
                ->relationship('product', 'name')
                ->required()
                ->searchable()
                ->preload(),
            TextInput::make('sort_order')
                ->numeric()
                ->required()
                ->default(0)
                ->minValue(0),
            Toggle::make('is_active')
                ->label('Active')
                ->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->columns([
                TextColumn::make('product.name')
                    ->label('Product')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('sort_order')
                    ->sortable(),
                ToggleColumn::make('is_active')
                    ->label('Active'),
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
            'index' => ManageBestSellingShoes::route('/'),
        ];
    }
}
