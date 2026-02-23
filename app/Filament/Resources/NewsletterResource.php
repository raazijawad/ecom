<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NewsletterResource\Pages\ManageNewsletters;
use App\Models\Newsletter;
use App\Services\NewsletterSender;
use Filament\Actions\Action;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class NewsletterResource extends Resource
{
    protected static ?string $model = Newsletter::class;

    protected static string|null|\BackedEnum $navigationIcon = 'heroicon-o-megaphone';

    protected static string|null|\UnitEnum $navigationGroup = 'Campaign Targets';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('subject')->required()->maxLength(255),
            TextInput::make('title')->required()->maxLength(255),
            RichEditor::make('content')->required()->columnSpanFull(),
            DateTimePicker::make('scheduled_at')->seconds(false),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')->searchable()->sortable(),
                TextColumn::make('subject')->searchable(),
                TextColumn::make('scheduled_at')->dateTime()->sortable()->placeholder('Not scheduled'),
                TextColumn::make('sent_at')->dateTime()->sortable()->placeholder('Not sent'),
                TextColumn::make('logs_count')->counts('logs')->label('Recipients'),
            ])
            ->recordActions([
                EditAction::make(),
                Action::make('send')
                    ->label('Send Now')
                    ->icon('heroicon-o-paper-airplane')
                    ->requiresConfirmation()
                    ->action(function (Newsletter $record): void {
                        $count = app(NewsletterSender::class)->send($record);

                        Notification::make()
                            ->title("Newsletter sent to {$count} subscribers")
                            ->success()
                            ->send();
                    }),
            ])
            ->toolbarActions([DeleteBulkAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageNewsletters::route('/'),
        ];
    }
}
