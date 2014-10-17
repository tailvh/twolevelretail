define(['./module'], function (services) {
	'use strict';

	/* service use to show product page */
	services.factory("ProductService", ['$http', 'pagestartConst', 
		function($http, pagestartConst) {
			var priv = {
				baseUrl: ''
			};
		  	return {
		  		find: function(params) {
		  			return $http.get('api/product', {params: params});
		  		},
		  		// SINGLE
		  		getProduct: function(id, pres, next) {	  			
		  			// checking and give default values
			    	pres = typeof pres !== 'undefined' ? pres : 0;
			    	next = typeof next !== 'undefined' ? next  : 0;
			    	
		  			return $http.get('product/'+id+'/'+pres+'/'+next);
		  		},	  		  	
		  		deleteProduct: function(id) {
		  			if(id == null) return;
			    	var Product = $http.get('product/delete/'+id);
			    	var returnData = Product.success(function(data) {
			    		return data;
			    	})

			    	return returnData;
		  		},
		  		hideProduct: function(id) {
		  			if(id == null) return;
			    	var Product = $http.get('product/hide/'+id);
			    	var returnData = Product.success(function(data) {
			    		return data;
			    	})

			    	return returnData;
		  		},
		  		postProduct: function(product) {
		  			return $http.post('product');
		  		},
		  		// PLURAL	
			    getProducts: function(cid, page, hot, active) {				    
			    	// checking and give default values
			    	if(page == null) page = 1;		    	
			    	cid  = typeof cid  !== 'undefined' ? cid  : 0;
			    	hot  = typeof hot  !== 'undefined' ? hot  : 3;
			    	active = typeof active !== 'undefined' ? active : 3; 
			    	// get json data
			      	return $http.get('products/'+cid+'/'+page+'/'+hot+'/'+active);
			    },
			    // get home product
			    getHomeProducts: function() {
			    	return $http.get('products/home');
			    }, 
			    getAllProducts: function() {		    	
			    	return $http.get('products/all');
			    },
			    getAllCategories: function() {
			    	return $http.get('categories/all');
			    },
			    getProductsByCategory: function (cid) {
			    	return $http.get('products/'+cid);
			    },
			    getCategories: function() {
				  	return $http.get('categories');		    
			    }

			};
		}
	]);
});