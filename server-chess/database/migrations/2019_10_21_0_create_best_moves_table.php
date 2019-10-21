<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBestMovesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('best_moves', function (Blueprint $table) {
          $table->increments('id');
          $table->timestamps();
          $table->string('current_position',100)->nullable($value = true);
          $table->string('response',10)->nullable($value = true);
          $table->string('from',5)->nullable($value = true);
          $table->string('to',5)->nullable($value = true);
          $table->boolean('is__best')->nullable($value = true);
       });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
       Schema::dropIfExists('best_moves');
    }
}