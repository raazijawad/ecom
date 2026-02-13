<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('payment_method')->nullable()->after('shipping_address');
            $table->string('payment_brand')->nullable()->after('payment_method');
            $table->string('payment_last_four', 4)->nullable()->after('payment_brand');
            $table->string('payment_reference')->nullable()->after('payment_last_four');
            $table->timestamp('paid_at')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'payment_method',
                'payment_brand',
                'payment_last_four',
                'payment_reference',
                'paid_at',
            ]);
        });
    }
};
