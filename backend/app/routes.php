<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/auth', function(){
	if(Auth::check())
		return Auth::user();
	else
		App::abort(403);
});

Route::post('/login', function()
{
	if (Auth::attempt(array('username' => Input::get('username'), 'password' => Input::get('password')))) {
		return Auth::user();
	} else {
		App::abort(403);
	}
});

Route::get('/logout', function()
{
	Auth::logout();
});

Route::resource('users', 'UserController');
Route::resource('photos', 'PhotoController');