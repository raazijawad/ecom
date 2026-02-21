<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages\ManageProducts;
use App\Models\Product;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
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
            TagsInput::make('colors')
                ->label('Colours')
                ->placeholder('Add a colour and press Enter')
                ->helperText('Add or remove colours for this product.'),
            FileUpload::make('image')
                ->label('Main Image')
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
