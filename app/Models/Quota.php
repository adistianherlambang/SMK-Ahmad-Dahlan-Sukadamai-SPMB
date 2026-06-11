<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quota extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'quota_limit',
        'description',
    ];

    protected $appends = ['sisa'];

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    public function getSisaAttribute()
    {
        return $this->quota_limit - $this->registrations()->where('verification_status', '!=', 'Berkas Ditolak')->count();
    }
}
