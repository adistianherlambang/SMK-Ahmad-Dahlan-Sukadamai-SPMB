<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'quota_id',
        'registration_number',
        'nisn',
        'full_name',
        'gender',
        'birth_place',
        'birth_date',
        'religion',
        'child_order',
        'family_status',
        'parent_name',
        'parent_occupation',
        'parent_status',
        'school_origin',
        'school_address',
        'phone_number',
        'address',
        'verification_status',
        'graduation_status',
        'rejection_reason',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function quota()
    {
        return $this->belongsTo(Quota::class);
    }

    public function document()
    {
        return $this->hasOne(Document::class);
    }
}
