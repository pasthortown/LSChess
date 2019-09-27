<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Move extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
       'from','to','moment','pgn',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
       
    ];

    function Games()
    {
       return $this->belongsToMany('App\Game')->withTimestamps();
    }

}