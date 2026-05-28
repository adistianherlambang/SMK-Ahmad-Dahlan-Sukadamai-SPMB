<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'title',
    'description',
    'start_date',
    'end_date'
])]
class Schedule extends Model
{
    //
}
