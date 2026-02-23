<?php

namespace App\Filament\Resources;

use App\Filament\Resources\HeroBannerResource\Pages\ManageHeroBanners;
use App\Models\Category;
use App\Models\Discount;
use App\Models\HeroBanner;
use App\Models\Product;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class HeroBannerResource extends Resource
{
    protected static ?string $model = HeroBanner::class;

    protected static string|null|\BackedEnum $navigationIcon = 'heroicon-o-photo';

    protected static ?string $navigationLabel = 'Hero Banner';

    protected static string|null|\UnitEnum $navigationGroup = 'Advertisement';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('eyebrow')
                ->label('Badge Text')
                ->maxLength(255),
            TextInput::make('title')
                ->required()
                ->maxLength(255),
            Textarea::make('description')
                ->rows(4)
                ->columnSpanFull(),
            TextInput::make('cta_label')
                ->label('Button Label')
                ->maxLength(255),
            Select::make('product_id')
                ->label('Button Product')
                ->relationship('product', 'name')
                ->searchable()
                ->preload()
                ->createOptionForm([
                    Select::make('category_id')
                        ->label('Collection')
                        ->options(Category::query()->orderBy('name')->pluck('name', 'id'))
                        ->searchable()
                        ->required(),
                    TextInput::make('name')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('price')
                        ->required()
                        ->numeric()
                        ->minValue(0),
                    TextInput::make('stock')
                        ->required()
                        ->numeric()
                        ->minValue(0)
                        ->default(0),
                    TextInput::make('image_url')
                        ->label('Product Image URL')
                        ->required()
                        ->url()
                        ->maxLength(2048),
                    Textarea::make('description')
                        ->required()
                        ->rows(3),
                ])
                ->createOptionUsing(function (array $data): int {
                    $product = Product::query()->create([
                        'category_id' => $data['category_id'],
                        'name' => $data['name'],
                        'slug' => Str::slug($data['name']).'-'.Str::random(6),
                        'description' => $data['description'],
                        'price' => $data['price'],
                        'stock' => $data['stock'],
                        'image_url' => $data['image_url'],
                        'is_featured' => false,
                        'is_visible' => true,
                    ]);

                    return $product->getKey();
                })
                ->live()
                ->afterStateUpdated(function ($state, callable $set): void {
                    if (! $state) {
                        $set('off_percentage', null);
                        $set('image_url', null);

                        return;
                    }

                    $product = Product::query()->find($state);

                    $set('image_url', self::resolveProductImage($product));

                    $discountPercentage = Discount::query()
                        ->where('product_id', $state)
                        ->value('percentage');

                    $set('off_percentage', $discountPercentage ? (int) $discountPercentage : null);
                }),
            Select::make('off_percentage')
                ->label('Off Percentage')
                ->options([
                    5 => '5% Off',
                    10 => '10% Off',
                    15 => '15% Off',
                    20 => '20% Off',
                    25 => '25% Off',
                    30 => '30% Off',
                    40 => '40% Off',
                    50 => '50% Off',
                ])
                ->nullable(),
            TextInput::make('image_url')
                ->label('Banner Image URL')
                ->helperText('Auto-filled from selected product image; you can override manually.')
                ->maxLength(2048)
                ->columnSpanFull(),
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
                ImageColumn::make('image_url')
                    ->label('Image')
                    ->square(),
                TextColumn::make('title')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('product.name')
                    ->label('Button Product')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('off_percentage')
                    ->label('Discount')
                    ->formatStateUsing(fn (?int $state): string => $state ? "{$state}% Off" : '—')
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
            'index' => ManageHeroBanners::route('/'),
        ];
    }

    private static function resolveProductImage(?Product $product): ?string
    {
        if (! $product) {
            return null;
        }

        if (filled($product->image_url)) {
            return $product->image_url;
        }

        $colorImages = collect($product->color_image_urls ?? []);

        if ($colorImages->isEmpty()) {
            return null;
        }

        if ($colorImages->keys()->every(fn ($key) => is_string($key))) {
            return $colorImages->filter(fn ($path) => is_string($path) && filled($path))->first();
        }

        return $colorImages
            ->pluck('product_image')
            ->filter(fn ($path) => is_string($path) && filled($path))
            ->first();
    }
}
