<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductDetailResource\Pages\ManageProductDetails;
use App\Models\Product;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ProductDetailResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static string|null|\BackedEnum $navigationIcon = 'heroicon-o-cube';

    protected static ?string $navigationLabel = 'Product Details';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Product details')
                ->schema([
                    Select::make('category_id')
                        ->label('Collection')
                        ->relationship('category', 'name')
                        ->required()
                        ->searchable()
                        ->preload(),
                    TextInput::make('name')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('price')
                        ->numeric()
                        ->required()
                        ->prefix('$')
                        ->minValue(0),
                    TextInput::make('stock')
                        ->numeric()
                        ->required()
                        ->minValue(0),
                    Repeater::make('sizes')
                        ->simple(TextInput::make('value')->label('Size')->required())
                        ->addActionLabel('Add size')
                        ->columnSpanFull(),
                    Repeater::make('colors')
                        ->simple(TextInput::make('value')->label('Colour')->required())
                        ->addActionLabel('Add colour')
                        ->columnSpanFull(),
                    TextInput::make('shipping_details')
                        ->maxLength(255)
                        ->columnSpanFull(),
                    Textarea::make('review_summary')
                        ->rows(3)
                        ->columnSpanFull(),
                ])
                ->columns(2),
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
                TextColumn::make('stock')
                    ->sortable(),
                TextColumn::make('sizes')
                    ->label('Sizes')
                    ->formatStateUsing(fn (?array $state): string => $state ? implode(', ', $state) : '-'),
                TextColumn::make('colors')
                    ->label('Colours')
                    ->formatStateUsing(fn (?array $state): string => $state ? implode(', ', $state) : '-'),
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
