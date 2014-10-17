<?php 

class ApiProductController extends BaseApiController {

	public function find() {
		$id = Input::get('id') ? (int)Input::get('limit'): Config::get('restful.defaults.product.id');
		$queryProduct = Product::find($id);
		if($queryProduct) {
			$reponse = RestResponseFactory::ok($queryProduct->toArray());
		} else {
			$reponse = RestResponseFactory::ok(array(), "Product(s) not found");
		}
		return Response::json($reponse);
	}
	public function getById() {

	}
	public function create() {

	}
	public function update() {

	}
	public function delete() {

	}
}