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
use Filament\Forms\Components\Tabs;
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
            Tabs::make('Product media')
                ->tabs([
                    Tabs\Tab::make('Colour')
                        ->schema([
                            Repeater::make('colour_variants')
                                ->label('Colour')
                                ->helperText('Add one colour, then upload the main image and gallery images for that colour.')
                                ->schema([
                                    TextInput::make('color')
                                        ->label('Colour')
                                        ->required()
                                        ->maxLength(50),
                                    FileUpload::make('main_image')
                                        ->label('Main Image')
                                        ->image()
                                        ->disk('public')
                                        ->directory('products/colors')
                                        ->imageEditor()
                                        ->required(),
                                    FileUpload::make('gallery_images')
                                        ->label('Shoe Gallery Images')
                                        ->image()
                                        ->disk('public')
                                        ->directory('products/gallery')
                                        ->multiple()
                                        ->panelLayout('grid')
                                        ->imagePreviewHeight('100')
                                        ->reorderable()
                                        ->imageEditor()
                                        ->required(),
                                ])
                                ->minItems(1)
                                ->maxItems(1)
                                ->defaultItems(1)
                                ->addable(false)
                                ->deletable(false)
                                ->reorderable(false)
                                ->default([])
                                ->afterStateHydrated(function (Repeater $component, $state): void {
                                    if (is_array($state) && $state !== []) {
                                        return;
                                    }

                                    $record = $component->getRecord();

                                    if (! $record instanceof Product) {
                                        return;
                                    }

                                    $color = collect($record->colors ?? [])
                                        ->map(fn ($value): string => trim((string) $value))
                                        ->first(fn (string $value): bool => $value !== '');

                                    if (! is_string($color) || $color === '') {
                                        return;
                                    }

                                    $mainImage = trim((string) data_get($record->color_image_urls ?? [], $color, ''));
                                    $galleryImages = collect(data_get($record->color_gallery_images ?? [], $color, []))
                                        ->filter(fn ($path): bool => is_string($path) && trim($path) !== '')
                                        ->map(fn (string $path): string => trim($path))
                                        ->values()
                                        ->all();

                                    $component->state([[
                                        'color' => $color,
                                        'main_image' => $mainImage,
                                        'gallery_images' => $galleryImages,
                                    ]]);
                                })
                                ->columnSpanFull(),
                        ]),
                ])
                ->columnSpanFull(),
            Hidden::make('colors')->dehydrated(),
            Hidden::make('color_image_urls')->dehydrated(),
            Hidden::make('color_gallery_images')->dehydrated(),
            Hidden::make('image')->dehydrated(),
            Hidden::make('gallery_images')->dehydrated(),
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
                EditAction::make()
                    ->mutateDataUsing(fn (array $data): array => static::mapColourVariantData($data)),
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

    public static function mapColourVariantData(array $data): array
    {
        $variant = collect($data['colour_variants'] ?? [])->first();

        $color = trim((string) data_get($variant, 'color'));
        $mainImage = trim((string) data_get($variant, 'main_image'));
        $galleryImages = collect(data_get($variant, 'gallery_images', []))
            ->filter(fn ($path): bool => is_string($path) && trim($path) !== '')
            ->map(fn (string $path): string => trim($path))
            ->values()
            ->all();

        if ($color === '' || $mainImage === '' || $galleryImages === []) {
            $data['colors'] = [];
            $data['color_image_urls'] = [];
            $data['color_gallery_images'] = [];
            $data['image'] = null;
            $data['gallery_images'] = [];

            unset($data['colour_variants']);

            return $data;
        }

        $data['colors'] = [$color];
        $data['color_image_urls'] = [$color => $mainImage];
        $data['color_gallery_images'] = [$color => $galleryImages];
        $data['image'] = $mainImage;
        $data['gallery_images'] = $galleryImages;

        unset($data['colour_variants']);

        return $data;
    }
}
