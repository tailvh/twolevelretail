<?php
set_time_limit(60000); //60 seconds = 1 minute
const ORDER_NEED_ACCEPT = 1;
const ORDER_NEED_PRODUCE = 2;
const ORDER_PRODUCED = 3;
const ORDER_CANCEL = 4;
const ORDER_DELETE = 5;
const ORDER_WAIT = 6;

const ORDER_GETTED = 1;

class OrderController extends BaseController {
	public function action() {
		$arrOrderDetail = OrderDetail::all();
		foreach($arrOrderDetail as $orderDetail) {
			$order = Order::find($orderDetail->order_id);
			if(isset($order))
			$orderDetail->user_id = $order->user_id_get;
			$orderDetail->save();
		}
	}

	// plural
	public function get() {

	}
	public function getTreeOrderDetails() {
		$currentUser = Auth::user();
		$orderDetails = OrderDetail::orderBy('created_at', 'DESC')->where('order_status', '>', ORDER_NEED_ACCEPT)->where('order_status', '<', ORDER_CANCEL)->where('user_trace', 'like', '%'.$currentUser->user_trace.'%')->take(20)->get();
		return Response::json($orderDetails);
	}
	public function getOrderDetails() {		
		$currentUser = Auth::user();

		// get orders of currentUser which (unaccepted or ungetted)
		$orderDetails = OrderDetail::where('order_status', '<', ORDER_CANCEL)->where('is_get', '!=', ORDER_GETTED)->where('user_id', '=', $currentUser->id)->get();
		return Response::json($orderDetails);
	}
	public function getOrderDetailsWaitting(){
		$orderDetails = OrderDetail::where('order_status', '=', ORDER_WAIT)->get();
		return Response::json($orderDetails);
	}
	public function getOrderDetailsCanceled() {
		$orderDetails = OrderDetail::where('order_status', '=', ORDER_CANCEL)->get();
		return Response::json($orderDetails);
	}
	public function getOrderDetailsAccepted($month = 0) {
		if(!$month) $toDate = date('Y-m-01 00:00:00');
		else        $toDate = date('Y-0'.$month.'-01 00:00:00');

		$orderDetails = OrderDetail::where('order_status', '>', ORDER_NEED_ACCEPT)->where('order_status', '<', ORDER_CANCEL)->where('accepted_at', '>', $toDate)->get();
		return Response::json($orderDetails);
	}
	public function getOrderDetailsInmonthAccepted() {
		$toDate = date('Y-m-1 00:00:00');
		$orderDetails = OrderDetail::where('order_status', '>', ORDER_NEED_ACCEPT)->where('order_status', '<', ORDER_CANCEL)->where('accepted_at', '>', $toDate)->get();
		return Response::json($orderDetails);
	}
	public function getOrderDetailsExport($day = 0, $month = 0, $year = 0, $range = 0) {
		if(!$day) $day = 'd';
		if(!$month) $month = 'm';
		if(!$year) $year = 'Y';

		// date string
		$dateString = ''.$year.'-'.$month.'-'.$day.' 23:59:59';
		$subDateString = ''.$year.'-'.$month.'-'.$day.' 00:00:00';

		// date var
		$toDate = date($dateString);
		$subDate = date($subDateString);

		$newDate = $range ? date('Y-m-d 00:00:00' ,strtotime( '-'.$range.' day' , strtotime( $subDate ))) :  date('Y-m-d 00:00:00');

		$orderDetails = OrderDetail::join('product', function($join) {
			$join->on('orderdetail.product_id', '=', 'product.id');
		})
		->select('orderdetail.*', 'product.product_name as product_name', 'product.product_description as product_description')
		->where('orderdetail.order_status', '=', ORDER_PRODUCED)
		->where('orderdetail.produced_at', '>=', $newDate)
		->where('orderdetail.produced_at', '<=', $toDate)->get();

		return Response::json($orderDetails);
	}
	public function getOrderDetailsNeedAccept() {
		$orderDetails = OrderDetail::join('users', function($join) {
			$join->on('orderdetail.user_id', '=', 'users.id');
		})
		->select('orderdetail.*', 'users.user_phone as user_phone')
		->where('orderdetail.order_status', '=', ORDER_NEED_ACCEPT)
		->get();
		return Response::json($orderDetails);
	}
	public function getOrderDetailsNeedProduce() {
		$orderDetails = OrderDetail::where('order_status', '=', ORDER_NEED_PRODUCE)->get();
		return Response::json($orderDetails);
	}
	public function getUserOrderDetails($id = 0) {
		// first date of month  : date('Y-m-01:H-i-s')
		// end date of month    : date('Y-m-31:H-i-s')
		if(!$id) $id = Auth::user()->id;
		$orderDetails = OrderDetail::where('user_id', '=', $id)->where('created_at', '>=', date('Y-m-01:H-i-s'))->get();
		return Response::json($orderDetails);
	}
	public function getOrderDetailsReport($id = 0) {		
		if(!$id) $id = Auth::user()->id;
		$cols = array();
		$rows = array();
		$arrAlertData = array();
		$arrAlertData['currentDay'] = (int)date('d');

		// get column data
		// first column 
		$col = array('id' => 'month', 'label' => 'Thời gian', 'type' => 'string', 'p' => array());
		array_push($cols, $col);
		// other column is user 
		$arrUser = User::where('user_parent', '=', $id)->orWhere('id', '=', $id)->get();

		foreach($arrUser as $i => $user) {
			$arrAlertData[$i]['user'] = $user->user_fullname;
			$arrAlertData[$i]['id']   = $user->id;
			$arrAlertData[$i]['max']  = 0;
			$col = array('id' => $user->id, 'label' => $user->user_fullname, 'type' => 'number', 'p' => array());
			array_push($cols, $col);			
		}

		// here we create default timeline monthly and 3 month
		$toDate = date('Y-m-d H:i:s');
		$startThisMonth = date('Y-m-01 23:59:59');
		$startThisMonthAmount = strtotime($startThisMonth);
		$arrDate = array();


		// create date array
		$startDate  = date('Y-m-d H:i:s', strtotime("-12 months", $startThisMonthAmount));
		$startDateAmount = strtotime($startDate);
		$arrDate[0] = $startDate;
		$arrDate[1] = date('Y-m-d H:i:s', strtotime('+1 months', $startDateAmount));
		$arrDate[2] = date('Y-m-d H:i:s', strtotime('+2 months', $startDateAmount));
		$arrDate[3] = date('Y-m-d H:i:s', strtotime('+3 months', $startDateAmount));		
		$arrDate[4] = date('Y-m-d H:i:s', strtotime('+4 months', $startDateAmount));		
		$arrDate[5] = date('Y-m-d H:i:s', strtotime('+7 months', $startDateAmount));		
		$arrDate[6] = date('Y-m-d H:i:s', strtotime('+8 months', $startDateAmount));	
		$arrDate[7] = date('Y-m-d H:i:s', strtotime('+9 months', $startDateAmount));	
		$arrDate[8] = date('Y-m-d H:i:s', strtotime('+10 months', $startDateAmount));	
		$arrDate[9] = date('Y-m-d H:i:s', strtotime('+11 months', $startDateAmount));			
		$arrDate[10] = $startThisMonth;
		$arrDate[11] = $toDate;		

		foreach($arrDate as $i => $oneDate) {
			if(!$i) continue;
			// foreach time here
			$row = array();
			$oneDateFormated = date('d-m-Y', strtotime($oneDate));
			array_push($row, array('v' => $oneDateFormated));			
			// get row data 
			foreach($arrUser as $j => $user) {
				// get row data 
				$arrOrderDetail = OrderDetail::where('user_trace', 'like', '%'.$user->user_trace.'%')->where('order_status', '>', ORDER_NEED_ACCEPT)->where('order_status', '<', ORDER_CANCEL)->where('created_at', '>', $arrDate[$i-1])->where('created_at', '<', $arrDate[$i])->get();
				$orderTotal = 0;
				foreach($arrOrderDetail as $orderDetail) {
					$orderTotal += $orderDetail->product_total;
				}					
				$orderTotalXu = round($orderTotal/200000, 2);	
				// making alert data			
				if($orderTotalXu > $arrAlertData[$j]['max']) $arrAlertData[$j]['max'] = $orderTotalXu;
				if($i === (count($arrDate)-1)) $arrAlertData[$j]['current'] = $orderTotalXu;

				$inrow = array('v' => $orderTotalXu);				
				array_push($row, $inrow);
			}
			$rowC = array('c' => $row);
			array_push($rows, $rowC);
		}

		$chartData = array('cols' => $cols, 'rows' => $rows);	    
		$returnData = array('chartData' => $chartData, 'alertData' => $arrAlertData);

		return Response::json($returnData);
	}
	public function getOrderDetailsReportDay($id = 0) {		
		if(!$id) $id = Auth::user()->id;
		$cols = array();
		$rows = array();
		$arrAlertData = array();
		$arrAlertData['currentDay'] = (int)date('d');

		// get column data
		// first column 
		$col = array('id' => 'month', 'label' => 'Thời gian', 'type' => 'string', 'p' => array());
		array_push($cols, $col);
		// other column is user 
		$arrUser = User::where('user_parent', '=', $id)->orWhere('id', '=', $id)->get();

		foreach($arrUser as $i => $user) {
			$arrAlertData[$i]['user'] = $user->user_fullname;
			$arrAlertData[$i]['id']   = $user->id;
			$arrAlertData[$i]['max']  = 0;
			$col = array('id' => $user->id, 'label' => $user->user_fullname, 'type' => 'number', 'p' => array());
			array_push($cols, $col);			
		}

		// here we create default timeline monthly and 3 month
		$toDate = date('Y-m-d H:i:s');				
		$startThisMonth = date('Y-m-d 23:59:59', strtotime('-1 days', strtotime(date('Y-m-01 H:i:s')))); // start from day 31/ 23:59:59 last month
		$startThisMonthAmount = strtotime($startThisMonth);
		$runningDay = $startThisMonthAmount;		
		
		$i = 0;	
		while($runningDay <= strtotime($toDate))
		{						
			// making time
			$dateBeforeRunningDay = date('Y-m-d H:i:s', $runningDay);
			$runningDayString = date('Y-m-d H:i:s', strtotime('+1 days', $runningDay));
			$runningDay = strtotime($runningDayString);		
			$row = array();
				
			$runningDayStringFormated = date('d-m-Y', strtotime($runningDayString));
			array_push($row, array('v' => $runningDayStringFormated));			
			// get row data 
			foreach($arrUser as $j => $user) {
				// get row data 
				$arrOrderDetail = OrderDetail::where('user_trace', 'like', '%'.$user->user_trace.'%')->where('order_status', '<', ORDER_CANCEL)->where('order_status', '>', ORDER_NEED_ACCEPT)->where('created_at', '>', $dateBeforeRunningDay)->where('created_at', '<', $runningDayString)->get();
				$orderTotal = 0;
				foreach($arrOrderDetail as $orderDetail) {
					$orderTotal += $orderDetail->product_total;
				}					
				$orderTotalXu = round($orderTotal/200000, 2);
				// making alert data			
				if($orderTotalXu > $arrAlertData[$j]['max']) $arrAlertData[$j]['max'] = $orderTotalXu;
				$arrAlertData[$j]['current'] = $orderTotalXu;				
				$inrow = array('v' => $orderTotalXu);
				array_push($row, $inrow);
			}
			$rowC = array('c' => $row);
			array_push($rows, $rowC);	
			$i++;	
	    }
	    $chartData = array('cols' => $cols, 'rows' => $rows);
	    $alertData = array();
		$returnData = array('chartData' => $chartData, 'alertData' => $arrAlertData);

		return Response::json($returnData);
	}
	public function getOrderDetailsInMonth($id = 0) {
		if(!$id) $id = Auth::user()->id;						
		// other column is user 
		$user = User::find($id);
		
		$arrOrderDetail = OrderDetail::where('user_id', '=', $user->id)->where('created_at', '>', date('Y-m-01 00:00:00'))->where('created_at', '<', date('Y-m-d H:i:s'))->get();
		$orderTotal = 0;
		foreach($arrOrderDetail as $orderDetail) {
			$orderTotal += $orderDetail->product_total;
		}						
		$returnData = array('user' => $user->user_fullname, 'id' => $user->id, 'total' => $orderTotal);

		return Response::json($returnData);
	}
	// single
	public function post() {			
		$currentUser = Auth::user();
		// init value $arrInitSize use to cal money
		$arrInitSize = array(array(82, 64, 86, 85), array(86, 68, 90, 85), array(90, 72, 94, 85)); 		
		
		// validate data
		$input = Input::json(); 		
		$input_arr = (array)$input;
		$input_arr = reset($input_arr);				
		$rules = array( 
			'user_id' 	=> 'required|integer|exists:users,id',
			'quantity' 	=> 'required|integer',
			'id' 		=> 'required|integer|exists:product,id',			
			'note' 		=> 'max:200',
			'address' 	=> 'max:200',
			'arrSize.0' => 'required|integer',
			'arrSize.1'	=> 'required|integer',
			'arrSize.2'	=> 'required|integer',
			'arrSize.3'	=> 'required|integer',
			'size'      => 'required'
		);
		$validator = Validator::make($input_arr, $rules);

		if($validator->fails()) {
		        $reponseData = array('success' => false, 'errors' => $validator->getMessageBag()->toArray());
			return Response::json($reponseData);
		}
		else {
			// calculate the bonus price 			
			$product_bonus = 0;
			$size = $input_arr['size'];
			if($size === 'S') $size = 0; else if($size === 'M') $size = 1; else if($size === 'L') $size = 2;
			foreach($arrInitSize[$size] as $i => $initSizeDetail) {
				if($initSizeDetail != $input_arr['arrSize'][$i]) {
					if($i != 3) $product_bonus += 15000;
					else        $product_bonus += 50000;
				}
			}

			$product = Product::find($input_arr['id']);

			// make order object data
			$order = new Order;
			$order->user_id_get 	= $currentUser->id;
			$order->order_status 	= 1;
			$order->order_count 	= $input_arr['quantity'];
			$order->order_count_old = $input_arr['quantity'];
			$order->order_date_start = date('Y-m-d H:i:s');				
			$order->save();
			
		    // make order detail object data		    
		    $orderDetail = new OrderDetail;
		    $orderDetail->user_id 	= $currentUser->id;
		    $orderDetail->user_fullname = $currentUser->user_fullname;
		    $orderDetail->order_id 		= $order->id;
		    $orderDetail->user_trace 	= $currentUser->user_trace;
		    $orderDetail->product_id 	= $input_arr['id'];	
		    $orderDetail->product_size  = $input_arr['size'];	    
		    $orderDetail->product_size1 = $input_arr['arrSize'][0];
		    $orderDetail->product_size2 = $input_arr['arrSize'][1];
		    $orderDetail->product_size3 = $input_arr['arrSize'][2];
		    $orderDetail->product_size4 = $input_arr['arrSize'][3];
		    $orderDetail->product_count = $input_arr['quantity'];
		    $orderDetail->product_name 		= $product->product_name;
		    $orderDetail->product_picture 	= $product->product_picture;
		    $orderDetail->product_price 	= $product->product_price;
		    $orderDetail->product_bonus 	= $product_bonus;
		    $orderDetail->product_total		= ($product_bonus + $product->product_price)*$input_arr['quantity'];	
		    $orderDetail->order_permission 	= 1;
		    $orderDetail->order_status 		= 1; 
		    $orderDetail->order_decription 	= $input_arr['note'];
		    $orderDetail->order_address 	= $input_arr['address'];	    
		    $orderDetail->order_produce 	= 0; // just didn't produce any yet
		    $orderDetail->started_at 		= date('Y-m-d H:i:s');
	        //$orderDetail->order_bonus = 0; NEED TO CAL
		    //$orderDetail->order_needtopay = 0; NEED TO CAL
			//calculate size	

		    $orderDetail->save();    		    
                    $orderDetail->success = true;		    
		    return Response::json($orderDetail);	
		}
	}

