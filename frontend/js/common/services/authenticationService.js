define(['./module'], function (services) {
	'use strict'
 
	services.factory("AuthenticationService", ['$rootScope', '$http', '$sanitize', 'SessionService', 'FlashService', 'CSRF_TOKEN',
			function($rootScope, $http, $sanitize, SessionService, FlashService, CSRF_TOKEN) {
	/*
			var cacheSession   = function() {
				SessionService.set('authenticated', true);		
			};
	*/
			var uncacheSession = function() {
				SessionService.unset('authenticated');
			};

			var loginError = function(response) {
				FlashService.show(response.flash);
			};

			var sanitizeCredentials = function(credentials) {
				return {
					email: $sanitize(credentials.email),
					password: $sanitize(credentials.password),
					csrf_token: CSRF_TOKEN
				};
			};

			return {
				login: function(credentials) {				
					var login = $http.post("auth/login", sanitizeCredentials(credentials));
					
					//if success save data to session
					login.success(function(data) {
						SessionService.set('authenticated', true);
						SessionService.set('userId', data.user.id);
						SessionService.set('userRole', data.user.user_role);
					});
					//login.success(cacheSession(data));
					login.success(FlashService.clear);
					login.error(loginError);
					
					return login;
				},
				logout: function() {
					var logout = $http.get("auth/logout");
					logout.success(uncacheSession);
					return logout;
				},
				isLoggedIn: function() {
					return SessionService.get('authenticated');
				}
			};
		}
	]);
});