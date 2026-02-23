<?php

namespace App\Filament\Resources;

use App\Filament\Resources\HomeBannerResource\Pages\ManageHomeBanners;
use App\Models\HomeBanner;
use App\Models\Product;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;
use Illuminate\Support\HtmlString;

class HomeBannerResource extends Resource
{
    protected static ?string $model = HomeBanner::class;

    protected static string|null|\BackedEnum $navigationIcon = 'heroicon-o-photo';

    protected static ?string $navigationLabel = 'Hero banners';

    protected static string|null|\UnitEnum $navigationGroup = 'Advertisement';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('product_id')
                ->label('Product')
                ->relationship('product', 'name')
                ->required()
                ->searchable()
                ->preload()
                ->unique(ignoreRecord: true)
                ->live(),
            TextInput::make('sort_order')
                ->numeric()
                ->required()
                ->default(0)
                ->minValue(0),
            Toggle::make('is_active')
                ->label('Active')
                ->default(true),
            Placeholder::make('product_preview')
                ->label('Selected product image')
                ->content(function (Get $get): HtmlString|string {
                    $product = Product::query()->find($get('product_id'));

                    if (! $product) {
                        return 'Select a product to preview the banner image.';
                    }

                    $imageUrl = $product->resolveColorImageUrl();

                    if (! $imageUrl) {
                        return 'This product does not have an image yet.';
                    }

                    return new HtmlString(sprintf('<img src="%s" alt="%s" style="max-height: 220px; border-radius: 12px; object-fit: contain;" />', e($imageUrl), e($product->name)));
                }),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->columns([
                ImageColumn::make('product_image')
                    ->label('Image')
                    ->state(fn (HomeBanner $record): ?string => $record->product?->resolveColorImageUrl())
                    ->circular(false)
                    ->square(),
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
            'index' => ManageHomeBanners::route('/'),
        ];
    }
}
