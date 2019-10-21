<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BestMove extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
       'current_position','response','from','to','is__best',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
       
    ];

}