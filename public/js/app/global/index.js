/*
*   GLOBAL MODULE
* */
define(['angular'], function(ng){
   'use strict';

    return ng.module('app.global', ['ui.router.state', 'ui.bootstrap'])        
        .controller('GlobalController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', 'AuthenticationService', 'SessionService', 
            function($scope, $rootScope, $state, $stateParams, $location, AuthenticationService, SessionService) {        
            
                $rootScope.userRole = SessionService.get('userRole'); 
                $rootScope.authenticated = SessionService.get('authenticated');
                $scope.authenticated = $rootScope.authenticated;
                // URL exactly equal route
                $scope.isActive = function(route) {
                    if(route === $location.path()) return 'customactive';
                };
                // URL containt route
                $scope.isActiveContent = function(route) {
                    if($location.path().indexOf(route) != -1) return 'customactive';
                };
                // URL containt route not unroute
                $scope.isActiveContentB = function(route, unroute) {
                    if(($location.path().indexOf(route) != -1) && ($location.path().indexOf(unroute) === -1)) return 'customactive';
                };
                // stateParam equal category.id
                $scope.isActiveCategory = function(cid) {
                    cid = parseInt(cid);
                    $stateParams.cid  = typeof $stateParams.cid  !== 'undefined' ? parseInt($stateParams.cid)  : 0;        
                    if($stateParams.cid === cid) return 'active';                
                };            

                angular.element(document).ready(function ($scope) {
                    if(AuthenticationService.isLoggedIn()){
                        angular.element(document.querySelector('#loginlogoutbutton')).html('Đăng xuất');
                        angular.element(document.querySelector('#loginlogoutbutton')).attr('href', '#logout?so=0');
                    }
                    else{
                        angular.element(document.querySelector('#loginlogoutbutton')).html('Đăng nhập');
                        angular.element(document.querySelector('#loginlogoutbutton')).attr('href', '#login?so=0');
                    }
                });  
        }
    ])        
});

