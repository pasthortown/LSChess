<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMovesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('moves', function (Blueprint $table) {
          $table->increments('id');
          $table->timestamps();
          $table->string('from',10)->nullable($value = true);
          $table->string('to',10)->nullable($value = true);
          $table->dateTime('moment')->nullable($value = true);
          $table->string('nomenclature',10)->nullable($value = true);
       });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
       Schema::dropIfExists('moves');
    }
}