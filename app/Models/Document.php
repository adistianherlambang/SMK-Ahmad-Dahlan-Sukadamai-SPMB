<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'registration_id',
    'file_kk',
    'file_akta',
    'file_skhu_skl',
    'file_sktm'
])]
class Document extends Model
{
    public function registration()
    {
        return $this->belongsTo(Registration::class);
    }
}
