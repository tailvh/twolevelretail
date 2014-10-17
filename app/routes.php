<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

/* 
*	I MAKE IT A RESTFUL API	
*/

Route::get('/', function() {
	return View::make('singlepage');
});

/* DEFINE GLOBAL PATTERN */
Route::pattern('id', '[0-9]+');
Route::pattern('cid', '[0-9]+');
Route::pattern('page', '[0-9]+');
Route::pattern('pres', '[0-3]+');
Route::pattern('next', '[0-3]+');
Route::pattern('hot', '[0-3]+');

//////////
// USER //
//////////
Route::get('/user/address', 'UserController@getUserAddress');
Route::get('/user/{id?}', array('before' => 'auth', 'uses' => 'UserController@getUser'));
Route::get('/user/support/{id}', array('before' => 'auth', 'uses' => 'UserController@supportUser'));
Route::get('/users', array('before' => 'auth', 'uses' => 'UserController@getUsers'));
Route::get('/users/support/{id?}', array('before' => 'auth', 'uses' => 'UserController@getUsersNeedSupport'));
Route::get('/userstree', array('before' => 'auth', 'uses' => 'UserController@getUsersTree'));
Route::post('/user', array('before' => 'auth', 'uses' => 'UserController@postUser'));
Route::post('/user/update', array('before' => 'auth', 'uses' => 'UserController@postUserUpdate'));
//////////////
// CUSTOMER //
//////////////
Route::get('customers/user', array('uses' => 'CustomerController@getCustomersOfUser'));
////////////////
// USER GROUP //
////////////////
Route::get('/usergroup/{id?}', array('before' => 'auth', 'uses' => 'UserController@getUsergroup'));
Route::get('/usergroups', array('before' => 'auth', 'uses' => 'UserController@getUsergroups'));

//////////
// ROLE //
//////////
Route::get('/role/{id?}', array('before' => 'auth', 'uses' => 'UserController@getRole'));
Route::get('/roles', array('before' => 'auth', 'uses' => 'UserController@getRoles'));

//////////
// BOOK //
//////////
Route::get('/book', array('before' => 'auth','uses' => 'BookController@getBook')); /* need authen get */
Route::get('/books', array('uses' => 'BookController@getBooks')); /* need authen get */

/////////////
// PRODUCT //
/////////////
// remove soon here we install restful service
Route::group(array(
	'prefix' => 'api/product',
	'before' => 'auth',
), function() {
	// Find products
	//Route::get('', array('uses' => 'ApiProductController@find'));
	// Get products by id
	//Route::get('{id}', array('uses' => 'ApiProductController@getById'))->where(array('id' => '[0-9]+'));
	// Create product
	//Route::post('', array('uses' => 'ApiProductController@create'));
	// Update product by id
	//Route::put('{id}', array('uses' => 'ApiProductController@update'))->where(array('id' => '[0-9]+'));
	// Delete product by id
	//Route::delete('{id}', array('uses' => 'ApiProductController@delete'))->where(array('id' => '[0-9]+'));
});  

Route::get('/product/{id?}/{pres?}/{next?}', 'ProductController@getProduct');    // pres, next = 1 or = 0
Route::get('/product/delete/{id}', 'ProductController@deleteProduct');
Route::get('/product/hide/{id}', 'ProductController@hideProduct');
Route::get('/products/{cid?}/{page?}/{hot?}/{active?}', 'ProductController@getProducts');
Route::get('/products/all', 'ProductController@getAllProducts');
Route::get('/products/home', 'ProductController@getHomeProducts');
Route::post('/product', array('before' => 'auth', 'uses' => 'ProductController@postProduct'));

Route::get('/categories/all', 'ProductController@getAllCategories');

//////////////
// CATEGORY //
//////////////
Route::get('/category', 'ProductController@getCategory');
Route::get('/categories', 'ProductController@getCategories');

///////////
// ORDER //
///////////
Route::post('/order/add', array(/*'before' => 'auth',*/ 'uses' => 'OrderController@post'));

