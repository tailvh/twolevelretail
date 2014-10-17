<?php

class BookController extends BaseController {

	public function getBook() {

	}

	public function getBooks() {		
			return Response::json(array(
			    array('title' => 'Great Expectations', 'author' => 'Dickens'),
			    array('title' => 'Foundation', 'author' => 'Asimov'),
			    array('title' => 'Treasure Island', 'author' => 'Stephenson')
			  ));
	}
}