<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGamesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('games', function (Blueprint $table) {
          $table->increments('id');
          $table->timestamps();
          $table->integer('id_player_white')->nullable($value = true);
          $table->integer('id_player_black')->nullable($value = true);
          $table->dateTime('start_time')->nullable($value = true);
          $table->dateTime('end_time')->nullable($value = true);
          $table->string('start_fen',100)->nullable($value = true);
          $table->longText('pgn')->nullable($value = true);
       });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
       Schema::dropIfExists('games');
    }
}