<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductDetailsResource\Pages\ManageProductDetails;
use App\Models\Product;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ProductDetailsResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static string|null|\BackedEnum $navigationIcon = 'heroicon-o-adjustments-horizontal';

    protected static ?string $navigationLabel = 'Product Details';

    protected static ?string $modelLabel = 'Product Detail';

    protected static ?string $pluralModelLabel = 'Product Details';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')
                ->label('Product Name')
                ->disabled(),
            TextInput::make('price')
                ->numeric()
                ->required()
                ->prefix('$')
                ->minValue(0),
            TagsInput::make('sizes')
                ->label('Sizes')
                ->placeholder('Add a size and press Enter')
                ->helperText('Add or remove sizes shown on product page.'),
            TagsInput::make('colors')
                ->label('Colours')
                ->placeholder('Add a colour and press Enter')
                ->helperText('Add or remove colours shown on product page.'),
            Textarea::make('description')
                ->required()
                ->rows(5)
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('price')
                    ->money('USD')
                    ->sortable(),
                TextColumn::make('sizes')
                    ->badge()
                    ->separator(','),
                TextColumn::make('colors')
                    ->badge()
                    ->separator(','),
                TextColumn::make('updated_at')
                    ->since()
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageProductDetails::route('/'),
        ];
    }
}
