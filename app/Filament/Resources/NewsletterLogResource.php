<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NewsletterLogResource\Pages\ManageNewsletterLogs;
use App\Models\NewsletterLog;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class NewsletterLogResource extends Resource
{
    protected static ?string $model = NewsletterLog::class;

    protected static string|null|\BackedEnum $navigationIcon = 'heroicon-o-envelope-open';

    protected static ?string $navigationLabel = 'Sent Newsletter Logs';

    protected static string|null|\UnitEnum $navigationGroup = 'Campaign Targets';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return $schema;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('newsletter.title')->label('Newsletter')->searchable()->sortable(),
                TextColumn::make('subscriber.email')->label('Subscriber')->searchable(),
                TextColumn::make('sent_at')->dateTime()->sortable(),
                IconColumn::make('opened_at')->label('Opened')->boolean(fn (NewsletterLog $record): bool => (bool) $record->opened_at),
                IconColumn::make('clicked_at')->label('Clicked')->boolean(fn (NewsletterLog $record): bool => (bool) $record->clicked_at),
            ])
            ->defaultSort('sent_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageNewsletterLogs::route('/'),
        ];
    }
}
