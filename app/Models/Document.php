<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'registration_id',
        'file_kk',
        'file_akta',
        'file_skhu_skl',
        'file_sktm',
    ];

    public function registration()
    {
        return $this->belongsTo(Registration::class);
    }
}
