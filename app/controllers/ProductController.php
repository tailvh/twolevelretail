<?php

class ProductController extends BaseController {

	// CONST
	const ITEM_PER_PAGE = 12;
	const YES = 1;
	const NON = 0;	

	public $restful = true;
	
	/////////////////////
	// PRODUCT METHODS //
	/////////////////////	

	// SINGLE
	public function getProduct($id = 0, $next = 0, $pres = 0) {				
		
		// set select from param		
		$product = Product::find($id);		
		$presId = Product::where('id', '<', $id)->where('is_active', '=', 1)->max('id');		
		$nextId = Product::where('id', '>', $id)->where('is_active', '=', 1)->min('id');							
		
		if(!empty($product))
		$returnJSON['product'] = $product->toArray();
		$returnJSON['presId'] = $presId;
		$returnJSON['nextId'] = $nextId;

		return Response::json($returnJSON);
	}

	public function deleteProduct($id) {
		$product = Product::find($id);
		if(!empty($product)) {
			$product->delete();
		}
	}

	public function hideProduct($id) {
		$product = Product::find($id);
		if(!empty($product)) {
			$product->getall = 0;
			$product->save();
		}
	}

	// PLURAL
	public function getProducts($cid = 0, $page = 1, $hot = 3, $active = 3) {		
		// set offset and limit
		$offset = ($page-1)* $this::ITEM_PER_PAGE;
		$limit  = $this::ITEM_PER_PAGE;

		// from param we set filters
		$products = Product::where('is_home', '=', 0);
		if(!empty($cid)){
			$products = $products->where('category_id', '=', $cid);
		}	
		if($hot == 1 || $hot === 0) {
			$products = $products->where('is_hot', '=', $hot);
		}
		if($active == 1 || $active === 0) {
			$products = $products->where('is_active', '=', $active);
		}
		// get number of row for pagination
		$numberRow = $products->count(); 

		// get products data
		$products = $products->orderBy('id', 'DESC')->take($limit)->skip($offset)->get();				
		
		$returnJSON['products']  = $products->toArray();
		$returnJSON['numberRow'] = $numberRow;
		$returnJSON['currentPage'] = $page;

		return Response::json($returnJSON);
	}

	public function getAllProducts() {
		$products = Product::Where('getall', '=', 1)->get();
		return Response::json($products);
	}

	public function getHomeProducts() {
		$products = Product::where('is_home', '=', 1)->get();
		return Response::json($products);
	}

	// POST METHOD
	public function postProduct() {
		$file = Input::file('myFile');
		$arrData = Input::all();
		$arrData['myFile'] = $file;		
		// validation image or file use php_fileinfo.dll of php, we must enable in php.ini
		if($arrData['upload']) {
			$rules = array(
				'myFile' 	=> 'required|image|max:500000',
				'name'   	=> 'required',
				'content'	=> 'max:10000',
				'category'	=> 'numeric',
			);
		} else {
			$rules = array(
				'name'		=> 'required',
				'content'	=> 'max:10000',
				'category'	=> 'numeric',
			);
		}
		$validator = Validator::make($arrData, $rules);		
		if ( $validator->fails() )
		{ 
	        $reponseData = array('success' => false, 'errors' => $validator->getMessageBag()->toArray());
			return Response::json($reponseData);			
		}
		else {	
			// after validation we excute logic
			$currentUser = Auth::user();			
			$currentTime = time();
			// image processing 
			if($arrData['upload']) {
				$destinationPath = 'assets/img/images/default/product/';
				$destiantionPathResized = 'assets/img/images/resized/product/';
				$filename = $currentTime . $file->getClientOriginalName();
				$finenameresized = 'resized-' . $filename;
				Input::file('myFile')->move($destinationPath, $filename);
				//
				$img = Image::make($destinationPath . $filename);
				$img->resize(400, 400);//->insert('public/watermark.png');
				$img->save($destiantionPathResized . $finenameresized);
				//Input::file('myFile')->copy($destiantionPathResized, $filenameresized);
			}
			// making data	
			// if update action perform
			if($arrData['update']) $product = Product::find($arrData['productid']);
			else $product = new Product();	

			$product->user_id			 = $arrData['id'];
			$product->category_id  		 = $arrData['category'];
			$product->product_name 		 = $arrData['name'];
			$product->product_name_en 	 = $arrData['name'];
			$product->product_description = $arrData['description'];
			$product->product_content 	 = $arrData['content'];
			$product->product_content_en = $arrData['content'];
			$product->product_price		 = $arrData['price'];
			if($arrData['upload']) 
				$product->product_picture	 	= $filename;
			else 
				$product->product_picture 		= $arrData['picture'];
			$product->is_hot   			 = $arrData['ishot'];
			$product->is_active			 = $arrData['isactive'];
			$product->is_show			 = $arrData['isshow'];
			$product->is_home			 = $arrData['ishome'];
			$product->is_freeship		 = $arrData['isfreeship'];
			$product->save();

			$returnProduct['id'] 					= $product->id;
			$returnProduct['product_name'] 			= $product->product_name;
			$returnProduct['product_description'] 	= $product->product_description;
			$returnProduct['product_content'] 		= $product->product_content;
			$returnProduct['product_price'] 		= $product->product_price;
			$returnProduct['product_picture'] 		= $product->product_picture;
			$returnProduct['category_id']			= $product->category_id;
			$returnProduct['is_hot']				= $product->is_hot;
			$returnProduct['is_active']				= $product->is_active;
			$returnProduct['is_show']				= $product->is_show;
			$returnProduct['is_home']				= $product->is_home;
			$returnProduct['is_freeship']			= $product->is_freeship;

			$arrResponseData['product'] = $returnProduct;
			$arrResponseData['success'] = true;
			return Response::json($arrResponseData);
		}
	}

	//////////////////////
	// CATEGORY METHODS //
	//////////////////////
	public function getCategory() {
		$categories = Category::all();
		return Response::json($categories);
	}

	public function getAllCategories() {
		$categories = Category::all();
		return Response::json($categories);
	}

	public function getCategories() {
		$categories = Category::all();
		return Response::json($categories);
	}
}