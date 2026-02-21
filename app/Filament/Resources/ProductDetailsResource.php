<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductDetailsResource\Pages\ManageProductDetails;
use App\Models\Product;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\KeyValue;
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
            KeyValue::make('color_image_urls')
                ->label('Colour Image URLs')
                ->keyLabel('Colour')
                ->valueLabel('Image URL')
                ->helperText('Use the exact colour name as key (e.g. Red) and paste the corresponding image URL.')
                ->columnSpanFull(),
            KeyValue::make('color_gallery_images')
                ->label('Colour Gallery Images')
                ->keyLabel('Colour')
                ->valueLabel('Gallery image URLs')
                ->helperText('Use the exact colour name as key (e.g. Blue). Add multiple URLs separated by commas.')
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
