<?php

namespace App\Filament\Resources;

use App\Filament\Resources\HeroBannerResource\Pages\ManageHeroBanners;
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
                ->live()
                ->afterStateUpdated(function ($state, callable $set): void {
                    if (! $state) {
                        $set('off_percentage', null);

                        return;
                    }

                    $discountPercentage = Discount::query()
                        ->where('product_id', $state)
                        ->value('percentage');

                    $set('off_percentage', $discountPercentage ? (int) $discountPercentage : null);
                }),
            Select::make('home_banner_product_id')
                ->label('Home Banner Product Image')
                ->options(fn (): array => Product::query()->orderBy('name')->pluck('name', 'id')->all())
                ->searchable()
                ->preload()
                ->nullable()
                ->helperText('Select a product to show its image in the home banner.'),
            TextInput::make('image_url')
                ->label('Banner Image URL')
                ->maxLength(2048)
                ->nullable()
                ->helperText('Optional fallback image URL if no Home Banner Product Image is selected.'),
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
                TextColumn::make('homeBannerProduct.name')
                    ->label('Banner Image Product')
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
}
