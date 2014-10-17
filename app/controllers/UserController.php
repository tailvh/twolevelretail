<?php
set_time_limit(60000); //60 seconds = 1 minute
const ORDER_NEED_ACCEPT = 1;
const ORDER_NEED_PRODUCE = 2;
const ORDER_PRODUCED = 3;
const ORDER_CANCEL = 4;
const ORDER_DELETE = 5;

const ORDER_GETTED = 1;

class UserController extends BaseController {
	
	//////////////////
	// USER METHODS //
	//////////////////
	public function getUser($id = 0) {
		if(!$id) 
			$returnResult = Auth::user();
		else		
			$returnResult = User::find($id);

		$returnResult['success'] = true;
		return Response::json($returnResult);
	}

	public function supportUser($id) {
		$user = User::find($id);
		$returnResult = array();

		if(isset($user->id)) {
			$user->supported_at = date('Y-m-d H:i:s');
			$user->supported_by = Auth::user()->id;
			$user->save();

			$returnResult['success'] = true;
			$returnResult['id'] = $id;
		}
		else 
			$returnResult['success'] = false;

		return Response::json($returnResult);
	}

	public function getUsers() {
		$currentUser = Auth::user();
		$returnResult = User::orderBy('id', 'ASC');

		if(!empty($currentUser))			
			$returnResult = $returnResult->where('user_trace', 'like', '%'.$currentUser->user_trace.'%')->where('is_customer', '=', 0)->get();
		else 
			$returnResult = $returnResult->find(-1);

		// we must comment this for ngtable //$returnResult['success'] = true; 
		return Response::json($returnResult);
	}

	public function getUserAddress() {
		$returnResult = User::orderBy('id', 'ASC')->take(20);
		$returnResult = $returnResult->get(array('id', 'user_fullname', 'user_phone', 'user_facebook', 'user_address'));
		return  Response::json($returnResult);
	}
	public function getUsersNeedSupport($id = 0) {
		if(!$id) $id = Auth::user()->id;

		//get f1 need support
		$f1Users = User::where('user_parent', '=', $id)->where('is_customer', '=', 0)->orderBy('supported_at', 'ASC')->take(4)->get();		
		//get f2...n need support
		$fnUsers = User::where('user_trace', 'like', '%'.Auth::user()->user_trace.'%')->where('user_parent', '!=', $id)->where('id', '!=', $id)->where('is_customer', '=', 0)->orderBy('supported_at', 'ASC')->take(4)->get();

		$returnResult = array('f1Users' => $f1Users->toArray(), 'fnUsers' => $fnUsers->toArray());		
		return Response::json($returnResult);
	}

