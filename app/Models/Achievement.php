<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'title',
    'student_name',
    'year',
    'image_path'
])]
class Achievement extends Model
{
    //
}
