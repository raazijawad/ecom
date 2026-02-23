<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hero_banners', function (Blueprint $table) {
            $table->foreignId('home_banner_product_id')
                ->nullable()
                ->after('product_id')
                ->constrained('products')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('hero_banners', function (Blueprint $table) {
            $table->dropConstrainedForeignId('home_banner_product_id');
        });
    }
};
