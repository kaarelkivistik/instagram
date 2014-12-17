<?php

class Photo extends Eloquent {
	protected $table = "photos";
	protected $hidden = array();
	protected $guarded = array();

	public function user() {
		return $this->belongsTo('User');
	}

	public function likes() {
		return $this->belongsToMany('User', 'likes');
	}

	public function comments() {
		return $this->hasMany('Comment');
	}
}