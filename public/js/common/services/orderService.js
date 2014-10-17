define(['./module'], function (services) {
	'use strict';

	/* service use to show product page */
	services.factory("OrderService", ['$http', '$sanitize', 'pagestartConst', 
		function($http, $sanitize, pagestartConst) {				
		  	return {
		  		getOrder: function(id, pres, next) {	  			
		  			// checking and give default values
			    	pres = typeof pres !== 'undefined' ? pres : 0;
			    	next = typeof next !== 'undefined' ? next  : 0;
			    	
		  			return $http.get('product/'+id+'/'+pres+'/'+next);
		  		},	  		
			    getOrders: function(cid, page, hot) {		    			    
			    	// checking and give default values
			    	if(page == null) page = 1;		    	
			    	cid  = typeof cid  !== 'undefined' ? cid  : 0;
			    	hot  = typeof hot  !== 'undefined' ? hot  : 3;
			    	// get json data
			      	return $http.get('products/'+cid+'/'+page+'/'+hot);
			    },
			    postOrder: function(orderData) {				    		    	
			    	var order = $http.post("order/add", orderData);		 		    	
			    	return order;
			    },
			    // ORDERDETAIL
			    // plural
			    getOrderDetails: function() {
			    	var orderDetails = $http.get('orderdetails');		    	
			    	return orderDetails;
			    },
			    getTreeOrderDetails: function() {
			    	var orderDetails = $http.get('orderdetails/tree');		    	
			    	return orderDetails;
			    },
			    getOrderDetailsWaitting: function(){
			    	var orderDetails = $http.get('orderdetails/waitting');
			    	return orderDetails
			    },
			    getOrderDetailsReport: function(pid) {
			    	if(pid == null) pid = 0;
			    	var orderDetails = $http.get('orderdetails/report/' + pid);
			    	return orderDetails;
			    },
			    getOrderDetailsReportDay: function(pid) {
			    	if(pid == null) pid = 0;
			    	var orderDetails = $http.get('orderdetails/reportday/' + pid);
			    	return orderDetails;
			    },
			    getOrderDetailsNeedInMonth: function(pid) {
			    	if(pid == null) pid = 0;
			    	var orderDetails = $http.get('orderdetails/inmonth/' + pid);
			    	return orderDetails;
			    },
			    getUserOrderDetails: function(pid) {
			    	if(pid == null) pid = 0;
			    	var orderDetails = $http.get('orderdetails/user/' + pid);		    	
			    	return orderDetails;
			    },
			    getAllOrderDetailsAccepted: function() {
			    	var orderdetails = $http.get('orderdetails/accepted');
			    	return orderdetails;
			    },
			    getInmonthOrderDetailsAccepted: function() {
			    	var orderdetails = $http.get('orderdetails/inmonthaccepted');
			    	return orderdetails;
			    },
			    getAllOrderDetailsNeedAccept: function() {
			    	var orderdetails = $http.get('orderdetails/needaccept');
			    	return orderdetails;
			    },
			    getAllOrderDetailsNeedProduce: function() {
			    	var orderdetails = $http.get('orderdetails/needproduce');
			    	return orderdetails;
			    },
			    getAllOrderDetailsCanceled: function() {
			    	var orderdetails = $http.get('orderdetails/canceled');
			    	return orderdetails;
			    },
			    getAllOrderDetailsExport: function(day, month, year, range) {
			    	// checking and give default values
			    	day = typeof day !== 'undefined' ? day : 0;
			    	month = typeof month !== 'undefined' ? month : 0;
			    	year = typeof year !== 'undefined' ? year : 0;
			    	var orderdetails = $http.get('orderdetails/export/' + day + '/' + month + '/' + year + '/' + range);
			    	return orderdetails;
			    },
			    // single
			    actOrderDetail: function(pid) {
			    	if(pid == null) return;
			    	var orderDetail = $http.get('orderdetail/cancelorget/'+pid);
			    	var returnData = orderDetail.success(function(data) {		    		
			    		return data;		    				    		
			    	})

			    	return returnData;
			    },
			    actOrderDetailAccept: function(pid) {
			    	if(pid == null) return;
			    	var orderDetail = $http.get('orderdetail/accept/'+pid);
			    	var returnData = orderDetail.success(function(data) {
			    		return data;
			    	})

			    	return returnData;
			    },
			    actOrderDetailAllow: function(pid) {
			    	if(pid == null) return;
			    	var orderDetail = $http.get('orderdetail/allow/'+pid);
			    	var returnData = orderDetail.success(function(data) {
			    		return data;
			    	})

			    	return returnData;
			    },
			    actOrderDetailCancel: function(pid) {
			    	if(pid == null) return;
			    	var orderDetail = $http.get('orderdetail/cancel/'+pid);
			    	var returnData = orderDetail.success(function(data) {
			    		return data;
			    	})

			    	return returnData;
			    },
			    actOrderDetailNotAccept: function(pid) {
			    	if(pid == null) return;
			    	var orderDetail = $http.get('orderdetail/notaccept/'+pid);
			    	var returnData = orderDetail.success(function(data) {
			    		return data;
			    	})

			    	return returnData;
			    },
			    actOrderDetailProduce: function(pid) {
			    	if(pid == null) return;
			    	var orderDetail = $http.get('orderdetail/produce/'+pid);
			    	var returnData = orderDetail.success(function(data) {
			    		return data;
			    	})

			    	return returnData;
			    },
			    // STOCK SECTION
			    getStock: function() {
			    	return $http.get('order/stock');
			    },
			    getStocktree: function() {
			    	return $http.get('order/stocktree');
			    },
			    remainStock: function(pid) {
			    	if(pid == null) return;
			    	return $http.get('order/remainstock/' + pid);
			    },
			    sellStock: function(params) {
			    	return $http.put('order/sellstock', params);
			    },
			    // SALEBILL SECTION
			    getBillOfCustomer: function(pid) {
			    	return $http.put('order/sellbill/' + pid);
			    }
			};
		}
	]);
});