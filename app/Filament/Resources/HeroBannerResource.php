<?php

namespace App\Filament\Resources;

use App\Filament\Resources\HeroBannerResource\Pages\ManageHeroBanners;
use App\Models\HeroBanner;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
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
            TextInput::make('image_url')
                ->label('Image URL')
                ->required()
                ->url()
                ->maxLength(2048),
            TextInput::make('cta_label')
                ->label('Button Label')
                ->maxLength(255),
            TextInput::make('cta_link')
                ->label('Button Link')
                ->url()
                ->maxLength(2048),
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
