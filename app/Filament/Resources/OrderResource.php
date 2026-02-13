<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages\ManageOrders;
use App\Models\Order;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static string|null|\BackedEnum $navigationIcon = 'heroicon-o-receipt-percent';

    protected static ?string $navigationLabel = 'Orders';

    protected static ?string $modelLabel = 'Order';

    protected static ?string $pluralModelLabel = 'Orders';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('order_number')
                ->label('Order #')
                ->disabled(),
            TextInput::make('customer_name')
                ->disabled(),
            TextInput::make('customer_email')
                ->email()
                ->disabled(),
            TextInput::make('customer_phone')
                ->disabled(),
            Textarea::make('shipping_address')
                ->rows(3)
                ->disabled()
                ->columnSpanFull(),
            Placeholder::make('items_summary')
                ->label('Items')
                ->content(fn (?Order $record): string => $record
                    ? $record->items
                        ->map(fn ($item) => sprintf('%dx %s', $item->quantity, $item->product_name))
                        ->implode("\n")
                    : '-')
                ->columnSpanFull(),
            TextInput::make('total')
                ->prefix('$')
                ->disabled(),
            Select::make('status')
                ->required()
                ->options([
                    'pending' => 'Pending',
                    'shipped' => 'Shipped',
                    'delivered' => 'Delivered',
                    'cancelled' => 'Cancelled',
                ])
                ->native(false),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order_number')
                    ->label('Order #')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('customer_name')
                    ->label('Customer')
                    ->searchable()
                    ->sortable()
                    ->description(fn (Order $record): string => $record->customer_email),
                TextColumn::make('items.product_name')
                    ->label('Items')
                    ->listWithLineBreaks()
                    ->limitList(2)
                    ->expandableLimitedList(),
                TextColumn::make('created_at')
                    ->label('Ordered')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('total')
                    ->label('Paid')
                    ->money('USD')
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => str($state)->headline()->toString())
                    ->colors([
                        'gray' => 'pending',
                        'info' => 'shipped',
                        'success' => 'delivered',
                        'danger' => 'cancelled',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageOrders::route('/'),
        ];
    }
}
