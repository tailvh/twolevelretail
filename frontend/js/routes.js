// Defines the main routes

define(['./app'], function (app) {
	'use strict';

    ///////////
    // CONST //
    ///////////
    app.constant('offsetConst', 0);  // pagination offset
    app.constant('limitConst', 12);  // pagination limit
    app.constant('pagestartConst', 1); // page start 
    app.constant('hotConst', 1); // is_hot product    

    ////////////
    // CONFIG //
    ////////////   
	app.config(['$httpProvider', 
        function($httpProvider) {
    	    var logsOutUserOn401 = ['$location', '$q', 'SessionService', 'FlashService', 
                function($location, $q, SessionService, FlashService) {
            	    var success = function(response) {
            	      return response;
            	    };

            	    var error = function(response) {
            	      if(response.status === 401) {
            	        SessionService.unset('authenticated');
            	        $location.path('/login');
            	        FlashService.show(response.data.flash);
            	      }
            	      return $q.reject(response);
            	    };

            	    return function(promise) {
            	      return promise.then(success, error);
            	    };
                }
            ];

    	    $httpProvider.responseInterceptors.push(logsOutUserOn401);
	    }
    ]);

	app.config(['$stateProvider', '$urlRouterProvider', '$FBProvider', 
        function ($stateProvider, $urlRouterProvider, $FBProvider) {
            $FBProvider.setLocale('vi_VN');
            $FBProvider.setInitParams({
                // This is my FB app id for plunker demo app
                appId: '232488576874761'
            });  
            $urlRouterProvider
                .when('/c?id', '/contacts/:id')
                .when('/user/:id', '/contacts/:id')            
                .otherwise('/home');

            //////////////////////////
            // State Configurations //
            //////////////////////////
	    }
    ]);

	app.constant("CSRF_TOKEN", angular.element(document.querySelector('#token')).text());

	app.run(['$rootScope', '$location', '$anchorScroll', '$routeParams', 'AuthenticationService', 'FlashService', '$state', '$stateParams',
        function($rootScope, $location, $anchorScroll, $routeParams, AuthenticationService, FlashService, $state,  $stateParams) {         
            // state need to auth 
            var statesThatRequireAuth = ['admin'];        

            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams){                
                if(((_.filter(statesThatRequireAuth, function(str){ return (toState.name.indexOf(str) != -1); })).length > 0) && !AuthenticationService.isLoggedIn()) {
                    $location.path('/login');
                    FlashService.show("Please log in to continue.");
                }

            });

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]);
})