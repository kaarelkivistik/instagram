<?php

class PhotoController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Photo::with('user', 'likes')->orderBy('updated_at', 'DESC')->get();
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		$user = Auth::user();

		if(!$user)
			App::abort(403);

		if(Input::has('image') && Input::has('title')){
			$data = Input::get('image');
			$path = join(DIRECTORY_SEPARATOR, array(public_path(), 'media'));
			$filename = md5(microtime()) . '.jpg';

			$info = getimagesize($data);

			if ($info['mime'] == 'image/jpeg') $image = imagecreatefromjpeg($data);
			elseif ($info['mime'] == 'image/gif') $image = imagecreatefromgif($data);
			elseif ($info['mime'] == 'image/png') $image = imagecreatefrompng($data);
			else App::abort(400);

			$width = imagesx($image);
			$height = imagesy($image);
			$newimage = null;

			if($width > $height){
				$startx = ($width - $height) / 2;

				$newimage = imagecreatetruecolor($height, $height);

				imagecopy ($newimage, $image , 0 , 0, $startx, 0, $height, $height);
			} else if($width < $height){
				$starty = ($height - $width) / 2;

				$newimage = imagecreatetruecolor($width, $width);
				imagecopy ($newimage, $image , 0 , 0, 0, $starty, $width, $width);
			} else {
				$newimage = $image;
			}

			imagejpeg($newimage, join(DIRECTORY_SEPARATOR, array($path, $filename)), 100);
		} else
			App::abort(400);

		$photo = new Photo(array('user_id' => $user->id, 'title' => Input::get('title'), 'filename' => $filename));

		$photo->save();

		return $photo;
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$photo = Photo::find($id);
		$photo->load('user', 'likes', 'comments.user');

		return $photo;
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$user = Auth::user();
		$photo = Photo::find($id);

		if(!$user || !$photo || $user->id !== $photo->user_id)
			App::abort(403);

		DB::table('likes')->where('photo_id', $id)->delete();
		DB::table('comments')->where('photo_id', $id)->delete();

		$photo->delete();

		$filepath = join(DIRECTORY_SEPARATOR, array(public_path(), 'media', $photo->filename));

		if(file_exists($filepath))
			unlink($filepath);
	}


}
