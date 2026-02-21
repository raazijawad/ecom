<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductDetailsResource\Pages\ManageProductDetails;
use App\Models\Product;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
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

    protected static ?string $navigationLabel = 'Products Details';

    protected static string|null|\UnitEnum $navigationGroup = 'Catelog';

    protected static ?int $navigationSort = 3;

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
            FileUpload::make('image')
                ->label('Product Image')
                ->image()
                ->disk('public')
                ->directory('products')
                ->imageEditor(),
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
                ->columnSpanFull(),
            TagsInput::make('sizes')
                ->label('Sizes')
                ->placeholder('Add a size and press Enter')
                ->helperText('Add or remove sizes shown on product page.'),
            TagsInput::make('colors')
                ->label('Colours')
                ->placeholder('Add a colour and press Enter')
                ->helperText('Add or remove colours shown on product page.'),
            Repeater::make('color_image_urls')
                ->label('Colour Images')
                ->helperText('Pick a colour, upload a small thumbnail image, then add another row for the next colour.')
                ->schema([
                    Select::make('color')
                        ->label('Colour')
                        ->required()
                        ->searchable()
                        ->options(fn (callable $get): array => collect($get('../../colors') ?? [])
                            ->filter(fn ($color) => is_string($color) && trim($color) !== '')
                            ->mapWithKeys(fn (string $color): array => [trim($color) => trim($color)])
                            ->all()),
                    FileUpload::make('image')
                        ->label('Image')
                        ->image()
                        ->disk('public')
                        ->directory('products/colors')
                        ->imagePreviewHeight('40')
                        ->imageEditor()
                        ->required(),
                ])
                ->addActionLabel('Add colour image')
                ->reorderable(false)
                ->default([])
                ->afterStateHydrated(function (Repeater $component, $state): void {
                    if (! is_array($state)) {
                        $component->state([]);

                        return;
                    }

                    $stateIsMappedByColor = array_keys($state) !== range(0, count($state) - 1);

                    if (! $stateIsMappedByColor) {
                        return;
                    }

                    $rows = collect($state)
                        ->map(function ($image, $color): array {
                            return [
                                'color' => (string) $color,
                                'image' => is_string($image) ? trim($image) : '',
                            ];
                        })
                        ->filter(fn (array $row): bool => $row['color'] !== '' && $row['image'] !== '')
                        ->values()
                        ->all();

                    $component->state($rows);
                })
                ->dehydrateStateUsing(fn (?array $state): array => collect($state ?? [])
                    ->mapWithKeys(function ($row): array {
                        $color = trim((string) data_get($row, 'color'));
                        $image = trim((string) data_get($row, 'image'));

                        if ($color === '' || $image === '') {
                            return [];
                        }

                        return [$color => $image];
                    })
                    ->all())
                ->columnSpanFull(),
            Repeater::make('color_gallery_images')
                ->label('Colour Gallery Images')
                ->helperText('Pick a colour, upload that colour\'s gallery images, then add another row for the next colour.')
                ->schema([
                    Select::make('color')
                        ->label('Colour')
                        ->required()
                        ->searchable()
                        ->options(fn (callable $get): array => collect($get('../../colors') ?? [])
                            ->filter(fn ($color) => is_string($color) && trim($color) !== '')
                            ->mapWithKeys(fn (string $color): array => [trim($color) => trim($color)])
                            ->all()),
                    FileUpload::make('images')
                        ->label('Gallery Images')
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
                ->addActionLabel('Add colour gallery')
                ->reorderable(false)
                ->default([])
                ->afterStateHydrated(function (Repeater $component, $state): void {
                    if (! is_array($state)) {
                        $component->state([]);

                        return;
                    }

                    $stateIsMappedByColor = array_keys($state) !== range(0, count($state) - 1);

                    if (! $stateIsMappedByColor) {
                        return;
                    }

                    $rows = collect($state)
                        ->map(function ($images, $color): array {
                            $imagePaths = is_array($images)
                                ? $images
                                : (preg_split('/[\r\n,]+/', (string) $images) ?: []);

                            return [
                                'color' => (string) $color,
                                'images' => collect($imagePaths)
                                    ->filter(fn ($path) => is_string($path) && trim($path) !== '')
                                    ->map(fn (string $path): string => trim($path))
                                    ->values()
                                    ->all(),
                            ];
                        })
                        ->values()
                        ->all();

                    $component->state($rows);
                })
                ->dehydrateStateUsing(fn (?array $state): array => collect($state ?? [])
                    ->mapWithKeys(function ($row): array {
                        $color = trim((string) data_get($row, 'color'));

                        if ($color === '') {
                            return [];
                        }

                        $images = collect(data_get($row, 'images', []))
                            ->filter(fn ($path) => is_string($path) && trim($path) !== '')
                            ->map(fn (string $path): string => trim($path))
                            ->values()
                            ->all();

                        if ($images === []) {
                            return [];
                        }

                        return [$color => $images];
                    })
                    ->all())
                ->columnSpanFull(),
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
                TextColumn::make('image')
                    ->label('Product image')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('gallery_images')
                    ->label('Gallery images')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('sizes')
                    ->badge()
                    ->separator(','),
                TextColumn::make('colors')
                    ->badge()
                    ->separator(','),
                TextColumn::make('color_image_urls')
                    ->label('Colour image URLs')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('color_gallery_images')
                    ->label('Colour gallery images')
                    ->toggleable(isToggledHiddenByDefault: true),
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
