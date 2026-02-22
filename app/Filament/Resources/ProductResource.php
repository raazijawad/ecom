<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages\ManageProducts;
use App\Models\Product;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
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
                    if ($operation !== 'create') {
                        return;
                    }

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
            FileUpload::make('image_url')
                ->label('Product Image')
                ->disk('public')
                ->directory('products')
                ->image()
                ->imageEditor(),
            Repeater::make('color_image_urls')
                ->label('Colours')
                ->schema([
                    TextInput::make('color')
                        ->label('Colour')
                        ->required()
                        ->maxLength(255),
                    FileUpload::make('product_image')
                        ->label('Product Image')
                        ->disk('public')
                        ->directory('products/colors')
                        ->image()
                        ->imageEditor()
                        ->required(),
                    FileUpload::make('image_gallery')
                        ->label('Image Gallery')
                        ->disk('public')
                        ->directory('products/colors/gallery')
                        ->image()
                        ->multiple()
                        ->reorderable()
                        ->helperText('You can upload multiple gallery images for this colour.'),
                ])
                ->addActionLabel('Add another colour')
                ->helperText('Add each colour with its product image and optional image gallery.')
                ->collapsible()
                ->live()
                ->afterStateUpdated(fn (callable $set, ?array $state) => $set(
                    'colors',
                    collect($state ?? [])->pluck('color')->filter()->values()->all()
                ))
                ->columnSpanFull(),
            Hidden::make('colors')
                ->dehydrateStateUsing(fn (?array $state): array => array_values(array_filter($state ?? []))),
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
