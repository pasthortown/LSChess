<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfilePicturesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('profile_pictures', function (Blueprint $table) {
          $table->increments('id');
          $table->timestamps();
          $table->string('file_type',50)->nullable($value = true);
          $table->string('file_name',50)->nullable($value = true);
          $table->longText('file')->nullable($value = true);
          $table->unsignedInteger('id_user');
          $table->foreign('id_user')->references('id')->on('users')->onDelete('cascade');
       });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
       Schema::dropIfExists('profile_pictures');
    }
}