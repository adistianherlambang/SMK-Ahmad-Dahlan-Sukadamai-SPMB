<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    protected $fillable = [
        'name',
        'jurusan',
        'kelas_level',
    ];

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }
}
