<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'registration_id',
        'date',
        'status',
    ];

    public function registration()
    {
        return $this->belongsTo(Registration::class);
    }
}