///////////
// STOCK //
///////////
Route::get('/order/stock', array('uses' => 'OrderController@getStock'));
Route::get('/order/stocktree', array('uses' => 'OrderController@getStocktree'));
Route::get('/order/remainstock/{id}', array('uses' => 'OrderController@remainStock'));
Route::put('/order/sellstock', array('uses' => 'OrderController@sellStock'));
Route::get('/order/sellbill/{id}', array('uses' => 'OrderController@sellBill'));
//////////
// PAGE //
//////////
// PLURAL
Route::get('/pages', array('before' => 'auth', 'uses' => 'PageController@getPages'));
// SINGLE
Route::get('/page/{id}', array('uses' => 'PageController@getPage'));
Route::get('/page/unuse/{id}', array('before' => 'auth', 'uses' => 'PageController@unusePage'));
Route::post('/page', array('before' => 'auth', 'uses' => 'PageController@postPage'));

///////////
// IMAGE //
///////////
Route::post('image', array('before' => 'auth', 'uses' => 'ImageController@post'));

/////////////////
// ORDERDETAIL //
/////////////////
// plural
Route::get('/orderdetails', array('before' => 'auth','uses' => 'OrderController@getOrderDetails'));
Route::get('/orderdetails/tree', array('before' => 'auth', 'uses' => 'OrderController@getTreeOrderDetails'));
Route::get('/orderdetails/waitting', array('before' => 'auth', 'uses' => 'OrderController@getOrderDetailsWaitting'));
Route::get('/orderdetails/accepted/{id?}', array('before' => 'auth', 'uses' => 'OrderController@getOrderDetailsAccepted'));
Route::get('/orderdetails/inmonthaccepted', array('before' => 'auth', 'uses' => 'OrderController@getOrderDetailsInmonthAccepted'));
Route::get('/orderdetails/canceled', array('before' => 'auth', 'uses' => 'OrderController@getOrderDetailsCanceled'));
Route::get('/orderdetails/needaccept', array('before' => 'auth', 'uses' => 'OrderController@getOrderDetailsNeedAccept'));
Route::get('/orderdetails/needproduce', array('before' => 'auth', 'uses' => 'OrderController@getOrderDetailsNeedProduce'));
Route::get('/orderdetails/export/{day?}/{month?}/{year?}/{range?}', array('before' => 'auth', 'uses' => 'OrderController@getOrderDetailsExport'));
Route::get('/orderdetails/user/{id?}', array('before' => 'auth', 'uses' => 'OrderController@getUserOrderDetails'));
Route::get('/orderdetails/report/{id?}', array('before' => 'auth', 'uses' => 'OrderController@getOrderDetailsReport'));
Route::get('/orderdetails/reportday/{id?}', array('before' => 'auth', 'uses' => 'OrderController@getOrderDetailsReportDay'));
Route::get('/orderdetails/inmonth/{id?}', array('before' => 'auth', 'uses' => 'OrderController@getOrderDetailsInMonth'));
// single
Route::get('/orderdetail/cancel/{id}', array('before' => 'auth', 'uses' => 'OrderController@cancel'));
Route::get('/orderdetail/cancelorget/{id}', array('before' => 'auth', 'uses' => 'OrderController@cancelOrGet'));
Route::get('/orderdetail/accept/{id}', array('before' => 'auth', 'uses' => 'OrderController@accept'));
Route::get('/orderdetail/allow/{id}', array('before' => 'auth', 'uses' => 'OrderController@allow'));
Route::get('/orderdetail/notaccept/{id}', array('before' => 'auth', 'uses' => 'OrderController@notaccept'));
Route::get('/orderdetail/produce/{id}', array('before' => 'auth', 'uses' => 'OrderController@produce'));
// active 
Route::get('/orderdetail/action', array('before' => 'auth', 'uses' => 'OrderController@action'));
/////////////////////////
// AUTHENTICATION PART //
/////////////////////////
// return Response::json(array('flash' => 'Session expired'), 401); 
Route::post('/auth/login', array(/*'before' => 'csrf_json', */'uses' => 'AuthController@login'));
Route::get('/auth/logout', 'AuthController@logout');
Route::get('/auth/status', 'AuthController@status');
Route::get('/auth/secrets','AuthController@secrets');