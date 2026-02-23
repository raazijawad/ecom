<?php

namespace App\Filament\Resources;

use App\Filament\Resources\HeroBannerResource\Pages\ManageHeroBanners;
use App\Models\HeroBanner;
use App\Models\Product;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class HeroBannerResource extends Resource
{
    protected static ?string $model = HeroBanner::class;

    protected static string|null|\BackedEnum $navigationIcon = 'heroicon-o-photo';

    protected static ?string $navigationLabel = 'Hero banners';

    protected static string|null|\UnitEnum $navigationGroup = 'Advertisement';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('title')
                ->maxLength(255),
            TextInput::make('badge_text')
                ->label('Badge text')
                ->maxLength(255),
            TextInput::make('headline')
                ->label('Headline')
                ->maxLength(255),
            Textarea::make('description')
                ->rows(3),
            TextInput::make('cta_text')
                ->label('CTA text')
                ->maxLength(255),
            Select::make('product_id')
                ->label('CTA product')
                ->options(Product::query()->orderBy('name')->pluck('name', 'id'))
                ->searchable()
                ->preload(),
            FileUpload::make('image_path')
                ->label('Banner image')
                ->image()
                ->directory('hero-banners')
                ->disk('public')
                ->required(),
            Toggle::make('is_active')
                ->label('Active')
                ->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('updated_at', 'desc')
            ->columns([
                ImageColumn::make('image_path')
                    ->label('Image')
                    ->disk('public')
                    ->square(),
                TextColumn::make('title')
                    ->searchable(),
                TextColumn::make('badge_text')
                    ->label('Badge')
                    ->searchable(),
                TextColumn::make('headline')
                    ->searchable(),
                TextColumn::make('cta_text')
                    ->label('CTA')
                    ->searchable(),
                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean(),
                TextColumn::make('updated_at')
                    ->since()
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageHeroBanners::route('/'),
        ];
    }
}
