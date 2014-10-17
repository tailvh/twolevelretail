//////////////////////
// DASHBOARD MODULE //
//////////////////////
define(['angular'], function (ng) {
    'use strict';

    return ng.module('app.dashboard', ['ui.router.state', 'ngAnimate'])
        
        ///////////////////////
        // ADMIN MAIN MODULE //
        ///////////////////////
        .config(['$stateProvider', function ($stateProvider ) {
            $stateProvider
            .state( 'admin', {
                url:'/admin',
                templateUrl: 'js/app/admin/dashboard/admin.html',
                controller: 'AdminController'
            })
            /* //we test the new api structure here we will install it in next month
            // some thing need to install, server: helpers, app/start/global, routes, app/controller/api, client: service
            .state( 'admin.test', {
                url: '/test',
                views: {
                    'admin': 
                    {
                        templateUrl: 'js/app/admin/dashboard/admin.test.html',
                        controller: ['product', function(product){
                            var product = product.data;
                            console.log(product);
                            debugger
                        }],
                        resolve: {
                            product: ['ProductService', function(ProductService) {
                                return ProductService.find(26);
                            }]
                        }
                    }
                }
            })*/
            .state( 'admin.dashboard', {
                url:'/dashboard',
                views: {
                    'admin': {
                        templateUrl: 'js/app/admin/dashboard/admin.dashboard.html',
                        //controller: 'HomeController'
                    }
                }                
            })
            .state('admin.dashboard.view', {
                url:'/view',
                views: {
                    'dashboard': {
                        templateUrl: 'js/app/admin/dashboard/admin.dashboard.view.html',
                        controller: 'AdminDashboardViewController',
                        resolve: {
                            users: ['$stateParams', 'UserService', function($stateParams, UserService) {
                                return UserService.getUsers();
                            }],
                            orderDetailsReport: ['$stateParams', 'OrderService', function ($stateParams, OrderService) {
                                return OrderService.getOrderDetailsReport($stateParams.id);
                            }],
                            orderDetailsNeedInMonth: ['$stateParams', 'OrderService', function ($stateParams, OrderService) {
                                return OrderService.getOrderDetailsNeedInMonth($stateParams.id);
                            }],
                            usersNeedSupport: ['$stateParams', 'UserService', function($stateParams, UserService) {
                                return UserService.getUsersNeedSupport($stateParams.id);
                            }],
                            orderDetails: ['$stateParams', 'OrderService', function($stateParams, OrderService) {
                                return OrderService.getTreeOrderDetails();
                            }]
                        }
                    }
                }
            })                          
        }])
        .controller('AdminController', ['$scope', '$rootScope', 'SessionService', 
            function($scope, $rootScope, SessionService) {
                $rootScope.alerts =[];
                $scope.alerts = $rootScope.alerts;
                $scope.userRole = SessionService.get('userRole'); 
                $scope.addAlert = function() {
                    $rootScope.alerts.push({msg: "Another alert!"});
                };

                $scope.closeAlert = function(index) {
                    $rootScope.alerts.splice(index, 1);
                };

            }
        ])        
        .controller('AdminDashboardViewController', ['$scope', '$rootScope', '$window', '$filter', '$state', 'ngTableParams', 'SessionService', 'users', 'orderDetailsReport', 'orderDetailsNeedInMonth', 'usersNeedSupport', 'OrderService', 'UserService', 'googleChartApiPromise', 'orderDetails',
            function($scope, $rootScope, $window, $filter, $state, ngTableParams, SessionService, users, orderDetailsReport, orderDetailsNeedInMonth, usersNeedSupport, OrderService, UserService, googleChartApiPromise, orderDetails) {                                
                // order waiting ...
                $scope.data =  orderDetails.data;  
                $scope.datalength = orderDetails.data.length; 
                $scope.tableParams = new ngTableParams({
                    page: 1,
                    count: 5,
                    sorting: {
                        created_at: 'desc'     // initial sorting
                    }
                },{
                    total: $scope.datalength,
                    getData: function($defer, params) {                    
                        if(params.orderBy().length)
                            var orderedData = params.sorting()?$filter('orderBy')($scope.data, params.orderBy()):$scope.data;
                        else
                            var orderedData = $scope.data;

                        params.total(orderedData.length); 
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });

                $scope.htmlImageTooltip = function(image) {
                    var htmlTooltip = "<img width='180' height='200' src='assets/img/images/resized/product/resized-"+image+"'>";    
                    return htmlTooltip;
                }

                $scope.usersNeedSupport = usersNeedSupport.data;                
                $scope.support = function(user, f) {
                    UserService.supportUser(user.id).success(function(data){
                      if(data.success){
                          $rootScope.alerts.push({type: 'success', msg: 'Hỗ trợ thành công'});
                          if($rootScope.alerts.length > 1) $rootScope.alerts.splice(0, 1);                                
                          if(f == 1) 
                            $scope.usersNeedSupport.f1Users.splice($scope.usersNeedSupport.f1Users.indexOf(user), 1);
                          else 
                            $scope.usersNeedSupport.fnUsers.splice($scope.usersNeedSupport.fnUsers.indexOf(user), 1);   
                      }
                      else {
                          $rootScope.alerts.push({type: 'danger', msg: 'Hỗ trợ chưa thành công'});
                          if($rootScope.alerts.length > 1) $rootScope.alerts.splice(0, 1);
                      }
                    });
                }

                $scope.currentstate = $state.current.name;                                         
                var reportData = orderDetailsReport.data;                                  

                // alert data
                $scope.alert0 = reportData.alertData;                 
                $scope.currentUserId = SessionService.get('userId');            
                $scope.orderDetailsInMonth = orderDetailsNeedInMonth.data;            
                                
                $scope.chart = {
                  "type": "LineChart",
                  "displayed": true,
                  "data": reportData.chartData,
                  "options": {
                    "title": "Doanh số hệ thống theo tháng",
                    "isStacked": "true",
                    "fill": 20,
                    "displayExactValues": true,
                    "vAxis": {
                      "title": "Xu = 200.000đ",
                      "gridlines": {
                        "count": 10
                      }
                    },
                    "hAxis": {
                      "title": "Ngày - tháng - năm"
                    }
                  },
                  "formatters": {}
                };                                    
            }          
        ])
});