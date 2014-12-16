<?php

class Comment extends Eloquent {
	protected $table = "comments";
	protected $hidden = array();
	protected $guarded = array();
}