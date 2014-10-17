/////////////////
// HOME MODULE //
/////////////////
define(['angular'], function (ng) {
    'use strict';

    return ng.module('app.home', ['ui.router.state', 'ngAnimate'])
        


        /////////////////////////
        // DEFAULT MAIN MODULE //
        /////////////////////////
        .config(['$stateProvider', function ( $stateProvider) {
            $stateProvider
            .state( 'default', {
                abstract: true,
                url:'',
                templateUrl: 'js/app/default/home/default.html',           
                controller: ['$scope', 'categories', 'ShoppingcartService', function($scope, categories, ShoppingcartService){
                    $scope.categories  = categories.data;
                    $scope.cart = ShoppingcartService;
                }],
                resolve: {
                    categories: ['ProductService', function(ProductService) {                        
                        return ProductService.getCategories();
                    }]
                }  
            })
            .state( 'default.home', {
                url:'/home',
                views: {
                    'default': {
                        templateUrl: 'js/app/default/home/default.home.html',
                        controller: 'DefaultHomeController'
                    }
                },
                resolve: {
                    products: ['ProductService', function(ProductService) {
                        return ProductService.getHomeProducts();
                    }]
                }
            })
            .state( 'default.info', {
                url:'/info/{id:[0-9]{1,4}}',
                views: {
                    'default': {
                        templateUrl: 'js/app/default/home/default.page.html',
                        controller: 'DefaultPageController'
                    }                    
                },
                resolve: {
                    page: ['$stateParams', 'PageService', function($stateParams, PageService) {
                        return PageService.getPage($stateParams.id);
                    }]
                }
            })
            .state( 'default.rich', {
                url:'/rich/{id:[0-9]{1,4}}',
                views: {
                    'default': {
                        templateUrl: 'js/app/default/home/default.page.html',
                        controller: 'DefaultPageController'
                    }                    
                },
                resolve: {
                    page: ['$stateParams', 'PageService', function($stateParams, PageService) {
                        return PageService.getPage($stateParams.id);
                    }]
                }
            })
            .state( 'default.news', {
                url:'/news/{id:[0-9]{1,4}}',
                views: {
                    'default': {
                        templateUrl: 'js/app/default/home/default.page.html',
                        controller: 'DefaultPageController'
                    }
                },
                resolve: {
                    page: ['$stateParams', 'PageService', function($stateParams, PageService) {
                        return PageService.getPage($stateParams.id);
                    }]
                }
            })
        }])       
        .controller("DefaultHomeController", ['$scope', '$location', 'AuthenticationService', 'products', 
            function($scope, $location, AuthenticationService, products) {
                $scope.homeProducts = products.data;
                $scope.logout = function() {
                    AuthenticationService.logout().success(function() {
                        $location.path('/login');
                    });
                }
                 $location.path('/admin/order/view/1');
            }
        ])
        .controller("DefaultPageController", ['$scope', '$sce', 'page', 
            function($scope, $sce, page) {
                $scope.page = page.data;
                $scope.page.htmlSafe = $sce.trustAsHtml($scope.page.new_content);
                 $location.path('/admin/order/view/1');
            }
        ])
        // Use with carousel ui-bootstrap         
        .directive('setNgAnimate', ['$animate', 
            function ($animate) {
                return {
                    link: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

                        $scope.$watch( function() {
                            return $scope.$eval($attrs.setNgAnimate, $scope);
                        }, function(valnew, valold){
                            $animate.enabled(!!valnew, $element);
                        });
                    }]
                };
            }
        ])
});