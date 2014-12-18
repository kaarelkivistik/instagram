<?php

class UserController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return User::all();
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		$form = Input::all();
		$form["password"] = Hash::make($form["password"]);

		$user = new User($form);
		$user->save();

		Auth::loginUsingId($user->id);

		return $user;
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$user = User::find($id);
		// $user->load('photos.likes', 'photos.comments');
		$user->load(array(
			'photos' => function($q){
				$q->orderBy('updated_at', 'DESC');
			}, 
			'photos.likes' => function($q){

			}, 
			'photos.comments' => function($q){

			}));
		
		return $user;
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}


}
