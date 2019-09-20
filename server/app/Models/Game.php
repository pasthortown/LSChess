<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
       'id_player_white','id_player_black','start_time','end_time','start_position','start_move',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
       
    ];

    function GameState()
    {
       return $this->hasOne('App\GameState');
    }

    function Moves()
    {
       return $this->belongsToMany('App\Move')->withTimestamps();
    }

}