<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubscriberResource\Pages\ManageSubscribers;
use App\Models\Subscriber;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SubscriberResource extends Resource
{
    protected static ?string $model = Subscriber::class;

    protected static string|null|\BackedEnum $navigationIcon = 'heroicon-o-users';

    protected static string|null|\UnitEnum $navigationGroup = 'Campaign Targets';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')->maxLength(255),
            TextInput::make('email')->email()->required()->maxLength(255)->unique(ignoreRecord: true),
            DateTimePicker::make('subscribed_at')->required(),
            Select::make('segments')->relationship('segments', 'name')->multiple()->preload(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable()->sortable()->placeholder('—'),
                TextColumn::make('email')->searchable()->sortable(),
                TextColumn::make('subscribed_at')->dateTime()->sortable(),
                TextColumn::make('segments.name')->badge()->separator(', '),
            ])
            ->recordActions([EditAction::make()])
            ->toolbarActions([DeleteBulkAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageSubscribers::route('/'),
        ];
    }
}
