<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Quotas Table
        Schema::create('quotas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('quota_limit');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Registrations Table
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('quota_id')->constrained();
            $table->string('registration_number')->unique();
            $table->string('nisn', 10)->unique();
            $table->string('full_name');
            $table->enum('gender', ['L', 'P']);
            $table->string('birth_place');
            $table->date('birth_date');
            $table->string('religion');
            $table->integer('child_order');
            $table->string('family_status');
            
            // Keterangan Orang Tua
            $table->string('parent_name');
            $table->string('parent_occupation');
            $table->enum('parent_status', ['Ayah', 'Ibu', 'Wali']);
            
            // Asal Sekolah
            $table->string('school_origin');
            $table->text('school_address');
            
            // Kontak & Alamat
            $table->string('phone_number');
            $table->text('address');
            
            // Status Alur Verifikasi & Kelulusan
            $table->enum('verification_status', ['Menunggu Verifikasi', 'Berkas Ditolak', 'Terverifikasi'])->default('Menunggu Verifikasi');
            $table->enum('graduation_status', ['Menunggu Kelulusan', 'Diterima', 'Tidak Lulus'])->default('Menunggu Kelulusan');
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });

        // 3. Documents Table
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registration_id')->constrained()->onDelete('cascade');
            $table->string('file_kk');
            $table->string('file_akta');
            $table->string('file_skhu_skl');
            $table->string('file_sktm')->nullable();
            $table->timestamps();
        });

        // 4. Schedules Table
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamps();
        });

        // 5. Posts Table
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['berita', 'pengumuman']);
            $table->text('content');
            $table->string('image_path')->nullable();
            $table->timestamps();
        });

        // 6. Achievements Table
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('student_name');
            $table->integer('year');
            $table->string('image_path');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('achievements');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('schedules');
        Schema::dropIfExists('documents');
        Schema::dropIfExists('registrations');
        Schema::dropIfExists('quotas');
    }
};
