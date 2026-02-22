<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages\ManageProducts;
use App\Models\Product;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Group;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static string|null|\BackedEnum $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $navigationLabel = 'Products';

    protected static string|null|\UnitEnum $navigationGroup = 'Catelog';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('category_id')
                ->label('Collection')
                ->relationship('category', 'name')
                ->required()
                ->searchable()
                ->preload(),

            TextInput::make('name')
                ->required()
                ->maxLength(255)
                ->live(onBlur: true)
                ->afterStateUpdated(function (string $operation, $state, callable $set): void {
                    if ($operation !== 'create') return;
                    $set('slug', str($state)->slug()->toString());
                }),

            TextInput::make('slug')
                ->required()
                ->maxLength(255)
                ->unique(ignoreRecord: true),

            TextInput::make('price')
                ->numeric()
                ->required()
                ->prefix('$')
                ->minValue(0),

            TextInput::make('stock')
                ->numeric()
                ->required()
                ->minValue(0),

            Repeater::make('colors')
                ->relationship('productColors')
                ->label('Colors')
                ->schema([
                    TextInput::make('name')
                        ->label('Color Name')
                        ->required()
                        ->maxLength(255),

                    Group::make([
                        FileUpload::make('image_path')
                            ->label('Main Image')
                            ->image()
                            ->disk('public')
                            ->directory('products/colors/main')
                            ->required(),

                        Hidden::make('is_main')
                            ->default(true)
                            ->dehydrated(),
                    ])
                        ->relationship('mainImage'),

                    // Gallery Images
                    Repeater::make('galleryImages')
                        ->relationship('galleryImages')
                        ->label('Gallery Images')
                        ->schema([
                            FileUpload::make('image_path')
                                ->label('Image')
                                ->image()
                                ->disk('public')
                                ->directory('products/colors/gallery')
                                ->required(),

                            Hidden::make('is_main')
                                ->default(false)
                                ->dehydrated(),
                        ])
                        ->addActionLabel('Add gallery image')
                        ->minItems(1)
                        ->reorderable()
                        ->columnSpanFull(),
                ])
                ->addActionLabel('Add color')
                ->columnSpanFull(),

            Toggle::make('is_featured')
                ->label('Featured')
                ->default(false),

            Toggle::make('is_visible')
                ->label('Visible')
                ->default(true),

            Textarea::make('description')
                ->required()
                ->rows(4)
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

                TextColumn::make('category.name')
                    ->label('Collection')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('price')
                    ->money('USD')
                    ->sortable(),

                TextColumn::make('stock')
                    ->sortable(),

                IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean(),

                ToggleColumn::make('is_visible')
                    ->label('Visible'),

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
            'index' => ManageProducts::route('/'),
        ];
    }
}
