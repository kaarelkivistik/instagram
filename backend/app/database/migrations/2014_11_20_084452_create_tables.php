<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTables extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("users", function($table)
		{
			$table->engine = "InnoDB";

			$table->increments("id");
			$table->string("username")->unique();
			$table->string("password");
			$table->string("name");
			$table->string("email");

			$table->string("remember_token")->nullable();
			$table->timestamps();
		});

		Schema::create("photos", function($table)
		{
			$table->engine = "InnoDB";

			$table->increments("id");
			$table->string("title");
			$table->integer("user_id")->unsigned();
			$table->string("filename");

			$table->timestamps();

			$table->foreign("user_id")->references("id")->on("users");
		});

		Schema::create("comments", function($table)
		{
			$table->engine = "InnoDB";

			$table->increments("id");
			$table->integer("photo_id")->unsigned();
			$table->integer("user_id")->unsigned();
			$table->string("text");

			$table->timestamps();

			$table->foreign("user_id")->references("id")->on("users");
			$table->foreign("photo_id")->references("id")->on("photos");
		});

		Schema::create("likes", function($table)
		{
			$table->engine = "InnoDB";

			$table->increments("id");
			$table->integer("photo_id")->unsigned();
			$table->integer("user_id")->unsigned();

			$table->timestamps();

			$table->foreign("user_id")->references("id")->on("users");
			$table->foreign("photo_id")->references("id")->on("photos");
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop("likes");
		Schema::drop("comments");
		Schema::drop("photos");
		Schema::drop("users");
	}

}
