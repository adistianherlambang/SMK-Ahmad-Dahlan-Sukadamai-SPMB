<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');                             // e.g. "X TKR 1", "XI MB A"
            $table->string('jurusan');                         // teknik otomotif / manajemen dan bisnis
            $table->enum('kelas_level', ['X', 'XI', 'XII']);  // tingkat kelas
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classrooms');
    }
};
