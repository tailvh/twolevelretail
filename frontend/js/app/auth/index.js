/*
*   AUTHENTICATION MODULE
* */
define(['angular'], function(ng) {
    'use strict';

    return ng.module('app.auth', ['ui.router.state'])
        .config(['$stateProvider', function ($stateProvider){
            $stateProvider

                ///////////////////////////
                // AUTHENTICATION MODULE //
                ///////////////////////////
                .state( 'login', {
                    url: '/login',
                    templateUrl: 'js/app/auth/login.html',
                    controller: 'LoginController'

                })
                .state( 'logout', {
                    url: '/logout',                   
                    controller: 'LogoutController'
                })
        }])
        .controller("LoginController", ['$scope', '$rootScope', '$location', 'AuthenticationService',
            function($scope, $rootScope, $location, AuthenticationService) {
                $scope.credentials = { email: "", password: "" };
                
                $scope.login = function() {
                    AuthenticationService.login($scope.credentials).success(function() {

                        // set login to logout button
                        $location.path('/admin/order/view/1');
                        angular.element(document.querySelector('#loginlogoutbutton')).html('LOGOUT');
                        angular.element(document.querySelector('#loginlogoutbutton')).attr('href', '#logout');                    

                        angular.element(document.querySelector('.modal-backdrop')).remove();
                    });                
                };
            }
        ])
        .controller("LogoutController", ['$scope', '$location', 'AuthenticationService',  
            function($scope, $location, AuthenticationService) {
                angular.element(document).ready( function ($scope) {
                    AuthenticationService.logout().success(function() {
                        $location.path('/home');

                        angular.element(document.querySelector('#loginlogoutbutton')).html('LOGIN');
                        angular.element(document.querySelector('#loginlogoutbutton')).attr('href', '#login');
                    });
                });
            }
        ]);
});