	public function cancelOrGet($id) {
		$orderDetail = OrderDetail::find($id);
		if($orderDetail->order_status <= ORDER_NEED_ACCEPT) {
			$orderDetail->order_status = ORDER_CANCEL;
		}
		else if ($orderDetail->order_status >= ORDER_NEED_PRODUCE) {
			$orderDetail->is_get = ORDER_GETTED;
			$orderDetail->received_at = date('Y-m-d H:i:s');

			$stock = new Stock();
			$stock->user_id 		= Auth::user()->id;
			$stock->product_id 		= $orderDetail->product_id;
			$stock->orderdetail_id 	= $orderDetail->id;
			$stock->stock_quantity 	= $orderDetail->product_count;
			$stock->stock_remain   	= $orderDetail->product_count;
			$stock->is_old         	= 0;
			$stock->save();
		}
		$orderDetail->save();

		return Response::json($orderDetail);
	}
	public function produce($id) {
		$orderDetail = OrderDetail::find($id);
		if($orderDetail->order_status == ORDER_NEED_PRODUCE) {
			$orderDetail->order_status = ORDER_PRODUCED;
			$orderDetail->produced_at = date('Y-m-d H:i:s');
			$orderDetail->save();
		}

		return Response::json($orderDetail);
	}
	public function accept($id) {
		$orderDetail = OrderDetail::find($id);
		if($orderDetail->order_status == ORDER_NEED_ACCEPT) {
			$orderDetail->order_status = ORDER_NEED_PRODUCE;
			$orderDetail->accepted_at = date('Y-m-d H:i:s');
			$orderDetail->save();
		}

		return Response::json($orderDetail);
	}
	public function allow($id) {
		$orderDetail = OrderDetail::find($id);
		if($orderDetail->order_status == ORDER_WAIT) {
			$orderDetail->order_status = ORDER_NEED_ACCEPT;
			$orderDetail->accepted_at = date('Y-m-d H:i:s');
			$orderDetail->save();
		}

		return Response::json($orderDetail);
	}
	public function cancel($id) {
		$orderDetail = OrderDetail::find($id);
		if($orderDetail) {
			$orderDetail->order_status = ORDER_CANCEL;
			$orderDetail->end_at = date('Y-m-d H:i:s');
			$orderDetail->save();
		}

		return Response::json($orderDetail);
	}
	public function notaccept($id) {
		$orderDetail = OrderDetail::find($id);
		if($orderDetail->order_status == ORDER_NEED_ACCEPT) {
			$orderDetail->order_status = ORDER_WAIT;
			$orderDetail->save();
		}

		return Response::json($orderDetail);
	}

