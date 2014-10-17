define(['./module'], function (services) {
	'use strict';

	/* service use to show product page */
	services.factory("UserService", ['$http', 'pagestartConst', 
		function($http, pagestartConst) {
		  	return {
		  		getAddress: function() {
		  			return $http.get('user/address');
		  		},
		  		getUser: function(id) {	  			
		  			// checking and give default values
			    	if(id == null) id = 0;
		  			return $http.get('user/'+id);
		  		},	  		
		  		supportUser: function(id) {
		  			if(id == null) return;
		  			return $http.get('user/support/' + id);
		  		},
			    getUsers: function() {			    	    			    		    
			      	return $http.get('users');
			    },
			    getUsersNeedSupport: function(id){
			    	if(id == null) id = 0;
			    	return $http.get('users/support/'+ id);
			    },
			    getUsersTree: function() {		    	
			    	return $http.get('userstree');
			    },
			    getUsergroup: function (id) {
			    	if(id == null) id = 0;
			    	return $http.get('usergroup/'+id);
			    },
			    getUsergroups: function() {
				  	return $http.get('usergroups');		    
			    },
			    getRole: function (id) {
			    	if(id == null) id = 0;
			    	return $http.get('role/'+id);
			    },
			    getRoles: function() {
				  	return $http.get('roles');		    
			    },
			    //////////////////////
			    // customer section //
			    //////////////////////
			    getCustomersOfUser: function() {
			    	return $http.get('customers/user');
			    }    
			};
		}
	]);
});