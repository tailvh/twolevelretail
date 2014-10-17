define(['./module'], function (services) {
	'use strict';

	/* service use to show product page */
	services.factory("PageService", ['$http', 
		function($http) {
		  	return {
		  		// PLURAL
		  		getPages: function() {	  			
		  			// checking and give default values		    	
		  			return $http.get('pages');
		  		},	  	
		  		// SINGLE		
		  		getPage: function(id) {
		  			var reponseData = $http.get("page/" + id);
		  			return reponseData;
		  		},
		  		unusePage: function(id) {
		  			var reponseData = $http.get("page/unuse/" +id);
		  			return reponseData;
		  		},
		  		postPage: function(pageData) {
		  			var reponseData = $http.post("page", pageData);		 		    	
			    	return reponseData;
		  		}	
			};
		}
	]);
});