	public function getStock() {
		$currentUser = Auth::user();
		$stock = Stock::join('orderdetail', function($join) {
			$join->on('orderdetail.id', '=', 'stock.orderdetail_id');
		})
		->select('orderdetail.*', 'stock.*', 'orderdetail.id as orderdetailold_id')
		->where('stock.user_id', '=', $currentUser->id)
		->get();

		return Response::json($stock);
	}

	public function getStocktree() {
		$currentUser = Auth::user();
		$stock = Stock::join('orderdetail', function($join){
			$join->on('orderdetail.id', '=', 'stock.orderdetail_id');
		})
		->select('orderdetail.*', 'stock.*', 'orderdetail.id as orderdetailold_id')
		->where('orderdetail.user_trace', 'like', '%'.$currentUser->user_trace.'%')
		->where('stock.user_id', '!=', $currentUser->id)
		->where('stock.is_old', '=', 1)
		->get();
        
		return Response::json($stock);
	}

	public function remainStock($id = 0) {
		$currentUser = Auth::user();
		$stock = Stock::find($id); 
		if($stock){
			if($stock->user_id === $currentUser->id && !$stock->is_old) {
				$stock->is_old = 1;
				$stock->save();
			}
		}

		return Response::json($stock);
	}

	public function sellStock() {
		$sellQuantity = Input::get('sellQuantity'); 
		if(!$sellQuantity) return Response::json(array('success' => false, 'errors' => '1'));			
		$currentUser = Auth::user();
		// get input
		$id = Input::get('id') ? (int)Input::get('id'): Config::get('restful.defaults.product.id');
		$product_id = Input::get('product_id') ? (int)Input::get('product_id'): Config::get('restful.defaults.product.id');
		$product_bonus = Input::get('order_bonus') ? (int)Input::get('order_bonus'): Config::get('restful.defaults.product.id');
		$ship_bonus = Input::get('shipMoney') ? (int)Input::get('shipMoney'): Config::get('restful.defaults.product.id');
		$sale_note  = Input::get('sale_note') ? (int)Input::get('sale_note'): Config::get('restful.defaults.product.id');
		$stock = Stock::find($id);
		if(!$stock) return Response::json(array('success' => false, 'errors' => '2'));

		$customerName = Input::get('customerName') ? Input::get('customerName'): false;
		// here must validation //needtodo
		
		// find stock info
		$saleBill = new SaleBill();
		$saleBill->product_bonus = $product_bonus;
		$saleBill->product_id    = $product_id;
		$saleBill->ship_bonus    = $ship_bonus;
		$saleBill->sale_note     = $sale_note;
		if($sellQuantity >= $stock->stock_remain) {
			$sellQuantity = $stock->stock_remain;
			$stock->delete();
		} else {
			$stock->stock_remain = $stock->stock_remain - $sellQuantity;
			$stock->save();
		}
		$saleBill->sale_quantity = $sellQuantity;

		// create new customer
		if($customerName) {
			$customer = new Customer();
			$customer->customer_fullname = $customerName;
			$customer->customer_parent = $currentUser->id;
			$customer->save();
			// if have a customer
			$saleBill->customer_id = $customer->id;
		} 
		// create new sale_bill			
		$saleBill->user_id = $currentUser->id;
		$saleBill->save();
		
		return Response::json($saleBill);
	}

	public function sellBill($id) {
		// find info about customer
		$saleBill = array();
		$currentUser = Auth::user();
		$customer = Customer::find($id);
		// check if customer belong to user
		if($customer->customer_parent === $currentUser->id) {
			$saleBill = SaleBill::where('customer_id', '=', $customer->id)->get();
		}
		return Response::json($saleBill);
	}
}
 