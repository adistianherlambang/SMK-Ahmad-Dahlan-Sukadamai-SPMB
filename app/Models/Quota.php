<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'quota_limit', 'description'])]
class Quota extends Model
{
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
