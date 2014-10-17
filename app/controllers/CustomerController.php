<?php

class CustomerController extends BaseController {

	public function getCustomersOfUser() {	
		$customers = Customer::where('customer_parent', '=', Auth::user()->id)->get();	
		
		$salebills = SaleBill::join('customer', function($join) {
			$join->on('sale_bill.customer_id', '=', 'customer.id');
		})
		->join('product', function($join) {
			$join->on('sale_bill.product_id', '=', 'product.id');
		})
		->select('customer.*', 'sale_bill.*', 'product.*', 'sale_bill.id as sale_bill_id', 'product.id as product_id', 'customer.id as id')
		->groupBy('customer.id')
		->get();

		return Response::json($salebills);
	}
}