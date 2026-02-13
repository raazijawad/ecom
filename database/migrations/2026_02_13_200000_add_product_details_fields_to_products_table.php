<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->json('sizes')->nullable()->after('image_url');
            $table->json('colors')->nullable()->after('sizes');
            $table->string('shipping_details')->nullable()->after('colors');
            $table->text('review_summary')->nullable()->after('shipping_details');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->dropColumn(['sizes', 'colors', 'shipping_details', 'review_summary']);
        });
    }
};