	public function getUsersTree() {		
		$currentUser = Auth::user();
		$returnResult = User::orderBy('id', 'DESC');	

		// we make object for user tree view.
		if(!empty($currentUser))
		{
			$tempUserArray = $returnResult->where('user_trace', 'like', '%'.$currentUser->user_trace.'%')->where('is_customer', '=', 0)->get();
			$arrayKeepValue = array();
			$userOrderDetailArr = array();
			$ordertotal = 0;		

			// get all productDetail and set it to userOrderDetailArr			
			$arrOrder = OrderDetail::where('created_at', '>=', date('Y-m-01:00-00-00'))->where('created_at', '<', date('Y-m-31:23-59-59'))->where('order_status', '>', ORDER_NEED_ACCEPT)->where('order_status', '<', ORDER_CANCEL)->get();			
			foreach($arrOrder as $order) { 			
				if(!isset($userOrderDetailArr[$order->user_id])) $userOrderDetailArr[$order->user_id] = array();					
				array_push($userOrderDetailArr[$order->user_id], $order->product_total);							
			}			

			foreach($tempUserArray as $User) {				
				
				// explode get parent id - we need add it in database
				$traceArray = explode('-', $User->user_trace);
				$parent_id = $traceArray[count($traceArray) - 2]; 				
				$user_id = $User->id;

				// this for tree view at level3 need render at level here we rand
				$User->label = $User->user_fullname;				
				$User->ordertotal = 0;
				$User->ordertotalxu = 0;

				// calculate the order 				
				if(isset($userOrderDetailArr[$User->id]))
				foreach($userOrderDetailArr[$User->id] as $product_total)
				{										
					$User->ordertotal += $product_total;					
				}												
				$User->ordertotalxu = floor($User->ordertotal/188000);		
				$User->oneordertotalxu = $User->ordertotalxu;
				$User->oneordertotal = $User->ordertotal;		
				$User->percent = $this->calPercent($User->ordertotalxu, 1);
				$User->onepercent = $User->percent;
				$User->level = $this->calPercent($User->ordertotalxu, 0);    

				// export to array
				$User = $User->toArray();
				// check if not set
				if(!isset($arrayKeepValue[$user_id])) $arrayKeepValue[$user_id] = array();		
				if(!isset($arrayKeepValue[$user_id]['percent'])) $arrayKeepValue[$user_id]['percent'] = 0;		
				if(!isset($arrayKeepValue[$user_id]['ordertotal'])) $arrayKeepValue[$user_id]['ordertotal'] = 0;
				if(!isset($arrayKeepValue[$user_id]['ordertotalxu'])) $arrayKeepValue[$user_id]['ordertotalxu'] = 0;
				if(!isset($arrayKeepValue[$user_id]['ordertotalsalary'])) $arrayKeepValue[$user_id]['ordertotalsalary'] = 0;
				if(!isset($arrayKeepValue[$user_id]['ordertotalsalaryminus'])) $arrayKeepValue[$user_id]['ordertotalsalaryminus'] = 0;

				if(isset($arrayKeepValue[$user_id]['children']))				
					$User['children'] = $arrayKeepValue[$user_id]['children'];

				$User['ordertotal'] += $arrayKeepValue[$user_id]['ordertotal'];
				$User['ordertotalxu'] += $arrayKeepValue[$user_id]['ordertotalxu'];
				$User['ordertotalsalaryminus'] = $arrayKeepValue[$user_id]['ordertotalsalaryminus'];
				$User['percent'] = $this->calPercent($User['ordertotalxu'], 1); 
				$User['level'] = $this->calPercent($User['ordertotalxu'], 0);   	
				$User['ordertotalsalary'] = $User['ordertotal']*$User['percent']/100;
				$arrayKeepValue[$user_id] = $User;

				if(!isset($arrayKeepValue[$parent_id])) $arrayKeepValue[$parent_id] = array();				

				// check if child is a array
				if(!isset($arrayKeepValue[$parent_id]['children']))
					$arrayKeepValue[$parent_id]['children'] = array();
								
				array_push($arrayKeepValue[$parent_id]['children'], $User);		

				// check if isset ordertotal		
				if(!isset($arrayKeepValue[$parent_id]['ordertotal'])) $arrayKeepValue[$parent_id]['ordertotal'] = 0;
				if(!isset($arrayKeepValue[$parent_id]['ordertotalxu'])) $arrayKeepValue[$parent_id]['ordertotalxu'] = 0;
				if(!isset($arrayKeepValue[$parent_id]['ordertotalsalaryminus'])) $arrayKeepValue[$parent_id]['ordertotalsalaryminus'] = 0;

				$arrayKeepValue[$parent_id]['ordertotal'] 	+= $User['ordertotal'];									
				$arrayKeepValue[$parent_id]['ordertotalxu'] += $User['ordertotalxu'];
				$arrayKeepValue[$parent_id]['ordertotalsalaryminus'] -= $User['ordertotalsalary'];										
			} 
			$returnResult = $arrayKeepValue[$currentUser->id];						
		}		
		// if empty we return {}
		else 
			$returnResult = $returnResult->find(-1);

		$returnResult['success'] = true;
		return Response::json($returnResult);
	}
	// POST
	public function postUser() {
		$file = Input::file('myFile');
		$arrData = Input::all();
		$arrData['myFile'] = $file;		
		// validation image or file use php_fileinfo.dll of php, we must enable in php.ini
		$rules = array(
			'myFile' 	=> 'required|image|max:500000',
			'name'   	=> 'required',
			'username' 	=> 'required|unique:users,email',
			'email'		=> 'email',
			'address'	=> 'max:200',
			'phone'		=> 'numeric',
			'iscustomer'=> 'numeric'
		);
		$validator = Validator::make($arrData, $rules);		
		if ( $validator->fails() )
		{ 
		        $reponseData = array('success' => false, 'errors' => $validator->getMessageBag()->toArray());
			return Response::json($reponseData);			
		}
		else {	
			// after validation we excute logic
			$currentUser = Auth::user();			
			// image processing 
			$destinationPath = 'assets/img/avatars/';
			$filename = $file->getClientOriginalName();
			Input::file('myFile')->move($destinationPath, $filename);
			// making data
			$user = new User();			
			$user->email 			= $arrData['username'];
			$user->password 		= Hash::make($arrData['password']);
			$user->user_fullname 	= $arrData['name'];
			//$user->user_age = null;  // this will be add soon
			$user->user_address 	= $arrData['address'];
			$user->user_email 		= $arrData['email'];
			$user->user_phone 		= $arrData['phone'];
			$user->is_customer      = $arrData['iscustomer'] | 0;			
			$user->user_sex 		= 1; 	// man only now 	
			$user->user_picture 	= $filename;
			$user->user_role 		= 1;	//	normal user
			$user->user_language 	= 1;	//	vietnamese
			$user->user_parent 		= $currentUser->id;
			$user->save(); //	save get user id			
			$user->user_trace 		= $currentUser->user_trace .'-'. $user->id;			
			$user->save();

			$arrData['success'] = true;
			return Response::json($arrData);
		}
	}
	public function postUserUpdate() {
		$file = Input::file('myFile'); 			
		$arrData = Input::all();
		$arrData['myFile'] = $file;		
		// validation image or file use php_fileinfo.dll of php, we must enable in php.ini
		$rules = array(
			'myFile' 	=> 'image|max:50000',
			'name'   	=> 'required',
			'username' 	=> 'required',
			'email'		=> 'email',
			'address'	=> 'max:2000',
			'phone'		=> 'numeric'
		);
		$validator = Validator::make($arrData, $rules);		
		if ( $validator->fails() )
		{ 
		        $reponseData = array('success' => false, 'errors' => $validator->getMessageBag()->toArray());
			return Response::json($reponseData);			
		}
		else {	
			// after validation we excute logic
			$currentUser = Auth::user();			

			if($currentUser->id != $arrData['id']){	
		        $reponseData = array('success' => false, 'errors' => $validator->getMessageBag()->toArray());
				return Response::json($reponseData);
            }			
			/*if(!Auth::attempt(array('email' => $arrData['username'], 'password' => $arrData['password']), true)){
                $reponseData = array('success' => false, 'errors' => $validator->getMessageBag()->toArray());
				return Response::json($reponseData);						
            }*/
			// making data
			$user = User::find($currentUser->id);						
			
			if(!empty($arrData['newpassword']) && $arrData['newpassword'] != '' && $arrData['newpassword'] != 'null')
				$user->password 		= Hash::make($arrData['newpassword']);
			$user->user_fullname 	= $arrData['name'];
			//$user->user_age = null;  // this will be add soon
			$user->user_address 	= $arrData['address'];
			$user->user_email 		= $arrData['email'];
			$user->user_facebook 	= $arrData['facebook'];
			$user->user_phone 		= $arrData['phone'];			
			$user->user_sex 		= 1; 	// man only now 
			// image processing 
			if(null !== (Input::file('myFile'))) {
				$destinationPath = 'assets/img/avatars/';
				$filename = $file->getClientOriginalName();
				Input::file('myFile')->move($destinationPath, $filename);
				$user->user_picture 	= $filename;
			} 			
			$user->user_language 	= 1;	//	vietnamese
			$user->save(); //	save get user id			
			
			$arrData['success'] = true;
			return Response::json($arrData);
		}
	}
	///////////////////////
	// USERGROUP METHODS //
	///////////////////////
	public function getUsergroup($id = 0) {
		$returnResult = Usergroup::find($id);

		$returnResult['success'] = true;
		return Response::json($returnResult);
	}

