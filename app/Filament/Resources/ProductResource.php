<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages\ManageProducts;
use App\Models\Product;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Tabs\Tab;
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
            Tabs::make('Product images')
                ->columnSpanFull()
                ->tabs([
                    Tab::make('Colour')
                        ->schema([
                            TextInput::make('single_color')
                                ->label('Colour')
                                ->placeholder('Enter a colour')
                                ->required()
                                ->dehydrated(false)
                                ->afterStateHydrated(function (TextInput $component, mixed $state, ?Product $record): void {
                                    if (filled($state) || ! $record) {
                                        return;
                                    }

                                    $component->state((string) data_get($record->colors, '0', ''));
                                }),
                            FileUpload::make('single_color_image')
                                ->label('Product Image')
                                ->image()
                                ->required()
                                ->disk('public')
                                ->directory('products')
                                ->imageEditor()
                                ->dehydrated(false)
                                ->afterStateHydrated(function (FileUpload $component, mixed $state, ?Product $record): void {
                                    if (filled($state) || ! $record) {
                                        return;
                                    }

                                    $color = (string) data_get($record->colors, '0', '');
                                    $colorImage = is_string($color) ? data_get($record->getRawOriginal('color_image_urls'), $color) : null;

                                    $component->state($colorImage ?: $record->image);
                                }),
                            FileUpload::make('single_color_gallery')
                                ->label('Shoe Gallery Images')
                                ->image()
                                ->required()
                                ->disk('public')
                                ->directory('products/gallery')
                                ->multiple()
                                ->panelLayout('grid')
                                ->imagePreviewHeight('100')
                                ->reorderable()
                                ->imageEditor()
                                ->dehydrated(false)
                                ->afterStateHydrated(function (FileUpload $component, mixed $state, ?Product $record): void {
                                    if (filled($state) || ! $record) {
                                        return;
                                    }

                                    $color = (string) data_get($record->colors, '0', '');
                                    $mappedGallery = is_string($color) ? data_get($record->getRawOriginal('color_gallery_images'), $color) : null;
                                    $gallery = is_array($mappedGallery) ? $mappedGallery : $record->gallery_images;

                                    $component->state(is_array($gallery) ? $gallery : []);
                                }),
                            Hidden::make('colors')
                                ->dehydrateStateUsing(fn (callable $get): array => [trim((string) $get('single_color'))])
                                ->hidden(),
                            Hidden::make('image')
                                ->dehydrateStateUsing(fn (callable $get): ?string => ($path = trim((string) $get('single_color_image'))) !== '' ? $path : null)
                                ->hidden(),
                            Hidden::make('gallery_images')
                                ->dehydrateStateUsing(fn (callable $get): array => collect($get('single_color_gallery') ?? [])
                                    ->filter(fn ($path) => is_string($path) && trim($path) !== '')
                                    ->map(fn (string $path): string => trim($path))
                                    ->values()
                                    ->all())
                                ->hidden(),
                            Hidden::make('color_image_urls')
                                ->dehydrateStateUsing(fn (callable $get): array => ($color = trim((string) $get('single_color'))) !== ''
                                    ? [$color => trim((string) $get('single_color_image'))]
                                    : [])
                                ->hidden(),
                            Hidden::make('color_gallery_images')
                                ->dehydrateStateUsing(fn (callable $get): array => ($color = trim((string) $get('single_color'))) !== ''
                                    ? [$color => collect($get('single_color_gallery') ?? [])
                                        ->filter(fn ($path) => is_string($path) && trim($path) !== '')
                                        ->map(fn (string $path): string => trim($path))
                                        ->values()
                                        ->all()]
                                    : [])
                                ->hidden(),
                        ]),
                ]),
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
