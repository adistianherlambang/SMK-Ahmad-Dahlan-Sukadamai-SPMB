<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'title',
    'type',
    'content',
    'image_path'
])]
class Post extends Model
{
    //
}
