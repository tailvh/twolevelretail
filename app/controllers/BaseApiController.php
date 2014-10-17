<?php

class BaseApiController extends BaseController {
	public function __construct()
	{

	}

	public function missingMethod($parameters = array()) {
		$resp = RestResponseFactory::notfound("", "Method doesn't exists.");
		return Response::json($resp);
	}
} 