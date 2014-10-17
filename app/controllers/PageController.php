<?php

class PageController extends BaseController {

	// SINGLE
	public function getPage($id) {
		$page = Page::find($id);
		return Response::json($page);
	}

	public function unusePage($id) {
		$page = Page::find($id);
		if(!empty($page)) {
			$page->is_active = 0;
			$page->save();
			return Response::json(array('success' => true));
		}

		return Response::json(array('success' => false));
	}

	public function postPage() {
		// validate data
		$input = Input::json(); 		
		$input_arr = (array)$input;
		$input_arr = array_values($input_arr)[0];//array_shift(array_slice($input_arr, 0, 1));	//array_values($array)[0]; this for php later 5.4  // sooner array_shift(array_slice($array, 0, 1)) 			

		$rules = array( 
			//'id' 	=> 'integer',
			'name' 	=> 'required',		
			'new_codename' => 'required'	
		);
		$validator = Validator::make($input_arr, $rules);
		if($validator->fails()) {
			return Response::json(array('success' => false, 'errors' => $validator->getMessageBag()->toArray()));
		}
		else{

			// calculate the bonus price 			
			$page = Page::find(Input::json("id"));		

			if(empty($page)) 
			// make order object data
			$page = new Page;			

			$page->new_name 	= Input::json("name"); 
			$page->new_codename = Input::json("new_codename");
			$page->new_content 	= Input::json("htmlContent"); 			
			$page->user_id      = Auth::user()->id;
			$page->user_fullname = Auth::user()->user_fullname;

			$page->save();
			 
			$page['success'] = true;		    
		    return Response::json($page);
		}
	}

	// PLURAL
	public function getPages() {		
		$pages = Page::where('is_active', '=', 1)->get();
		return Response::json($pages);
	}	
}