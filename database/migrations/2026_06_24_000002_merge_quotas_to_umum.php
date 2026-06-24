<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Ensure we have at least one Quota with ID 1 named "Umum"
        $exists = DB::table('quotas')->where('id', 1)->exists();
        if ($exists) {
            DB::table('quotas')->where('id', 1)->update([
                'name' => 'Umum',
                'quota_limit' => 300,
                'description' => 'Jalur Pendaftaran Umum',
                'updated_at' => now(),
            ]);
        } else {
            DB::table('quotas')->insert([
                'id' => 1,
                'name' => 'Umum',
                'quota_limit' => 300,
                'description' => 'Jalur Pendaftaran Umum',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 2. Point all existing registrations to quota_id 1
        DB::table('registrations')->update(['quota_id' => 1]);

        // 3. Delete other quotas to clean up
        DB::table('quotas')->where('id', '>', 1)->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op or restore defaults if necessary, but since this is simplifying the schema, we can keep it as is.
    }
};
