<?php

class Comment extends Eloquent {
	protected $table = "comments";
	protected $hidden = array();
	protected $guarded = array();

	public function user() {
		return $this->belongsTo('User');
	}
}