	public function getUsergroups() {
		$returnResult = Usergroup::all();

		$returnResult['success'] = true;
		return Response::json($returnResult);
	}

	//////////////////////
	// USERROLE METHODS //
	//////////////////////
	public function getUserrole($id = 0) {
		$returnResult = Userrole::find($id);

		$returnResult['success'] = true;
		return Response::json($returnResult);
	}

	public function getUserroles() {
		$returnResult = Userrole::all();

		$returnResult['success'] = true;
		return Response::json($returnResult);
	}

	////////////
	// HELPER //
	////////////

	// use this to add an forevalue and user value
	private function addTwoUser($Values, $User) {
		$tempValues = $Values;
		$Values = $User;

		if($tempValues instanceof object)
			$Values->child = $tempValues->child;
	}

	private function calPercent($total, $type) {
		if($total < 15) if($type) return 12; else return 1;
		else if ($total < 45) if($type) return 15; else return 2;
		else if ($total < 150) if($type) return 18; else return 3;
		else if ($total < 450) if($type) return 21; else return 4;
		else if ($total < 1200) if($type) return 24; else return 5;
		else if ($total < 3600) if($type) return 27; else return 6; 
		else if ($total < 10800) if($type) return 30; else return 7;
		else if ($total < 30000) if($type) return 33; else return 8;
		else return 0; // need more for 35%
	}
}