<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hero_banners', function (Blueprint $table) {
            $table->string('badge_text')->nullable()->after('title');
            $table->string('headline')->nullable()->after('badge_text');
            $table->text('description')->nullable()->after('headline');
            $table->string('cta_text')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('hero_banners', function (Blueprint $table) {
            $table->dropColumn(['badge_text', 'headline', 'description', 'cta_text']);
        });
    }
};
